import React, {useState, useEffect} from 'react'
import './App.css' 
import List from './List.js'
import ThingForm from './ThingForm.js'
import likesService from './services/likes'
import LoginForm from './LoginForm'

const App = () => { 

  const [things, setThings] = useState([])
  const [user, setUser] = useState(null)

  const addVote = thing => {
    console.log("addVote", thing)
    const newThing = {...thing, votes: thing.votes+1}
    console.log("updated vote in item", newThing)
    likesService.update(newThing)
        .then(data => {
          // replace old thing in things array with newthing - match on id
          console.log("got response", data)
          const newThings = things.map(
              thing => thing.id !== data.id ? thing : data 
            )
          setThings(newThings)
        })
        .then(()=> {
          console.log("the next then")
        })
        .catch(
          (error) => {
            alert("There was an error!")
          }
        )
  }

  const addNewThing = (content) => {

    likesService.create({content: content, votes: 0}, user)
    .then(object => {
        console.log("POST response: ", object)
        setThings([...things, object])
        console.log("new thing added", object)
      }
    )
  }

  useEffect(() => {
      likesService.getAll()
      .then(objects => {
        setThings(objects)
      })
      // try to refresh our user token
      // just in case we're already logged in
      likesService.refreshToken()
          .then(token => {
              if (token) {
                  setUser(token)
              }
          })
    }, 
    []) 

  return (
    <div className="App">

    <div className="row">
      <div className="u-pull-right">
        <LoginForm user={user} setUser={setUser}/>
      </div>
    </div>

    <div className="row">
      <div className="five columns">
        <ThingForm user={user} updateFn={addNewThing}/> 
      </div>
      <div className="seven columns">
        <p>Here are the things that you like:</p> 
        <List addVote={addVote} contents={things}/>
      </div>
    </div>
    </div>
  )
}

export default App
