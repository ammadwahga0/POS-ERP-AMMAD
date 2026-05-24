import axios from "axios";

const API = axios.create({
  baseURL: "https://pos-erp-ammad-api.onrender.com/api",
});

export default API;