import React, {useState} from 'react'
import './App.css' 
import List from './List.js'
import ThingForm from './ThingForm.js'


const App = () => { 

  const [things, setThings] = useState([])

  const addNewThing = (content) => {
    setThings([...things, {id: things.length, content: content}])
    console.log("new thing added", content)
  }

  return (
    <div className="App">
      <ThingForm updateFn={addNewThing}/> 
      
      <p>Here are the things that you like:</p> 
      <List contents={things}/>
    </div>
  )
}

export default App
