//axios
import axios from 'axios';

console.log('process.env BACKEND_URL', process.env.BACKEND_URL);

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export { api };
