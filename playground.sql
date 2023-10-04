\c  nc_news_test

SELECT  articles.author,articles.title,
    articles.article_id,articles.topic,
    articles.created_at,articles.votes, 
    articles.article_img_url, 
    CAST(COUNT(comments.article_id) as INTEGER) as comment_count 
    FROM articles
    LEFT JOIN comments On articles.article_id=comments.article_id
    GROUP BY articles.article_id
    ORDER BY comment_count ASC;
    