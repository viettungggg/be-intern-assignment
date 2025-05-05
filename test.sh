#!/bin/bash

# Base URLs
USERS_URL="http://localhost:3000/api/users"
HASHTAGS_URL="http://localhost:3000/api/hashtags"
POSTS_URL="http://localhost:3000/api/posts"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo "Request: $method $endpoint"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    if [ "$method" = "GET" ]; then
        curl -s -X $method "$endpoint" | jq .
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq .
    fi
    echo ""
}

# ─── Users ─────────────────────────────────────────────────────────────────────

test_get_all_users() {
    print_header "GET all users"
    make_request "GET" "$USERS_URL"
}

test_get_user() {
    print_header "GET user by ID"
    read -p "Enter user ID: " user_id
    make_request "GET" "$USERS_URL/$user_id"
}

test_create_user() {
    print_header "POST create user"
    read -p "First name: " firstName
    read -p "Last name: " lastName
    read -p "Email: " email
    
    local user_data=$(cat <<EOF
{
  "firstName":"$firstName",
  "lastName":"$lastName",
  "email":"$email"
}
EOF
)
    make_request "POST" "$USERS_URL" "$user_data"
}

test_update_user() {
    print_header "PUT update user"
    read -p "User ID: " user_id
    read -p "New first name (or blank): " firstName
    read -p "New last name (or blank): " lastName
    read -p "New email (or blank): " email
    
    local body="{"
    local sep=""
    [ -n "$firstName" ] && body+="${sep}\"firstName\":\"$firstName\"" && sep=","
    [ -n "$lastName" ]  && body+="${sep}\"lastName\":\"$lastName\""   && sep=","
    [ -n "$email" ]     && body+="${sep}\"email\":\"$email\""         && sep=","
    body+="}"
    
    make_request "PUT" "$USERS_URL/$user_id" "$body"
}

test_delete_user() {
    print_header "DELETE user"
    read -p "User ID: " user_id
    make_request "DELETE" "$USERS_URL/$user_id"
}

# ─── Hashtags ─────────────────────────────────────────────────────────────────

test_get_all_hashtags() {
    print_header "GET all hashtags"
    make_request "GET" "$HASHTAGS_URL"
}

test_get_hashtag() {
    print_header "GET hashtag by ID"
    read -p "Hashtag ID: " tag_id
    make_request "GET" "$HASHTAGS_URL/$tag_id"
}

test_create_hashtag() {
    print_header "POST create hashtag"
    read -p "Tag (no #): " tag
    local data="{\"tag\":\"$tag\"}"
    make_request "POST" "$HASHTAGS_URL" "$data"
}

test_update_hashtag() {
    print_header "PUT update hashtag"
    read -p "Hashtag ID: " tag_id
    read -p "New tag (no #): " tag
    local data="{\"tag\":\"$tag\"}"
    make_request "PUT" "$HASHTAGS_URL/$tag_id" "$data"
}

test_delete_hashtag() {
    print_header "DELETE hashtag"
    read -p "Hashtag ID: " tag_id
    make_request "DELETE" "$HASHTAGS_URL/$tag_id"
}

# ─── Posts ────────────────────────────────────────────────────────────────────

test_list_posts() {
    print_header "GET all posts"
    make_request "GET" "$POSTS_URL"
}

test_get_post() {
    print_header "GET post by ID"
    read -p "Post ID: " post_id
    make_request "GET" "$POSTS_URL/$post_id"
}

test_create_post() {
    print_header "POST create post"
    read -p "Author ID: " authorId
    read -p "Content: " content
    read -p "Hashtags (comma-separated, include #): " raw_tags
    IFS=',' read -ra tags <<< "$raw_tags"
    local json_tags=$(printf '"%s",' "${tags[@]}")
    json_tags="[${json_tags%,}]"
    local data=$(cat <<EOF
{
  "authorId":$authorId,
  "content":"$content",
  "hashtags":$json_tags
}
EOF
)
    make_request "POST" "$POSTS_URL" "$data"
}

test_update_post() {
    print_header "PUT update post"
    read -p "Post ID: " post_id
    read -p "New content (or blank): " content
    read -p "New hashtags (comma-separated, include #, or blank): " raw_tags
    local body="{"
    local sep=""
    if [ -n "$content" ]; then
      body+="${sep}\"content\":\"$content\"" && sep=","
    fi
    if [ -n "$raw_tags" ]; then
      IFS=',' read -ra tags <<< "$raw_tags"
      json_tags=$(printf '"%s",' "${tags[@]}")
      body+="${sep}\"hashtags\":[${json_tags%,}]" && sep=","
    fi
    body+="}"
    make_request "PUT" "$POSTS_URL/$post_id" "$body"
}

test_delete_post() {
    print_header "DELETE post"
    read -p "Post ID: " post_id
    make_request "DELETE" "$POSTS_URL/$post_id"
}

# ─── Follows ──────────────────────────────────────────────────────────────────

test_follow_user() {
    print_header "POST follow user"
    read -p "Followee ID: " followee
    read -p "Follower ID: " follower
    local data="{\"followerId\":$follower}"
    make_request "POST" "$USERS_URL/$followee/follow" "$data"
}

test_unfollow_user() {
    print_header "DELETE unfollow user"
    read -p "Followee ID: " followee
    read -p "Follower ID: " follower
    local data="{\"followerId\":$follower}"
    make_request "DELETE" "$USERS_URL/$followee/follow" "$data"
}

