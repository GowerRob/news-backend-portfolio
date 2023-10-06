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
        .get('/api/articles?limit=13')
        .then((response)=>{
            expect(response.body.articles.length).toBe(13);
            response.body.articles.forEach((article)=>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
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
});



describe('POST /api/articles/:article_id/comments',()=>{
    test('get a 201 code',()=>{
        const newComment={body:"This is a really good article", username:"lurker"};
        
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)

    })
    test('expect a 200 when an id that exists but no comments are related to it',()=>{
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then((response)=>{
            expect(response.body.comments.length).toBe(0);
        })
    })
    test('get a 201 code and the inserted comment returned when posting with a valid username and article id',()=>{
        const newComment=
        {body:"This is a really good article", 
        username:"lurker"};
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then((response)=>{
            expect(response.body.comment.body).toBe('This is a really good article')
            expect(response.body.comment.author).toBe('lurker')
            expect(response.body.comment.votes).toBe(0)
            expect(response.body.comment.article_id).toBe(1)
        })
    })

    test('get a 201 code and the inserted comment returned when posting with a valid username and article id, but also unnecessary properties',()=>{
        const newComment=
        {body:"This is a really good article", 
        username:"lurker",
        hairColour:"Yes"};
        
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then((response)=>{
            expect(response.body.comment.body).toBe('This is a really good article')
            expect(response.body.comment.author).toBe('lurker')
            expect(response.body.comment.votes).toBe(0)
            expect(response.body.comment.article_id).toBe(1)
            expect(response.body.comment.hasOwnProperty('hairColour')).toBe(false);
        })
    })

    test('get a 400 code when trying to insert a comment with missing property',()=>{
        const newComment=
        {body:"This is a really good article"};
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('Bad request')
        })
    })

    test('get a 404 code and error message when posting to an article that does not exist (but could)-> 77',()=>{
        const newComment=
        {body:"This is a really good article", 
        username:"lurker"};
        
        return request(app)
        .post('/api/articles/77/comments')
        .send(newComment)
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('Not found')
        })
    })
    test('get a 400 code and error message when the article id is invalid (not possible id) -> cheese',()=>{
        const newComment=
        {body:"This is a really good article", username:"lurker"};
    
        return request(app)
        .post('/api/articles/cheese/comments')
        .send(newComment)
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('Bad request')
        })
    })
    test('get a 404 code and error message when posting to a valid article but as an invalid username',()=>{
        const newComment=
        {body:"This is a really good article", 
        username:"glasses2020"};
        
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('Not found')
        })
    })

    test('to get a 404 and sends an appropriate status and error message when given a valid code that does not exist',()=>{
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('Article does not exist');
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

describe('PATCH /api/articles/:article_id',()=>{
    test('when a valid positive patch is posted, returns a 201 code and an updated article object',()=>{
        const patchData={inc_votes:7};
        return request(app)
        .patch('/api/articles/1')
        .send(patchData)
        .expect(201)
        .then((response)=>{
                expect(response.body.article).toMatchObject({
                    article_id: 1,
                    title: ('Living in the shadow of a great man'),
                    topic: ('mitch'),
                    author: ('butter_bridge'),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: 107,
                })
        })
    })
    test('when a valid negative patch is posted, returns a 201 code and an updated article object',()=>{
        const patchData={inc_votes:-50};
        return request(app)
        .patch('/api/articles/1')
        .send(patchData)
        .expect(201)
        .then((response)=>{
                expect(response.body.article).toMatchObject({
                    article_id: 1,
                    title: ('Living in the shadow of a great man'),
                    topic: ('mitch'),
                    author: ('butter_bridge'),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: 50,
                })
        })
    })

    test('when an invalid patch is posted, returns a 400 and error message',()=>{
        const patchData={inc_votes:"banana"};
        return request(app)
        .patch('/api/articles/1')
        .send(patchData)
        .expect(400)
        .then((response)=>{
               expect(response.body.msg).toBe('Bad request')
        })
    })

    test('when an valid patch is posted to an article that doesnt exist eg. 88, returns a 404 and error message',()=>{
        const patchData={inc_votes:200};
        return request(app)
        .patch('/api/articles/88')
        .send(patchData)
        .expect(404)
        .then((response)=>{
               expect(response.body.msg).toBe('Article does not exist')
        })
    })

    test('when an valid patch is posted to an invalid article id eg. pen, returns a 400 and error message',()=>{
        const patchData={inc_votes:200};

        return request(app)
        .patch('/api/articles/pen')
        .send(patchData)
        .expect(400)
        .then((response)=>{
               expect(response.body.msg).toBe('Bad request')
        })
    })
    test('when a valid positive patch with extra properties is posted, returns a 201 code and an updated article object',()=>{
        const patchData={inc_votes:7, extraKey:'hello'};
        return request(app)
        .patch('/api/articles/1')
        .send(patchData)
        .expect(201)
        .then((response)=>{
                expect(response.body.article).toMatchObject({
                    article_id: 1,
                    title: ('Living in the shadow of a great man'),
                    topic: ('mitch'),
                    author: ('butter_bridge'),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: 107,
                })
        })
    })




});
describe('DELETE /api/comments/:comment_id',()=>{
    test('returns a 204 and no content',()=>{
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
    })

    test('Returns a 404 and message when an id that does not exist is provided eg. 99',()=>{
        return request(app)
        .delete('/api/comments/99')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('No comment with that id')
        })
    })

    test('Returns a 400 and message when an id that does not exist is provided eg. mouse',()=>{
        return request(app)
        .delete('/api/comments/mouse')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('Bad request')
        })
    })


})


