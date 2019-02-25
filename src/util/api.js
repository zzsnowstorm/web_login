import axios from 'axios';
import { getStorage } from './index';

const getAuthorization = () => 'Bearer ' + getStorage('token', true).accessToken;

const register = params => new Promise((resolve, reject) => {
    axios.post('/api/mdm/customer/user/register', params).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error);
    });
});

const checkUserName = (custonerId, userName) => new Promise((resolve, reject) => {
    axios.get(`/api/mdm/customer/user/checkName/${custonerId}?name=${userName}`).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error);
    });
});

const fetchCustomerData = customerId => new Promise((resolve, reject) => {
    axios.get(`/api/mdm/customer/getNameAndLog/${customerId}`).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error);
    });
});

const fetchMdmData = (params) => {
    const { group, type } = params;
    const Authorization = getAuthorization();
    const url = '/api/mdm/' + group + '/' + type;

    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: { Authorization, 'Accept-Language': window.store.locale },
        }).then((response) => {
            (response.status === 200) && resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
};

const refreshToken = (token) => {
    const url = '/api/users/refreshToken?token=' + token;
    const Authorization = 'Bearer ' + token;
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: { Authorization, 'Accept-Language': window.store.locale },
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const fetchUserData = (userId) => {
    const Authorization = getAuthorization();
    return new Promise((resolve, reject) => {
        axios.get('/api/mdm/person/user/' + userId, {
            headers: { Authorization, 'Accept-Language': window.store.locale },
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

const userLogin = params => new Promise((resolve, reject) => {
    axios.post('/api/users/login', params).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error);
    });
});

const checkSms = smsCode => new Promise((resolve, reject) => {
    const token = getStorage('token', true).accessToken;
    axios.get('/api/users/checkSms?smsCode=' + smsCode, {
        headers: { token, 'Accept-Language': window.store.locale },
    }).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error);
    });
});


export {
    register,
    checkUserName,
    fetchCustomerData,
    fetchMdmData,
    refreshToken,
    fetchUserData,
    userLogin,
    checkSms,
};
