import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000/',
});

export interface ApiParams {
  [key: string]: any;
}
