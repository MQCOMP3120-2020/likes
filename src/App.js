import React, {useState} from 'react'
import './App.css' 



const List = (props) => {

  const {contents} = props 

  return (
    <ul>
      {contents.map((item) => <li key={item.id}>{item.content}</li>) } 
    </ul> 
  )
}

const App = () => { 

  const [things, setThings] = useState([])
  const [newThing, setNewThing] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setThings([...things, {id: things.length, content: newThing}])
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
      <List contents={things}/>
    </div>
  )
}

export default App
