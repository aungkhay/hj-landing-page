import API from "./http"

export const GET_DOMAIN = async () => {
    return await API.get(`/api/domains`);
}