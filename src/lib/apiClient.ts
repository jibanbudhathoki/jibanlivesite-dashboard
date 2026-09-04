import axios from "axios";

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, attach it to the Authorizati on header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend returns a 401 Unauthorized, log the user out
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - redirecting to login");
      localStorage.removeItem("token");
      // Force redirect to login page (adjust route as needed)
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
