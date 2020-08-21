import axios from 'axios'
const baseURL = "http://localhost:3001/api/likes"

/**
 * Get a list of all liked things from the api
 * @return {Promise}    Promise that will resolve to the response data
 */
const getAll = () => {
    return axios.get(baseURL)
                .then(response => response.data)
}

/**
 * 
 * @param {Object} newObject 
 * @returns {Promise} Promise that will resolve to the response data
 */
const create = (newObject) => {
    return axios.post(baseURL, newObject)
                .then(response => response.data)
}

/**
 * Update an existing liked thing via the API
 * @param {Object} thing An modified thing {id, content, votes}
 * @returns {Promise} Promise that will resolve to the response data
 */
const update = (thing) => {
    return axios.put(baseURL + "/" + thing.id, thing)
                .then(response => response.data)
}

export default {getAll, create, update} 

