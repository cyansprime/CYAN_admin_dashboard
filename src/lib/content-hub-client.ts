import axios from "axios";

const contentHubClient = axios.create({
  baseURL: "/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

export default contentHubClient;
