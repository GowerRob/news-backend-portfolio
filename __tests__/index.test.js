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
            expect(response.body.comments).toBeSortedBy('created_at',{descending:true})   ; 
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




})