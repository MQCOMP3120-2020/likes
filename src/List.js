
import React from 'react'

const List = ({contents}) => {

    return (
      <ul>
        {contents.map((item) => <li key={item.id}>{item.content}</li>) } 
      </ul> 
    )
  }

  export default List

  