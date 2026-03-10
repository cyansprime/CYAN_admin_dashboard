import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
    ...(process.env.NEXT_PUBLIC_API_KEY ? { "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY } : {}),
  },
});

export default apiClient;
