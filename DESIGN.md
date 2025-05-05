# Design Overview

## Schema & Relationships

- **users**  
  - Columns: `id (PK)`, `firstName`, `lastName`, `email (unique)`, `createdAt`, `updatedAt`  
  - Relations: writes posts, follows others (via `follows`), likes posts (via `likes`).

- **posts**  
  - Columns: `id (PK)`, `content`, `createdAt`, `authorId (FK → users.id)`  
  - Relations: belongs to a user, has many likes, and tags via the `post_hashtags` junction.

- **hashtags**  
  - Columns: `id (PK)`, `tag (unique, lowercase)`  
  - Relations: linked to posts through `post_hashtags` for many-to-many tagging.

- **post_hashtags** (junction)  
  - Columns: `postsId (FK → posts.id)`, `hashtagsId (FK → hashtags.id)`  
  - Composite PK on (`postsId`, `hashtagsId`) to prevent duplicate tags.

- **follows**  
  - Columns: `followerId (FK → users.id)`, `followeeId (FK → users.id)`, `createdAt`  
  - Composite PK on (`followerId`, `followeeId`) to ensure a user can only follow once.

- **likes**  
  - Columns: `userId (FK → users.id)`, `postId (FK → posts.id)`, `createdAt`  
  - Composite PK on (`userId`, `postId`) to prevent double-likes.

---

## Indexing Strategy

- **users(email)** – quick lookups by email.  
- **hashtags(tag)** – fast tag searches.  
- **posts(authorId, createdAt DESC)** – fetch a user’s latest posts quickly.  
- **follows(followeeId, createdAt DESC)** – paginate followers efficiently.  
- **likes(postId)** & **likes(userId)** – speed up like counts and toggles.  
- **post_hashtags(postsId)** & **post_hashtags(hashtagsId)** – speedy tag-to-post queries.

These indexes keep our main queries around O(log n) or better.

---

## Scalability Tips

- **Read replicas**: offload read-heavy queries (feeds, tag searches).  
- **Cache layer**: use Redis for hot data like feeds, counts, and popular tag lists.  
- **Cursor-based pagination**: use `(createdAt, id)` cursors instead of large offsets.  
- **Sharding**: split data by user or post ID hash when scale demands.  
- **Background jobs**: recalculate heavy aggregates offline (e.g. trending tags).

---

## Other Notes

- Consider **soft deletes** (`deletedAt`) for undo/auditing.  
- Validate inputs (Joi) to prevent bad or malicious data.  
- Keep an eye on slow queries and set up alerts for errors and latency spikes.  
