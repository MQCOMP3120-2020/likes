import React, {useState, useEffect} from 'react'
import './App.css' 
import List from './List.js'
import ThingForm from './ThingForm.js'
import likesService from './services/likes'


const App = () => { 

  const [things, setThings] = useState([])

  const addNewThing = (content) => {

    likesService.create({content: content})
    .then(object => {
        console.log("POST response: ", object)
        setThings([...things, object])
        console.log("new thing added", object)
      }
    )
  }

  useEffect(() => {
    console.log("effect is being run")
    likesService.getAll()
     .then(objects => {
       console.log("we have a response", objects)
       setThings(objects)
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