describe('GET /api/articles/:article_id (comment_count)',()=>{
    test('return article when count non 0',()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response)=>{
            expect(response.body.article.comment_count).toBe(11)
        })
    })
   
   
    test('return article when count is 0',()=>{
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((response)=>{
            expect(response.body.article.comment_count).toBe(0)

        })
    })

})

describe('GET /api/articles (topic query',()=>{
    test('return a 200 code and all articles filtered by query when a valid request is made to the api "mitch"',()=>{

        return request(app)
        .get('/api/articles?topic=mitch&limit=20')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(12)
            response.body.articles.forEach((article)=>{
                expect(article).toMatchObject({
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: "mitch",
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
    test('return a 200 code - no articles associated with query',()=>{
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(0)
        })
    })
    test('return a 404 when topic not found',()=>{
        return request(app)
        .get('/api/articles?topic=pens')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('No topic with that id')
        })

    })

})


describe('GET /api/users',()=>{
    test('get a 200 reponse when making a get request',()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
    })

    test('should return an array of all users with correct properties',()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response)=>{
            expect(response.body.users.length).toBe(4);
            response.body.users.forEach((user)=>{
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
                })
            })
        })
    })

})

describe('POST /api/articles',()=>{
        test('get a 201 code when posting a valid article (no img_url provide)',()=>{
            const newArticle={
                author:"rogersop",
                title:"Getting Jam Off Cats",
                body:"First you need to ask yourself how did the jam get on the cat?",
                topic:"cats",
                };
            
            return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then((response)=>{
                expect(response.body.article.article_id).toBe(14)
                expect(response.body.article.title).toBe('Getting Jam Off Cats')
                expect(response.body.article.topic).toBe('cats')
                expect(response.body.article.author).toBe('rogersop')
                expect(response.body.article.body).toBe('First you need to ask yourself how did the jam get on the cat?')
                expect(typeof response.body.article.created_at).toBe('string')
                expect(response.body.article.votes).toBe(0)
                expect(response.body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
                
            })
    
        })

        test('get a 201 code when posting a valid article (img_url provided)',()=>{
            const newArticle={
                author:"rogersop",
                title:"Getting Jam Off Cats",
                body:"First you need to ask yourself how did the jam get on the cat?",
                topic:"cats",
                article_img_url:"https://my_custom_image_url.com/1.jpeg"
                };
            
            return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then((response)=>{
                expect(response.body.article.article_id).toBe(14)
                expect(response.body.article.title).toBe('Getting Jam Off Cats')
                expect(response.body.article.topic).toBe('cats')
                expect(response.body.article.author).toBe('rogersop')
                expect(response.body.article.body).toBe('First you need to ask yourself how did the jam get on the cat?')
                expect(typeof response.body.article.created_at).toBe('string')
                expect(response.body.article.votes).toBe(0)
                expect(response.body.article.article_img_url).toBe("https://my_custom_image_url.com/1.jpeg")
            })
        })

        test('get a 201 code when posting a valid article with extra properties',()=>{
            const newArticle={
                author:"rogersop",
                title:"Getting Jam Off Cats",
                body:"First you need to ask yourself how did the jam get on the cat?",
                topic:"cats",
                article_img_url:"https://my_custom_image_url.com/1.jpeg",
                ink_colour:"blue"
                };
            
            return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then((response)=>{
                expect(response.body.article.article_id).toBe(14)
                expect(response.body.article.title).toBe('Getting Jam Off Cats')
                expect(response.body.article.topic).toBe('cats')
                expect(response.body.article.author).toBe('rogersop')
                expect(response.body.article.body).toBe('First you need to ask yourself how did the jam get on the cat?')
                expect(typeof response.body.article.created_at).toBe('string')
                expect(response.body.article.votes).toBe(0)
                expect(response.body.article.article_img_url).toBe("https://my_custom_image_url.com/1.jpeg")
                expect(response.body.article.hasOwnProperty('ink_colour')).toBe(false);  
            })
        })

        test('get a 404 code when posting article with non-existant author',()=>{
            const newArticle={
                author:"wooly",
                title:"Getting Jam Off Cats",
                body:"First you need to ask yourself how did the jam get on the cat?",
                topic:"cats",
                article_img_url:"https://my_custom_image_url.com/1.jpeg",
                ink_colour:"blue"
                };
            
            return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe("Not found")
            })
        })

        test('get a 404 code when posting article with non-existant topic',()=>{
            const newArticle={
                author:"rogersop",
                title:"Getting Jam Off Cats",
                body:"First you need to ask yourself how did the jam get on the cat?",
                topic:"jam",
                article_img_url:"https://my_custom_image_url.com/1.jpeg",
                };
            
            return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe("Not found")
            })
        })

        test('get a 400 code when posting article with missing properties',()=>{
            const newArticle={
                title:"Getting Jam Off Cats",
                body:"First you need to ask yourself how did the jam get on the cat?",
                topic:"cats",
                article_img_url:"https://my_custom_image_url.com/1.jpeg",
                };
            
            return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe("Bad request")
            })
        })
        test('get a 201 code when posting article that attempts to overwrite a default property (overwritten property set to default',()=>{
            const newArticle={
                author:"rogersop",
                title:"Getting Jam Off Cats",
                body:"First you need to ask yourself how did the jam get on the cat?",
                topic:"cats",
                article_img_url:"https://my_custom_image_url.com/1.jpeg",
                votes:5000
                };
            
            return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then((response)=>{
                expect(response.body.article.article_id).toBe(14)
                expect(response.body.article.title).toBe('Getting Jam Off Cats')
                expect(response.body.article.topic).toBe('cats')
                expect(response.body.article.author).toBe('rogersop')
                expect(response.body.article.body).toBe('First you need to ask yourself how did the jam get on the cat?')
                expect(typeof response.body.article.created_at).toBe('string')
                expect(response.body.article.votes).toBe(0)
                expect(response.body.article.article_img_url).toBe("https://my_custom_image_url.com/1.jpeg")
            })
        })


})

