import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import localforage from 'localforage';
import { config, setStorage, setStore, getStorage, clearStorage } from '../util/index';
import { fetchMdmData, refreshToken, fetchUserData } from '../util/api';
import Login from './Login/index';
import Register from './Register';
import PasswordReset from './PasswordReset';
import Authentication from './Authentication';
import Loading from '../compent/Loading/DefaultLoading';
import styles from './App.less';
import background from '../public/register-background.jpg';


export default class App extends Component {
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
        this.setState({ isMobile: window.innerWidth < 768 });
    }

    renderPage(component, props) {
        const { isMobile, customerId } = this.state;
        return React.cloneElement(component, {
            ...props,
            isMobile,
            customerId,
            fetchPageData: this.fetchPageData.bind(this),
        });
    }

    jumpIfAlreadyLoad() {
        try {
            const { user, page } = window.store;
            if (page) {
                const { redirect } = this.state;
                const { menus, componentList, pageList } = page;
                user && menus && componentList && pageList && (window.location = redirect ? decodeURIComponent(redirect) : '/#/index');
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
                this.setState({ loading: false });
            });
    }

    fetchPageData(token, userId) {
        const remembered = window.store.remembered || 0;
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
                    this.jumpIfAlreadyLoad();
                }
            }).catch((error) => {
                setTimeout(() => {
                    alert(error.response.status);
                }, 200);
                this.setState({ loading: false });
            });

        // 页面数据缓存
        this.fetchMdmDatas();

        window.setTimeout(() => {
            this.setState({ loadingText: '正在加载主数据...' });
        }, 300);
        window.setTimeout(() => {
            this.setState({ loadingText: '加载完成，正在渲染...' });
        }, 600);
        this.setState({ loading: true, loadingText: '正在建立连接...' });
    }

    jumpIfHasToken() {
        const { token } = this.state;
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
        const remembered = getStorage('remembered');
        const token = getStorage('token', true);
        const page = getStorage('page', true);
        const flag = parseInt(remembered, 10);
        if (!!flag && token && user && user.customer && page && page.menus && page.componentList && page.pageList) {
            this.jumpIfAlreadyLoad();
        } else {
            window.localStorage.clear();
            localforage.clear();
            clearStorage();
        }
    }

    constructor(props) {
        super(props);
        const locale = this.getLocale() || 'zh-CN';
        setStorage('locale', locale);
        window.store.locale = locale;
        const isMobile = window.innerWidth < 768;
        const searchParams = this.getSearchParams();
        this.state = {
            ...searchParams,
            locale,
            isMobile,

            loading: false,
            loadingText: '',
        };
    }

    componentDidMount() {
        this._resize = this.resize.bind(this);
        window.addEventListener('resize', this._resize);

        this.jumpIfHasToken();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    render() {
        const { loading, loadingText, isMobile } = this.state;
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className={styles.app} style={isMobile ? {} : { backgroundImage: `url(${background})` }}>
                    <HashRouter>
                        <Switch>
                            <Route path='/register/:step' render={props => this.renderPage(<Register />, props)} />
                            <Route path='/register' render={props => this.renderPage(<Register />, props)} />
                            <Route path='/password_reset/:step' render={props => this.renderPage(<PasswordReset />, props)} />
                            <Route path='/password_reset' render={props => this.renderPage(<PasswordReset />, props)} />
                            <Route path='/authentication' render={props => this.renderPage(<Authentication />, props)} />
                            <Route path='/' render={props => this.renderPage(<Login />, props)} />
                        </Switch>
                    </HashRouter>
                    {loading && <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(255,255,255,0.3)' }}><Loading content={loadingText} /></div>}
                </div>
            </div>
        );
    }
}
