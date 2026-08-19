import axios from "axios";

export const jikanApiUrl = axios.create({
  baseURL: "https://api.tenrai.org/v1",
  timeout: 10000,
});