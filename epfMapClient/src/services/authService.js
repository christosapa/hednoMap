import axios from '../api/axios';

const CONFIRM_URL = '/confirm';

const verifyUser = async (code) => {
    try {
        const response = await axios.get(CONFIRM_URL + '/' + code);
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

export default verifyUser;