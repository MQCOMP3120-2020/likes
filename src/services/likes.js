import axios from 'axios'
const baseURL = "/api/"

/**
 * Get a list of all liked things from the api
 * @return {Promise}    Promise that will resolve to the response data
 */
const getAll = () => {
    return axios.get(baseURL + "likes")
                .then(response => response.data)
}

/**
 * 
 * @param {Object} newObject 
 * @param {Object} user - the current logged in user
 * @returns {Promise} Promise that will resolve to the response data
 */
const create = (newObject, user) => {

    if (!user) {
        return new Promise(() => null)
    }

    const config = {headers: {Authorization: "Bearer " + user.token}  }

    return axios.post(baseURL + "likes", newObject, config)
                .then(response => response.data)
}

/**
 * Update an existing liked thing via the API
 * @param {Object} thing An modified thing {id, content, votes}
 * @returns {Promise} Promise that will resolve to the response data
 */
const update = (thing) => {
    return axios.put(baseURL + "likes/" + thing.id, thing)
                .then(response => response.data)
}

/**
 * Send a login request
 * @param {Object} param0 {username, password} 
 * @returns {Promise} Promise that will resolve to the response data
 */
const login = ({username, password}) => {

    console.log("POST", baseURL + 'login')
    return axios.post(baseURL + 'login', {username, password})
    .then(response => response.data)
}

export default {getAll, create, update, login} 

