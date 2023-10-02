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

    test('when a non-existant endpoint is provided, return 404/bad request',()=>{

        return request(app)
        .get('/api/bananas')
        .expect(404)
        .then((res)=>{

            expect(res.body.msg).toBe('bad request')
        })
    })

})