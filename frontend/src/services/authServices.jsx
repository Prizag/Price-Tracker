import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://price-tracker-backend-hlqo.onrender.com/auth', 
});

export default instance;
