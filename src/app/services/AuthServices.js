import axios from 'axios';
import { getApiUrl } from '../components/utils/helper';

const AuthServices={

  login:(user)=>{
    return axios.post(getApiUrl(`auth/login`),user)
    .then((res) => {
         return res
    })
    .catch((err) => err);
   }

}
export default AuthServices;