describe('GET /api/articles (sorting queries)',()=>{
    test('returns all articles desc sorted as per the query when no order provided',()=>{
        return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('title', {descending:true})
        })
    })
    test('returns all articles sorted by as per the query when order provided',()=>{
        return request(app)
        .get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .then((response)=>{

            expect(response.body.articles).toBeSortedBy('votes')
        })
    })
    test('returns all articles sorted by as per the query when order provided with a non-native column name',()=>{
        return request(app)
        .get('/api/articles?sort_by=comment_count&order=asc')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('comment_count')
        })
    })

    test('returns all articles sorted by default (created) when asc order provided',()=>{
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles).toBeSortedBy('created_at')
        })
    })
})


describe('GET /api/users/:username',()=>{
    test('get a 200 code',()=>{
        return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
    })
    test('get a correct user object returned when given a valid exisiting user',()=>{
        return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then((response)=>{
            expect(response.body.user.username).toBe('butter_bridge');
            expect(response.body.user.name).toBe('jonny');
            expect(response.body.user.avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
        })

    })
    test('get a 404 when given a non-existant user',()=>{
        return request(app)
        .get('/api/users/butter_fingers')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('User does not exist')
        })
    })

})

describe('PATCH /api/comments/:comment_id',()=>{
    test('when a valid patch sent to a valid comment returns a 201 and an updated comment object',()=>{
        const patchData={ inc_votes:5};
        return request(app)
        .patch('/api/comments/1')
        .send(patchData)
        .expect(201)
        .then((response)=>{
            expect(response.body.comment).toMatchObject({
                comment_id:1,
                body:"Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                article_id: 9,
                votes: 21,
            })

        })
    })
    test('when a valid patch is sent to a non-existant comment, 404 and comment',()=>{
        const patchData={ inc_votes:5};
        return request(app)
        .patch('/api/comments/999')
        .send(patchData)
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe("Comment does not exist")
        })
    })
    test('when an valid patch is sent to an invalid comment_id, 400 and comment',()=>{
        const patchData={ inc_votes:5};
        return request(app)
        .patch('/api/comments/banana')
        .send(patchData)
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe("Bad request")
        })
    })
    test('when an invalid patch is sent to an valid comment_id',()=>{
        const patchData={ inc_votes:"banana"};
        return request(app)
        .patch('/api/comments/banana')
        .send(patchData)
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe("Bad request")
        })
    })
    test('when an valid patch is sent to an valid comment_id, but with extra properties, ignore properties',()=>{
        const patchData={ inc_votes:6, favourite_egg:"boiled"};
        return request(app)
        .patch('/api/comments/1')
        .send(patchData)
        .expect(201)

    })
})

