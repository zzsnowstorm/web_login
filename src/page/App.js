import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import localforage from 'localforage';
import psl from 'psl';
import { config, setStorage, setStore, getStorage, clearStorage, getString, isApp } from '../util/index';
import { fetchMdmData, refreshToken, fetchUserData } from '../util/api';
import Login from './Login/index';
import Register from './Register';
import PasswordReset from './PasswordReset';
import Authentication from './Authentication';
import Loading from '../compent/Loading/DefaultLoading';
import styles from './App.less';


export default class App extends Component {
    // loginLoder() {
    //     this.timer && (window.clearInterval(this.timer));
    //     this.timer = setInterval(() => {
    //         const { loaded } = this.state;
    //         loaded && this.jumpIfAlreadyLoad();
    //     }, 200);
    // }
    isMobile() {
        return /(iPhone|Android)/i.test(navigator.userAgent);
    }

    getBackGround(domain) {
        return `http://jowoiot-front.oss-cn-shanghai.aliyuncs.com/login-pick-${domain}.jpg`;
    }

    getDefaultImg(e) {
        const src = './login/background.jpg';
        if (src === e.currentTarget.getAttribute('src')) {
            e.currentTarget.src = './background.jpg';
        } else {
            e.currentTarget.src = src;
        }
    }

