\c  nc_news_test

SELECT  articles.author,articles.title,
        articles.article_id,articles.topic,
        articles.created_at,articles.votes, 
        articles.article_img_url, COUNT(comments.comment_id)
FROM articles
JOIN comments On articles.article_id=comments.article_id
GROUP BY articles.article_id
ORDER BY created_at;


SELECT  articles.author,articles.title,
        articles.article_id,articles.topic,
        articles.created_at,articles.votes, 
        articles.article_img_url, COUNT(comments.comment_id)
FROM articles
JOIN comments On articles.article_id=comments.article_id
GROUP BY articles.article_id
ORDER BY created_at DESC;