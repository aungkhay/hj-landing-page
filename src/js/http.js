import axios from "axios";

let BASEURL = '/';
let API = axios.create({
    baseURL: BASEURL,
    timeout: 20000,
    headers: {
        Accept: 'application/json',
    }
});

API.interceptors.response.use(
    response => {
        var res = response.data;
        return Promise.resolve(res);
    },
    error => {
        return Promise.resolve(error.response);
    }
);

export default API