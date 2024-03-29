import React, {useState, useEffect} from 'react'
import './App.css' 
import List from './components/List.jsx'
import ThingForm from './components/ThingForm.jsx'
import likesService from './services/likes'
import LoginForm from './components/LoginForm'

const App = () => { 

  const [things, setThings] = useState([])
  const [user, setUser] = useState(null)

  const addVote = thing => {
    const newThing = {...thing, votes: thing.votes+1}
    likesService.update(newThing)
        .then(data => {
          // replace old thing in things array with newthing - match on id
          const newThings = things.map(
              thing => thing.id !== data.id ? thing : data 
            )
          setThings(newThings)
        })
        .then(()=> {
          console.log("the next then")
        })
        .catch(() => {
            alert("There was an error!")
          }
        )
  }

  const addNewThing = (content) => {

    likesService.create({content: content, votes: 0}, user)
    .then(object => {
        setThings([...things, object])
      }
    )
  }

  useEffect(() => {
      // try to refresh our user token
      // just in case we're already logged in
      likesService.refreshToken()
          .then(token => {
              if (token) {
                  setUser(token)
              }
          })

      likesService.getAll()
        .then(objects => {
          setThings(objects)
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
