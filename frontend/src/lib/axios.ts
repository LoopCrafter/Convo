import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api/v1"
      : "/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Please try again later";

    if (error.response) {
      message = error.response.data.message || "Server error occurred";
    } else if (error.request) {
      message = "No response from server";
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject({
      message,
      errors: error.response?.data?.errors || {},
      status: error.response?.status || null,
    });
  }
);
