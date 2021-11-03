import { authToken } from "../constants/constants";

export const saveAuthToken=(token)=>{
    localStorage.setItem(authToken,token);
}

export const getAuthToken=()=>{
    return localStorage.getItem(authToken);
}

export const clearTokens=()=>{
    localStorage.clear();
}
