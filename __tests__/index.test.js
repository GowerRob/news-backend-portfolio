const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData= require('../db/data/test-data/index.js');

beforeEach(()=>seed(testData));
afterAll(()=>db.end());

describe('/api/topics',()=>{
    test('GET 200 status coded return on get request',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
    })
    test('GET request should return an array of topic objects',()=>{
        return request(app)
        .get('/api/topics')
        .then(({body})=>{
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic)=>{
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string');
            })
        })
    })
})


describe('/api',()=>{
    test('get request will return a status code 200 and an object containing the api data',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then((response)=>{
            expect(typeof response.body).toBe('object')
            for(const endpoint in response.body){
                expect(Object.keys(response.body[endpoint]).includes('description'))
                expect(Object.keys(response.body[endpoint]).includes('queries'))
                expect(Object.keys(response.body[endpoint]).includes('exampleResponse'))
            }
        })
        
        })
    test('when a non-existant endpoint is provided, return 404/bad request',()=>{
        return request(app)
        .get('/api/bananas')
        .expect(404)
        .then((res)=>{
            expect(res.body.msg).toBe('bad request')
        })
    })
})


describe('GET /api/articles/:article_id',()=>{
    test('to get a 200 code',()=>{
        return request(app)
        .get('/api/articles/4')
        .expect(200)
    })
    test('to retrieve an article by its id passed in the endpoint path DYNAMIC',()=>{
        return request(app)
        .get('/api/articles/2')
        .then((response)=>{
            expect(response.body.article).toMatchObject({
                author: expect.any(String),
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                article_img_url: expect.any(String),
                votes: expect.any(Number)
            })
        })
    })
    test('to get a 404 and sends an appropriate status and error message when given a valid but non-existent id',()=>{
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('Article does not exist')
        })
    })
    test('to get a 400 and sends an appropriate status and error message when given an invalid code',()=>{
        return request(app)
        .get('/api/articles/give-me-the-best-article')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('Bad request')
        })
    });


})



describe('GET /api/articles/:article_id/comments',()=>{
        test('to get a 200 code',()=>{
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
        })


    test('expect an array of comments, sorted descending by date, when comments exist',()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response)=>{
            expect(response.body.comments.length).not.toBe(0);
            response.body.comments.forEach((comment)=>{
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                })
            })
            expect(response.body.comments).toBeSortedBy('created_at',{descending:true})  ; 
        })
    })

});


describe('GET /api/articles',()=>{
    test('to get a 200 code from the get request',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
    })

    test('expect an array of objects with the correct keys',()=>{
        return request(app)
        .get('/api/articles')
        .then((response)=>{
            expect(response.body.articles.length).not.toBe(0);
            response.body.articles.forEach((article)=>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                })
            })
        })
    })

    test('expect the articles to be ordered descending by created at',()=>{
        return request(app)
        .get('/api/articles')
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('created_at',{descending:true})
        })
    })


    test('expect a 200 when an id that exists but no comments are related to it',()=>{
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then((response)=>{
            expect(response.body.comments.length).toBe(0);
        })
    })

    test('to get a 404 and sends an appropriate status and error message when given a valid code that does not exist',()=>{
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('No article with that id');
        })
    });

    test('to get a 400 and sends an appropriate status and error message when given an invalid',()=>{
        return request(app)
        .get('/api/articles/apples/comments')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('Bad request');
        })
    });

});


describe.only('GET /apri/articles (topic query',()=>{
    test('return a 200 code when a request is made to the api',()=>{
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
    })
    test('return a 200 code and allarticles filtered by query when a valid request is made to the api "mitch"',()=>{
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(12)
        })
    })
    test('return a 200 code and all articles filtered by query when a valid request is made to the api "cats"',()=>{
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(1)
        })
    })
    test('return a 200 code and all articles filtered by query when a valid request is made to the api "paper"',()=>{
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(0)
        })
    })
    test('return a 404 code and msg when passed a valid by non-existant query',()=>{
        return request(app)
        .get('/api/articles?topic=trees')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('No topic with that id')
        })
    })
    test('return a 200 code when passed an empty query, eg. query would be looking for an topic= empty string',()=>{
        return request(app)
        .get('/api/articles?topic=')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(0)
        })
    })

})