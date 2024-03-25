import axios from "axios";

export default () => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
