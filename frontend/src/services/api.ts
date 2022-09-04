//axios
import axios from 'axios';

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export { api };
