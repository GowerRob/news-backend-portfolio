\c nc_news_test
    SELECT * FROM comments;


    INSERT INTO comments (body, article_id, author)
    VALUES ('This is great',1,'lurker');

     SELECT * FROM comments;
    
