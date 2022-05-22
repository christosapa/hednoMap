import axios from 'axios';

export default axios.create({
    baseURL: 'https://hedno-map-backend.herokuapp.com/'
});