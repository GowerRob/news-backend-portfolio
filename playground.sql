<<<<<<< HEAD
\c nc_news_test
    SELECT * FROM comments;


    INSERT INTO comments (body, article_id, author)
    VALUES ('This is great',1,'lurker');

     SELECT * FROM comments;
    
=======
\c  nc_news_test
SELECT articles.author,articles.title,
        articles.article_id, articles.body,
        articles.topic, articles.created_at,
        articles.votes, articles.article_img_url,
        CAST(COUNT(comments.article_id) as INTEGER) as comment_count 
FROM articles
LEFT JOIN comments ON articles.article_id=comments.article_id
WHERE articles.article_id = 2
GROUP BY articles.article_id;
>>>>>>> main