# ─── Likes ───────────────────────────────────────────────────────────────────

test_like_post() {
    print_header "POST like post"
    read -p "Post ID: " post_id
    read -p "User ID: " user
    local data="{\"userId\":$user}"
    make_request "POST" "$POSTS_URL/$post_id/like" "$data"
}

test_unlike_post() {
    print_header "DELETE unlike post"
    read -p "Post ID: " post_id
    read -p "User ID: " user
    local data="{\"userId\":$user}"
    make_request "DELETE" "$POSTS_URL/$post_id/like" "$data"
}

# ─── Special Endpoints ────────────────────────────────────────────────────────

test_feed() {
    print_header "GET feed"
    read -p "User ID: " user_id
    read -p "Limit (or blank): " limit
    read -p "Offset (or blank): " offset
    local qs="userId=$user_id"
    [ -n "$limit" ]  && qs+="&limit=$limit"
    [ -n "$offset" ] && qs+="&offset=$offset"
    make_request "GET" "http://localhost:3000/api/feed?$qs"
}

test_posts_by_hashtag() {
    print_header "GET posts by hashtag"
    read -p "Hashtag (no #): " tag
    read -p "Limit (or blank): " limit
    read -p "Offset (or blank): " offset
    local qs="limit=${limit:-}&offset=${offset:-}"
    make_request "GET" "$POSTS_URL/hashtag/$tag?$qs"
}

test_get_followers() {
    print_header "GET user's followers"
    read -p "User ID: " user_id
    read -p "Limit (or blank): " limit
    read -p "Offset (or blank): " offset
    local qs="limit=${limit:-}&offset=${offset:-}"
    make_request "GET" "$USERS_URL/$user_id/followers?$qs"
}

test_get_activity() {
    print_header "GET user activity"
    read -p "User ID: " user_id
    read -p "Limit (or blank): " limit
    read -p "Offset (or blank): " offset
    local qs="limit=${limit:-}&offset=${offset:-}"
    make_request "GET" "$USERS_URL/$user_id/activity?$qs"
}

# ─── Menus ────────────────────────────────────────────────────────────────────

show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Back"
    echo -n "Choice: "
}

show_hashtags_menu() {
    echo -e "\n${GREEN}Hashtags Menu${NC}"
    echo "1. Get all hashtags"
    echo "2. Get hashtag by ID"
    echo "3. Create hashtag"
    echo "4. Update hashtag"
    echo "5. Delete hashtag"
    echo "6. Back"
    echo -n "Choice: "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. List all posts"
    echo "2. Get post by ID"
    echo "3. Create post"
    echo "4. Update post"
    echo "5. Delete post"
    echo "6. Back"
    echo -n "Choice: "
}

show_follows_menu() {
    echo -e "\n${GREEN}Follows Menu${NC}"
    echo "1. Follow user"
    echo "2. Unfollow user"
    echo "3. Back"
    echo -n "Choice: "
}

show_likes_menu() {
    echo -e "\n${GREEN}Likes Menu${NC}"
    echo "1. Like post"
    echo "2. Unlike post"
    echo "3. Back"
    echo -n "Choice: "
}

show_special_menu() {
    echo -e "\n${GREEN}Special Endpoints Menu${NC}"
    echo "1. Feed"
    echo "2. Posts by hashtag"
    echo "3. Get followers"
    echo "4. Get activity"
    echo "5. Back"
    echo -n "Choice: "
}

show_main_menu() {
    echo -e "\n${GREEN}API Testing Menu${NC}"
    echo "1. Users"
    echo "2. Hashtags"
    echo "3. Posts"
    echo "4. Follows"
    echo "5. Likes"
    echo "6. Special Endpoints"
    echo "7. Exit"
    echo -n "Choice: "
}

# ─── Main Loop ─────────────────────────────────────────────────────────────────

while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read c
                case $c in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) break ;;
                    *) echo "Invalid choice." ;;
                esac
            done
            ;;
        2)
            while true; do
                show_hashtags_menu
                read c
                case $c in
                    1) test_get_all_hashtags ;;
                    2) test_get_hashtag ;;
                    3) test_create_hashtag ;;
                    4) test_update_hashtag ;;
                    5) test_delete_hashtag ;;
                    6) break ;;
                    *) echo "Invalid choice." ;;
                esac
            done
            ;;
        3)
            while true; do
                show_posts_menu
                read c
                case $c in
                    1) test_list_posts ;;
                    2) test_get_post ;;
                    3) test_create_post ;;
                    4) test_update_post ;;
                    5) test_delete_post ;;
                    6) break ;;
                    *) echo "Invalid choice." ;;
                esac
            done
            ;;
        4)
            while true; do
                show_follows_menu
                read c
                case $c in
                    1) test_follow_user ;;
                    2) test_unfollow_user ;;
                    3) break ;;
                    *) echo "Invalid choice." ;;
                esac
            done
            ;;
        5)
            while true; do
                show_likes_menu
                read c
                case $c in
                    1) test_like_post ;;
                    2) test_unlike_post ;;
                    3) break ;;
                    *) echo "Invalid choice." ;;
                esac
            done
            ;;
        6)
            while true; do
                show_special_menu
                read c
                case $c in
                    1) test_feed ;;
                    2) test_posts_by_hashtag ;;
                    3) test_get_followers ;;
                    4) test_get_activity ;;
                    5) break ;;
                    *) echo "Invalid choice." ;;
                esac
            done
            ;;
        7) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice." ;;
    esac
done
