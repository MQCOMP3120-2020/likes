import React, {useState} from 'react'

const ThingForm = ({updateFn}) => {

    const [newThing, setNewThing] = useState('')
  
    const handleNewThing = (event) => {
      event.preventDefault()
      setNewThing(event.target.value)
    }
  
    const formHandler = (event) => {
      event.preventDefault()
      updateFn(newThing)
      setNewThing("")
    }
  
    return (
      <form onSubmit={formHandler}>
      <label>What do you like?</label>
      <input value={newThing} onChange={handleNewThing}></input>
      <input type='submit'></input>
    </form>
    )
  }

  export default ThingForm