import axios from 'axios'
const baseURL = "http://localhost:3001/api/"


const login = ({username, password}) => {

    return axios.post(baseURL + 'login', {username, password})
    .then(response => response.data)
}

export default {login}
