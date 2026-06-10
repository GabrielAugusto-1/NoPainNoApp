import axios from "axios";

export const api = axios.create({
  baseURL: "https://6a05172baa826ca75c097762.mockapi.io/api/v1",
});