    getQueryString(name) {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    getSearchParams() {
        // eslint-disable-next-line
        const [, search] = window.location.href.split('?');
        const searchParams = {};
        if (search) {
            search.split('&').forEach((param) => {
                const [key, value] = param.split('=');
                searchParams[key] = value;
            });
        }
        return searchParams;
    }

    getLocale() {
        let locale;
        if (navigator.browserLanguage) {
            locale = navigator.browserLanguage;
        } else {
            locale = navigator.language;
        }
        return locale;
    }

    resize() {
        // eslint-disable-next-line
        this.setState({ isMobile: this.isMobile() });
    }

    renderPage(component, props) {
        const { isMobile, offLine, domain, searchParams } = this.state;
        const { customerId } = searchParams;
        return React.cloneElement(component, {
            ...props,
            domain,
            offLine,
            isMobile,
            customerId,
            searchParams,
            fetchPageData: this.fetchPageData.bind(this),
        });
    }

    jumpIfAlreadyLoad() {
        try {
            const { user, page } = window.store;
            if (page) {
                const { searchParams: { callback } } = this.state;
                const { menus, componentList, pageList } = page;
                user && menus && componentList && pageList && (window.location = callback ? decodeURIComponent(callback) : '/#/index');
            }
        } catch (e) {
            console.warn('load cache page error:' + e);
        }
    }

    parseMenus(menus, pageList) {
        menus.map((menu) => {
            menu.menu || ((pageList.push(menu)) && (menu.link = '/' + menu.key));
            menu.containers && menu.containers.length > 0 && (this.parseMenus(menu.containers, pageList));
        });
    }

    fetchMdmDatas() {
        const $component = fetchMdmData({ group: 'page', type: 'component' });
        const $subMenu = fetchMdmData({ group: 'page', type: 'container' });

        Promise.all([$component, $subMenu])
            .then(([componentList, subMenus]) => {
                let [menus, pageList] = [];
                if (subMenus && subMenus.length > 0) {
                    // 普通用户不能访问配置管理 hard code
                    pageList = [];
                    this.parseMenus(subMenus, pageList);
                    menus = subMenus.sort((a, b) => a.index === b.index ? a.name.localeCompare(b.name) : a.index > b.index);
                } else {
                    pageList = subMenus;
                    // eslint-disable-next-line
                    menus = config.mock.menus;
                    pageList.forEach((page) => {
                        const subMenu = menus.find(menu => menu.key === page.pId);
                        page.link = '/' + page.key;
                        subMenu && !subMenu.containers.find(m => m.mdmId === page.mdmId) && subMenu.containers.push(page);
                    });
                }
                const page = { componentList, menus, pageList };
                setStore('page', page);
                setStorage('page', page);

                this.jumpIfAlreadyLoad();
            }).catch((error) => {
                console.warn(error);
                this.setState({ loading: false }, () => {
                    if (error.response.status === 401) {
                        alert(getString('error_401'));
                    } else {
                        alert(error.response.data.error);
                    }
                });
            });
    }

    fetchPageData(token, userId) {
        const remembered = Number(getStorage('remembered'));
        setStorage('remembered', remembered);
        window.store.remembered = remembered;

        setStorage('token', token);
        window.store = { ...window.store, tokenInfo: token };

        fetchUserData(userId)
            .then((response) => {
                if (response.status === 200) {
                    const userData = {
                        ...response.data.user,
                        ...response.data,
                    };
                    setStorage('user', userData);
                    window.store.user = userData;
                    // this.jumpIfAlreadyLoad();
                    // 页面数据缓存
                    this.fetchMdmDatas();
                }
            }).catch((error) => {
                console.warn(error);
                this.setState({ loading: false }, () => {
                    if (error.response.status === 401) {
                        alert(getString('error_401'));
                    } else {
                        alert(error.response.data.error);
                    }
                });
            });

        this.setState({ loading: true });
        // window.setTimeout(() => {
        //     this.setState({ loadingText: '正在加载主数据...' });
        // }, 300);
        // window.setTimeout(() => {
        //     this.setState({ loaded: true, loadingText: '加载完成，正在渲染...' });
        // }, 600);
        // this.setState({ loaded: false, loading: true, loadingText: '正在建立连接...' });
    }

    jumpIfHasToken() {
        const { searchParams: { token } } = this.state;
        if (token) {
            refreshToken(token)
                .then((response) => {
                    if (response.status === 200) {
                        const { accessToken, refreshToken: retoken, userId } = response.data;
                        this.fetchPageData({ accessToken, refreshToken: retoken }, userId);
                    }
                }).catch((error) => {
                    alert(error.response.data.error);
                });
        }
    }

    jumpIfAlreadyLogin() {
        // const { user, remembered, token, origin, page } = this.state;
        const user = getStorage('user', true);
        const remembered = Number(getStorage('remembered'));
        const token = getStorage('token', true);
        const page = getStorage('page', true);
        if (remembered && token && user && user.customer && page && page.menus && page.componentList && page.pageList) {
            this.jumpIfAlreadyLoad();
        } else {
            window.localStorage.clear();
            localforage.clear();
            clearStorage();
        }
    }

    ononline() {
        if (navigator.onLine) {
            alert('网络已连接');
            this.setState({ offLine: false });
        }
    }

    onoffline() {
        if (!navigator.onLine) {
            alert('网络连接不可用，请检查网络连接');
            this.setState({ offLine: true });
        }
    }

    constructor(props) {
        super(props);
        const parsed = psl.parse(document.domain);
        setStorage('domain', parsed.sld);
        const locale = this.getLocale() || 'zh-CN';
        setStorage('locale', locale);
        window.store.locale = locale;
        const isMobile = this.isMobile();
        const searchParams = this.getSearchParams();
        this.state = {

            searchParams,
            domain: parsed.sld,
            locale,
            isMobile,

            loading: false,
            offLine: false,
        };
    }

    componentDidMount() {
        this._resize = this.resize.bind(this);
        window.addEventListener('resize', this._resize);

        this.jumpIfAlreadyLogin();
        this.jumpIfHasToken();

        if (isApp()) {
            this._onoffline = this.onoffline.bind(this);
            this._ononline = this.ononline.bind(this);

            window.addEventListener('online', this._ononline);
            window.addEventListener('offline', this._onoffline);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);

        if (isApp()) {
            window.removeEventListener('online', this._ononline);
            window.removeEventListener('offline', this._onoffline);
        }

        this.timer && (window.clearInterval(this.timer)) && (delete this.timer);
    }

    render() {
        const { isMobile, loading, domain } = this.state;

        return (
            <div className={styles.app}>
                {!isMobile && <img className='background' src={this.getBackGround(domain)} alt='' onError={this.getDefaultImg.bind(this)} />}
                <HashRouter hashType='noslash'>
                    <Switch>
                        <Route path='/register/:step' render={props => this.renderPage(<Register />, props)} />
                        <Route path='/register' render={props => this.renderPage(<Register />, props)} />
                        <Route path='/password_reset/:step' render={props => this.renderPage(<PasswordReset />, props)} />
                        <Route path='/password_reset' render={props => this.renderPage(<PasswordReset />, props)} />
                        <Route path='/authentication' render={props => this.renderPage(<Authentication />, props)} />
                        <Route path='/' render={props => this.renderPage(<Login />, props)} />
                    </Switch>
                </HashRouter>
                <div className='copyright' style={{ justifyContent: isMobile ? 'center' : 'flex-end' }}>
                    <span>
                        ©{(new Date()).getFullYear()} <span style={{ textTransform: 'capitalize' }}>{domain}</span>  {getString('copyright')}
                    </span>
                </div>
                {loading && <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(255,255,255,0.3)' }}><Loading content='' /></div>}
            </div>
        );
    }
}
