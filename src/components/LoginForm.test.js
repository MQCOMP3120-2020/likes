/**
 * @jest-environment jsdom
 */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import LoginForm from './LoginForm'
import likesService from '../services/likes.js'

jest.mock('./services/likes.js')


describe('LoginForm component', () => {

    test( 'renders form with no user', () => {

        const setUser = jest.fn()

        const component = render(<LoginForm user={null} setUser={setUser}/>)

        const form = component.container.querySelector('form')
        expect(form).toHaveTextContent('Username')
    })


    test( 'renders no form with user', () => {

        const setUser = jest.fn()
        const user = {name: "Bob Bobalooba"}
        const component = render(<LoginForm user={user} setUser={setUser}/>)

        expect(component.container).toHaveTextContent('Logged in Bob Bobalooba')
    })

    test('calls callback function on submission', done => {

        const setUser = jest.fn(() => done())
        likesService.login.mockResolvedValue({user: 'bobalooba'})

        const component = render(<LoginForm user={null} setUser={setUser}/>)

        const form = component.container.querySelector('form')
        const usernameInput = component.getByLabelText('Username')
        const passwordInput = component.getByLabelText('Password')
        fireEvent.change(usernameInput, {target: {value: 'bobalooba'}})
        fireEvent.change(passwordInput, {target: {value: 'bob'}})
        fireEvent.submit(form)
        
        // form submission should trigger a call to likesService.login
        // which is mocked above to return {user: 'bobalooba'} 
        // that in turn will trigger a call to setUser which 
        // calls done() to finish the test
        // if setUser is never called, the test will timeout and fail
    })

})