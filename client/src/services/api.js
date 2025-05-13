import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
});

export const signup = ({
  name,email,password
}) =>
  api.post("/users/register", JSON.stringify({
    name,
    email,
    password,
    userType:"admin"
  }));