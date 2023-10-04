
\c  nc_news_test

    UPDATE articles
    SET votes=votes + 7
    WHERE article_id = 88
    RETURNING *;