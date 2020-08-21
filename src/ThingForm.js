/* eslint-disable react/prop-types */
import React, {useState} from 'react'

const ThingForm = ({user, updateFn}) => {

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
  
    if (user) {
      return (
        <form onSubmit={formHandler}>
            <label>What do you like?</label>
            <input className="u-full-width" value={newThing} onChange={handleNewThing}></input>
            <input className="button-primary" type='submit'></input>
      </form>
      )
    } else {
      return (<p>Login to post things you like  </p>)
    }
  }

  export default ThingForm