const setStorage = (key, data) => {
    try {
      if (data instanceof Object) {
        let json = JSON.stringify(data)
        window.localStorage.setItem("jowo_" + key, json)
      } else {
        window.localStorage.setItem("jowo_" + key, data)
      }
    } catch (err) {
      console.warn("set localstorage error:" + err)
    }
  }

  const getStore = (key) => {
    if (window.store && window.store[key] != null) {
      return _.cloneDeep(window.store[key])
    } else {
      return null
    }
  }
  
  const getStorage = (key, isObj) => {
    let str
    try {
      str = window.localStorage.getItem("jowo_" + key)
    } catch (err) {
      return null
    }
    try {
      if (isObj) {
        if (!str) {
          return null
        }
        return JSON.parse(str)
      } else {
        return str
      }
    } catch (err) {
      return null
    }
  }
  
  const delStorage = (key) => {
    try {
      window.localStorage.removeItem("jowo_" + key)
    } catch (err) {
      console.warn("remove localstorage error:" + err)
    }
  }

  const getToken = () => {
    let tokenInfo = getStore('tokenInfo') || {}
    const token = 'Bearer ' + tokenInfo.accessToken
    return token
  }

  const clearStorage = () => {
    const remembered = getStorage("remembered") || 0
    const theme = getStorage("theme") || 'light'
    window.localStorage.clear()
    setStorage("remembered", remembered)
    setStorage("theme", theme)
  }

  const setCookie = (name, value) => {
    let Days = 10;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  }
  
  const getCookie = (name) => {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  }
  
  const delCookie = (name) => {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }

  export {
    setStorage,
    getStore,
    getStorage,
    delStorage,
    getToken,
    clearStorage,
    setCookie,
    getCookie,
    delCookie,
  }