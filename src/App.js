import React, {useState, useEffect} from 'react'
import './App.css' 
import List from './List.js'
import ThingForm from './ThingForm.js'
import axios from 'axios'


const App = () => { 

  const [things, setThings] = useState([])

  const addNewThing = (content) => {

    axios.post('http://localhost:3001/likes', {content: content})
    .then(response => {
        console.log("POST response: ", response.data)
        setThings([...things, response.data])
        console.log("new thing added", content)
      }
    )
  }

  useEffect(() => {
    console.log("effect is being run")
    axios.get("http://localhost:3001/likes")
     .then(response => {
       console.log("we have a response", response)
       setThings(response.data)
     })
  }, 
  []) 
  
  console.log("We are rendering the App component")
  return (
    <div className="App">
      <ThingForm updateFn={addNewThing}/> 
      
      <p>Here are the things that you like:</p> 
      <List contents={things}/>
    </div>
  )
}

export default App
