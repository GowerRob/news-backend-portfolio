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

    test('to retrieve an article by its id passed in the endpoint path',()=>{
        return request(app)
        .get('/api/articles/4')
        .then((response)=>{

            const {article_id,title,topic,author,body,created_at,votes,article_img_url}=response.body.article
            console.log(article_id)
            expect(article_id).toBe(4);
            expect(title).toBe("Student SUES Mitch!");
            expect(author).toBe( "rogersop");
            expect(body).toBe("We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages");

        })
    })
    test('to get a 404 and sends an appropriate status and error message when given a valid but non-existent id',()=>{


    })



})