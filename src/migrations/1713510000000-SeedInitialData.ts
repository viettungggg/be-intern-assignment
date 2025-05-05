import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1713510000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users (id, firstName, lastName, email, createdAt, updatedAt)
      VALUES
        (1, 'Tung', 'Dinh', 'tung@abc.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (2, 'Quan',   'Pham', 'quan@xyz.com',   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `);

    await queryRunner.query(`
      INSERT INTO hashtags (id, tag)
      VALUES
        (1, 'fun'),
        (2, 'testtag');
    `);

    await queryRunner.query(`
        INSERT INTO posts (id, content, authorId, createdAt)
        VALUES
          (1, 'Hello world',      1, CURRENT_TIMESTAMP),
          (2, 'Testing #testtag', 2, CURRENT_TIMESTAMP);
      `);
      

    await queryRunner.query(`
      INSERT INTO post_hashtags (postsId, hashtagsId)
      VALUES
        (1, 1),
        (2, 2);
    `);

    await queryRunner.query(`
      INSERT INTO follows (followerId, followeeId, createdAt)
      VALUES
        (1, 2, CURRENT_TIMESTAMP);
    `);

    await queryRunner.query(`
      INSERT INTO likes (userId, postId, createdAt)
      VALUES
        (1, 2, CURRENT_TIMESTAMP);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM likes;`);
    await queryRunner.query(`DELETE FROM follows;`);
    await queryRunner.query(`DELETE FROM post_hashtags;`);
    await queryRunner.query(`DELETE FROM posts;`);
    await queryRunner.query(`DELETE FROM hashtags;`);
    await queryRunner.query(`DELETE FROM users;`);
  }
}
