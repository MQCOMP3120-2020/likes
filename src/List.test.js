/**
 * @jest-environment jsdom
 */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import fs from 'fs'
import List from './List'

/**
 * Read sample data for testing
 * 
 * @param {String} fileName JSON data filename
 * @returns {Array} an array of like records
 */
const sampleData =  (fileName) => {
  const rawData = fs.readFileSync(fileName)
  const data = JSON.parse(rawData)

  return data.likes
}

describe("List component", () => {
  test('renders content', () => {
    const contents = sampleData('server/sample.json')
    const addVote = jest.fn()

    const component = render(
      <List contents={contents} addVote={addVote} />
    )

    // look for some content
    contents.map(c => expect(component.container).toHaveTextContent( c.content ))
  })

  test('snapshot test', () => {
    const contents = sampleData('server/sample.json')
    const addVote = jest.fn()

    const component = render(
      <List contents={contents} addVote={addVote} />
    )
    
    expect(component).toMatchSnapshot()
  })




  test('Vote button calls callback function', () => {
    const contents = sampleData('server/sample.json')
    const addVote = jest.fn()

    const component = render(
      <List contents={contents} addVote={addVote} />
    )

    // test clicking on the vote button
    const button = component.getAllByText("Vote")[0]
    fireEvent.click(button)


    // the function should have been called once
    expect(addVote.mock.calls).toHaveLength(1)
    // the record should be passed as the first argument to the function
    expect(addVote.mock.calls[0][0]).toBe(contents[0])

  })

})
