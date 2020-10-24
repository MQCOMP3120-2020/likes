/**
 * @jest-environment node
 */

const mongoose = require('mongoose') 
const supertest = require('supertest')
const fs = require('fs')
const app = require('../app')
const Like = require("../models/likes")

const api = supertest(app)

/**
 * Load sample data into the database for testing
 * 
 * @param {String} fileName JSON data filename
 */
const sampleData =  (fileName) => {
    const rawData = fs.readFileSync(fileName)
    const data = JSON.parse(rawData)

    data.likes.map(async record => { 
        const l = new Like(record)
        await l.save() 
    })
}

describe('api', () => {

    beforeEach(async () => {
       sampleData("server/sample.json")
    })

    test('get request returns JSON', async () => {
        await api.get('/api/likes')
                .expect(200)
                .expect('Content-Type', /application\/json/)
    })

    test('there are three likes records', async () => {
        const response = await api.get('/api/likes')
        expect(response.body).toHaveLength(3)
    })

    test('login works with correct username/password', async () => {

        const data = {
            username: 'bobalooba',
            password: 'bob'
        }

        await api.post('/auth/login')
                 .send(data)
                 .expect(200)
                 .expect('Content-Type', /application\/json/)
                 .expect('Set-Cookie', /.*/)
                 .then((res) => {
                    expect(res.body.username).toBe(data.username)
                    expect(res.body.name).toBe('Bob Bobalooba')
                })
    })

    test('login fails with incorrect password', async () => {

        const data = {
            username: 'bobalooba',
            password: 'notbob'
        }

        await api.post('/auth/login')
                 .send(data)
                 .expect(401)

    })

    test('refresh token with session cookie', async () => {

        const data = {
            username: 'bobalooba',
            password: 'bob'
        }

        const response = await api.post('/auth/login')
                                  .send(data)
                                  .expect(200)

        // Save the cookie to use it later to retrieve the session
        const cookies = response.headers['set-cookie'].pop().split(';')[0];
        expect(cookies.startsWith('connect.sid'))

        await api.get('/auth/refresh')
                 .set('Cookie', cookies)
                 .expect(200)
                 .expect('Content-Type', /application\/json/)
                 .then((res) => {
                     expect(res.body.username).toBe(data.username)
                     expect(res.body.name).toBe('Bob Bobalooba')
                 })
    })

    test('get one like returns correct record', async () => {
        // get all the likes and select the first one
        const response = await api.get('/api/likes')
        const sample = response.body[0]
        await api.get('/api/likes/' + sample.id)
                 .expect(200)
                 .expect('Content-Type', /application\/json/)
                 .expect(sample)  // correct content
    })

    test('login fails with incorrect username', async () => {

        const data = {
            username: 'notbobalooba',
            password: 'notbob'
        }

        await api.post('/auth/login')
                 .send(data)
                 .expect(401)
    })


    test('post request adds a record', async () => {
        const newlike = {
            content: "test content",
        }

        await api.post('/api/likes')
                 .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJib2JhbG9vYmEiLCJpYXQiOjE1OTk4MDI0MzV9.Q0bWVbz1wRtXAN7rgFebu_-hWF0289EtBP-Cnr6BxZE')
                 .send(newlike)
                 .expect(200)
                 .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/likes')
        expect(response.body).toHaveLength(4)

    })

    test('post request does not add a record if the token is invalid', async () => {
        const newlike = {
            content: "test content",
        }

        await api.post('/api/likes')
                 .set('Authorization', 'Bearer invalid.token.here')
                 .send(newlike)
                 .expect(401)
                 .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/likes')
        expect(response.body).toHaveLength(3)

    })

    test('post request does not add a record if the Authorization header is missing', async () => {
        const newlike = {
            content: "test content",
        }

        await api.post('/api/likes')
                 .send(newlike)
                 .expect(401)
                 .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/likes')
        expect(response.body).toHaveLength(3)

    })


    test('put request updates the content of a record', async () => {
        const newlike = {
            content: "updated content",
        }

        const initialLikes = await api.get('/api/likes')
        const original = initialLikes.body[0]

        await api.put('/api/likes/' + original.id)
                 .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJib2JhbG9vYmEiLCJpYXQiOjE1OTk4MDI0MzV9.Q0bWVbz1wRtXAN7rgFebu_-hWF0289EtBP-Cnr6BxZE')
                 .send(newlike)
                 .expect(200)
                 .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/likes')
        expect(response.body).toHaveLength(3)

        const updated = response.body.filter(l => l.id === original.id)[0]
        expect(updated.content === newlike.content)

    })

    afterEach(async () => {
        await Like.deleteMany({})
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})