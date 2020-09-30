/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'

import likesService from './likes.js'

jest.mock('axios')

describe('likesService', () => {

    test('getAll', done => {
        const thedata = [1, 2, 3]
        axios.get.mockResolvedValue({data: thedata})

        likesService.getAll().then(data => {
                expect(data).toBe(thedata)

                expect(axios.get.mock.calls).toHaveLength(1)
                expect(axios.get.mock.calls[0][0]).toBe('/api/likes')

                done()
            }
        )

    })

    test("create not allowed without user", done => {

        const thedata = [1, 2, 3]
        axios.post.mockResolvedValue({data: thedata})

        likesService.create({content: 'hello'}, null)
            .then(data => {
                expect(data).toBe(null)
                expect(axios.post.mock.calls).toHaveLength(0)
                done()
            })
    })

    test("create ok with valid user", done => {

        const theData = [1, 2, 3]
        const theContent = {content: 'hello'}
        axios.post.mockResolvedValue({data: theData})

        likesService.create(theContent, {token: '12345'})
            .then(data => {
                expect(data).toBe(theData)
                expect(axios.post.mock.calls).toHaveLength(1)
                expect(axios.post).toBeCalledWith(
                    '/api/likes',
                    theContent,
                    expect.objectContaining({headers: {Authorization: expect.any(String)}})
                )
                done()
            })
    })

})