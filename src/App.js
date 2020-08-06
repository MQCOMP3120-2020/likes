import React, {useState} from 'react'
import './App.css' 


const ListEntry = (props) => {
  return (<li className="listEntry">{props.content}</li>)
}

const App = () => { 

  const [things, setThings] = useState(['eggs', 'cheese'])
  const [newThing, setNewThing] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setThings([...things, newThing])
    setNewThing('')
    console.log("form submitted", things)

  }

  const handleNewThing = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    setNewThing(event.target.value)
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>What do you like?</label>
        <input value={newThing} onChange={handleNewThing}></input>
        <input type='submit'></input>
      </form>
      
      <p>Here are the things that you like:</p> 
      <ul>
        {things.map((thing) => <ListEntry key={thing} content={thing} />) } 
      </ul> 
    </div>
  )
}

export default App
