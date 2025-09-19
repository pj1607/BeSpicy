import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.ML_SERVICE_URL,
  timeout: 10000,
});

export default apiClient;
