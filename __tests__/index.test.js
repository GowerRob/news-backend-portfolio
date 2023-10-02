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

})