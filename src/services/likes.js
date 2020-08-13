import axios from 'axios'
const baseURL = "http://localhost:3001/likes"

const getAll = () => {
    return axios.get(baseURL)
                .then(response => response.data)
}

const create = (newObject) => {
    return axios.post(baseURL, newObject)
                .then(response => response.data)
}

export default {getAll, create} 

