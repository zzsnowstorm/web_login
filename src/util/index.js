import { cloneDeep } from 'lodash';
import config from './config';
import getString from './intl';


const setStore = (key, data) => {
    if (window.store) {
        window.store[key] = data;
    } else {
        window.store = { key: data };
    }
};

const getStore = (key) => {
    if (window.store && window.store[key] != null) {
        return cloneDeep(window.store[key]);
    }
    return null;
};

const setStorage = (key, data) => {
    try {
        if (data instanceof Object) {
            const json = JSON.stringify(data);
            window.localStorage.setItem('jowo_' + key, json);
        } else {
            window.localStorage.setItem('jowo_' + key, data);
        }
    } catch (err) {
        console.warn('set localstorage error:' + err);
    }
};

const getStorage = (key, isObj) => {
    let str;
    try {
        str = window.localStorage.getItem('jowo_' + key);
    } catch (err) {
        return null;
    }
    try {
        if (isObj) {
            if (!str) {
                return null;
            }
            return JSON.parse(str);
        }
        return str;
    } catch (err) {
        return null;
    }
};

const delStorage = (key) => {
    try {
        window.localStorage.removeItem('jowo_' + key);
    } catch (err) {
        console.warn('remove localstorage error:' + err);
    }
};

const getToken = () => {
    const tokenInfo = getStore('tokenInfo') || {};
    const token = 'Bearer ' + tokenInfo.accessToken;
    return token;
};

const clearStorage = () => {
    const locale = getStorage('locale');
    const remembered = getStorage('remembered') || 0;
    const theme = getStorage('theme') || 'light';
    window.localStorage.clear();
    setStorage('remembered', remembered);
    setStorage('theme', theme);
    setStorage('locale', locale || 'zh-CN');
};

const historyPush = (history, pathname) => {
    const { location: { search } } = history;
    history.push({ pathname, search });
};

const isAndroidApp = () => navigator.userAgent.includes('/Android_Native');

const isIosApp = () => navigator.userAgent.includes('/IOS_Native');

const isApp = () => isAndroidApp() || isIosApp();

// eslint-disable-next-line no-return-assign
const scan = () => isApp() && (window.location = '/qrCode');

export {
    getString,
    config,
    setStorage,
    getStore,
    setStore,
    getStorage,
    delStorage,
    getToken,
    clearStorage,
    historyPush,
    isAndroidApp,
    isIosApp,
    isApp,
    scan,
};
