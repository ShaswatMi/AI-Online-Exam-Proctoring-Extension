import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    withCredentials:true
});

export const loginUser = async (email, password) => {
  const response = await api.post('users/login', { "email":email, "password":password });
  //console.log(response.data.data.user)
  return response.data.data.user;
};