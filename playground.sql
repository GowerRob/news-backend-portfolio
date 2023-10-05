<<<<<<< HEAD

\c  nc_news_test

<<<<<<< HEAD
    SELECT articles.author,articles.title,
        articles.article_id,articles.topic,
        articles.created_at,articles.votes, 
        articles.article_img_url, COUNT(comments.comment_id) as comment_count
        FROM articles
        LEFT JOIN comments On articles.article_id=comments.article_id GROUP BY articles.article_id
        ORDER BY created_at DESC;
=======
    UPDATE articles
    SET votes=votes + 7
    WHERE article_id = 88
    RETURNING *;
=======
\c  nc_news_test
>>>>>>> main
>>>>>>> main
