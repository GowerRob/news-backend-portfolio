\c  nc_news_test

SELECT  articles.author,articles.title,
    articles.article_id,articles.topic,
    articles.created_at,articles.votes, 
    articles.article_img_url, COUNT(comments.comment_id) as comment_count
    FROM articles
    LEFT JOIN comments On articles.article_id=comments.article_id
    WHERE articles.topic = 'mitch'
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    