describe('GET /api/articles (pagination)',()=>{
    test('responds with 200 and articles according to the limit and page passed',()=>{
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&limit=3&p=2')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(3)
            response.body.articles.forEach((article)=>{
                expect(Number(article.article_id)).toBeGreaterThanOrEqual(4)
                expect(Number(article.article_id)).toBeLessThan(7)
            })
        })
    })
    test('responds with 200 and default behaviour when query term omitted (p)',()=>{
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&limit=6')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(6)
            response.body.articles.forEach((article)=>{
                expect(Number(article.article_id)).toBeGreaterThanOrEqual(1)
                expect(Number(article.article_id)).toBeLessThan(7)
            })
        })
    })    
    test('responds with 200 and default behaviour when query term omitted limit',()=>{
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&p=2')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(3)
            response.body.articles.forEach((article)=>{
                expect(Number(article.article_id)).toBeGreaterThanOrEqual(11)
                expect(Number(article.article_id)).toBeLessThan(14)
            })
        })
    })
    test('responds with 200 and default behaviour when query both terms omitted',()=>{
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(10)
            response.body.articles.forEach((article)=>{
                expect(Number(article.article_id)).toBeGreaterThanOrEqual(1)
                expect(Number(article.article_id)).toBeLessThan(11)
            })
        })
    })

    test('responds with a 200 when a request is made out of range',()=>{
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&limit=10&p=5')
        .expect(200)
        .then((response)=>{
            expect(response.body.articles.length).toBe(0)
        })
    })

})

describe('GET /api/articles/:article_id/comments (pagination)',()=>{
    test('responds with 200 and comments according to the limit and page passed',()=>{
        return request(app)
        .get('/api/articles/1/comments?limit=3&p=1')
        .expect(200)
        .then((response)=>{
            expect(response.body.comments.length).toBe(3)
        })
    })

    test('responds with 200 and default behaviour when query term omitted (p)',()=>{
        return request(app)
        .get('/api/articles/1/comments?limit=4')
        .expect(200)
        .then((response)=>{
            expect(response.body.comments.length).toBe(4)
         })
        })

    test('responds with 200 and default behaviour when query term omitted (limit)',()=>{
        return request(app)
        .get('/api/articles/1/comments?p=1')
        .expect(200)
        .then((response)=>{
            expect(response.body.comments.length).toBe(10)
            })
        })

        test('responds with 200 and default behaviour when  both query terms omitted ',()=>{
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response)=>{
                expect(response.body.comments.length).toBe(10)
                })
            })

        test('responds with a 200 when a request is made out of range, with empty array',()=>{
            return request(app)
            .get('/api/articles?sort_by=article_id&order=asc&limit=10&p=6')
            .expect(200)
            .then((response)=>{
                expect(response.body.articles.length).toBe(0)
            })
        })
})

describe('POST /api/topics',()=>{
    test('responds with a 201 and returns the correctly inserted topic',()=>{
        const newTopic={
            slug:"headphones",
            description:"Useful for listening to music, or pretending you are listening to music"
            };
    
        return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then((response)=>{
            expect(response.body.topic.slug).toBe('headphones')
            expect(response.body.topic.description).toBe('Useful for listening to music, or pretending you are listening to music')
        })
    })

    test('responds with a 201 and returns the correctly inserted topic, when extra properties added',()=>{
        const newTopic={
            slug:"headphones",
            description:"Useful for listening to music, or pretending you are listening to music",
            extra:" This is extra"
            };
        return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then((response)=>{
            expect(response.body.topic.slug).toBe('headphones')
            expect(response.body.topic.description).toBe('Useful for listening to music, or pretending you are listening to music')
            expect(response.body.topic.hasOwnProperty('extra')).toBe(false);
        })
    })

    test('responds with a 400 when topic fields missing primary field slug',()=>{
        const newTopic={
            description:"headphones"
            };
        return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(400)
    })

    test('responds with a 201 when non primary fields missing - description',()=>{
        const newTopic={
            slug:"headphones"
            };
        return request(app)
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then((response)=>{
            expect(response.body.topic.slug).toBe('headphones')
            expect(response.body.topic.description).toBe(null)
        })
    })
})

describe('DELETE /api/articles/:article_id',()=>{
    test('returns a 204 and no content',()=>{
        return request(app)
        .delete('/api/articles/2')
        .expect(204)
    })

    test('Returns a 404 and message when an id that does not exist is provided eg. 99',()=>{
        return request(app)
        .delete('/api/articles/99')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('No article with that id')
        })
    })

    test('Returns a 400 and message when an id that does not exist is provided eg. mouse',()=>{
        return request(app)
        .delete('/api/articles/mouse')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('Bad request')
        })
    })
})
