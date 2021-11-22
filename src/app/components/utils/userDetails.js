import { user } from "../constants/constants";

export const saveUser=(loggedInUser)=>{
    localStorage.setItem(user,loggedInUser);
}

export const getUser=()=>{
    return localStorage.getItem(user);
}



