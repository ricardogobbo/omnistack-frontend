import axios from 'axios';

const api = axios.create({
    baseURL: 'https://omnigobb.herokuapp.com'
});

export default api;