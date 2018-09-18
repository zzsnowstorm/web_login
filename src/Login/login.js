import React, { Component } from 'react';
import QRCode from 'qrcode-react';
import axios from 'axios';
import './login.css';
import Icon from '../compent/Icon';
import { getString, config, clearStorage, setStorage, getStorage, setStore } from '../util/index';


export default class Login extends Component {
    jumpIfAlreadyLoad() {
        try {
            const { user, page } = window.store;
            if (page) {
                const { menus, componentList, pageList } = page;
                user && menus && componentList && pageList && (window.location = '/#/index');
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

    fetchMdmData(params, callback) {
        const { group, type } = params;
        const Authorization = 'Bearer ' + getStorage('token', true).accessToken;
        const url = '/api/mdm/' + group + '/' + type;

        axios.get(url, {
            headers: { Authorization, 'Accept-Language': window.store.locale },
        }).then((response) => {
            (response.status === 200) ? callback && callback(response.data) : '';
        }).catch((error) => {
            this.setState({ loading: false });
            alert(error);
        });
    }

    fetchMdmDatas() {
        this.fetchMdmData({ group: 'page', type: 'component' }, (componentList) => {
            this.fetchMdmData({ group: 'page', type: 'container' }, (subMenus) => {
                if (subMenus && subMenus.length > 0) {
                    const pageList = [];
                    this.parseMenus(subMenus, pageList);
                    // 普通用户不能访问配置管理 hard code
                    // const menusHard = subMenus.filter(m => group || m.key != 'config_center')
                    const menus = subMenus.sort((a, b) => a.index > b.index);
                    const page = {
                        menus,
                        pageList,
                        componentList,
                    };
                    setStore('page', page);
                    setStorage('page', page);

                    this.jumpIfAlreadyLoad();
                } else {
                    this.fetchMdmData({ group: 'page', type: 'container' }, (pageList) => {
                        const { menus } = config.mock;
                        pageList.map((page) => {
                            const subMenu = menus.find(menu => menu.key === page.pId);
                            page.link = '/' + page.key;
                            subMenu && !subMenu.containers.find(m => m.mdmId === page.mdmId) && subMenu.containers.push(page);
                        });
                        const page = {
                            menus,
                            pageList,
                            componentList,
                        };
                        setStore('page', page);
                        setStorage('page', page);

                        this.jumpIfAlreadyLoad();
                    });
                }
            });
        });
    }

    loginSubmit() {
        const { login, remembered } = this.state;

        axios.post('/api/users/login', login).then((response) => {
            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data;

                const _remembered = remembered ? 1 : 0;
                setStorage('remembered', _remembered);
                window.store.remembered = _remembered;
                setStorage('token', { accessToken, refreshToken });
                window.store = { ...window.store, tokenInfo: { accessToken, refreshToken } };

                const Authorization = 'Bearer ' + accessToken;
                axios.get('/api/mdm/person/user/' + response.data.user.userId, {
                    headers: { Authorization, 'Accept-Language': window.store.locale },
                }).then((_response) => {
                    if (_response.status === 200) {
                        const userData = {
                            ..._response.data.user,
                            ..._response.data,
                        };
                        setStorage('user', userData);
                        window.store.user = userData;
                        this.jumpIfAlreadyLoad();
                        // window.location.href = origin + '/#/index';
                    }
                }).catch((error) => {
                    alert(error.response.status);
                });

                this.fetchMdmDatas();
            }
        }).catch((error) => {
            this.setState({ loading: false });
            alert(error.response.data.error);
        });
    }

    handleSubmit() {
        const { login, loginCheck } = this.state;
        const check = Object.keys(login).find(key => this.isNull(login[key]));
        if (check) {
            loginCheck[check] = true;
            this.setState({ loginCheck });
        } else {
            window.setTimeout(() => {
                this.setState({ loadingText: '正在加载主数据...' });
            }, 300);

            window.setTimeout(() => {
                this.setState({ loadingText: '加载完成，正在渲染...' });
            }, 600);

            this.loginSubmit();
            this.setState({ loading: true, loadingText: '正在建立连接...' });
        }
    }

    login(e) {
        const key = window.event ? e.keyCode : e.which;
        // 获取被按下的键值
        // 判断如果用户按下了回车键keycody=13
        if (key === 13) {
            this.handleSubmit();
        }
    }

    checkLogin(elm) {
        const { loginCheck } = this.state;
        const { value, name } = elm.target;

        (this.state.login)[name] = value;

        if (loginCheck[name] !== this.isNull(value)) {
            loginCheck[name] = this.isNull(value);
            this.setState({ loginCheck });
        }
    }

    isNull(value) {
        return value === undefined || value === null || value === '';
    }

    setLoginFocus(e, bool) {
        const { loginFocus } = this.state;
        const { name } = e.target;

        loginFocus[name] = bool;
        this.setState({ loginFocus });
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

    setLocale(locale) {
        setStorage('locale', locale);
        window.store.locale = locale;
        this.setState({ locale });
    }

    modalHide() {
        const { modal } = this.state;
        modal.show = false;

        setTimeout(() => {
            modal.init = false;
            this.setState({ modal });
        }, 400);

        this.setState({ modal });
    }

    onWindowResize() {
        console.log('window resize');
        const { _version } = this.state;
        this.setState({ _version: _version + 1 });
    }

    jumpIfAlreadyLogin() {
        const { user, remembered, token, origin, page } = this.state;

        if (remembered && token && user && user.customer && page && page.menus && page.componentList && page.pageList) {
            window.location.href = origin + '/#/index';
        } else {
            clearStorage();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingText: '',
            modal: {
                init: false,
                show: false,
            },
            login: {
                userName: '',
                password: '',
            },
            loginCheck: {},
            loginFocus: {},
            _version: 0,

            origin: window.store.origin,
            remembered: getStorage('remembered') === '1',
            token: window.store.tokenInfo && window.store.tokenInfo.accessToken,
            user: window.store.user,
        };
    }

    componentWillMount() {
        this.jumpIfAlreadyLogin();

        const locale = this.getLocale();
        setStorage('locale', locale || 'zh-CN');
        window.store.locale = locale || 'zh-CN';

        this.state.locale = locale || 'zh-CN';
        window.document.title = getString('login');
    }

    componentDidMount() {
        this._onWindowResize = this.onWindowResize.bind(this);
        this._login = this.login.bind(this);
        window.addEventListener('resize', this._onWindowResize);
        window.addEventListener('keydown', this._login);

        const { login } = this.state;
        // 强制重写用户名密码,阻止微信浏览器等重写表单
        setTimeout(() => {
            login.userName && (document.querySelector('input[name=\'userName\']').value = login.userName);
            login.password && (document.querySelector('input[name=\'password\']').value = login.password);
        }, 20);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onWindowResize);
        window.removeEventListener('keydown', this._login);
    }

    render() {
        const { locale, remembered, origin, modal, loginCheck, loginFocus, loading, loadingText } = this.state;
        const isMobile = (window.innerWidth < 768 || window.innerHeight < 768);
        const imgWidth = window.innerWidth < 1224 ? 800 : window.innerWidth - 500;

        const contentStyle = window.innerHeight < 600 || window.innerWidth < 1024 ? {} : { backgroundImage: 'url(login/sparks.jpg)', backgroundSize: (imgWidth) + 'px ' + window.innerHeight + 'px', opacity: 0.9 };
        const loginBoxStyle = window.innerHeight < 600 || window.innerWidth < 1024 ? { width: '100%' } : { width: 500 };
        const loginTitleStyle = isMobile ? { marginTop: 0 } : { marginTop: 0 - window.innerHeight * 0.25 };

        return (
            <div className='root'>
                <div className='content' style={contentStyle}>
                    <div className='loginBox' style={loginBoxStyle}>
                        <div className='title' style={loginTitleStyle}>{locale === 'zh-CN' ? getString('login').split('').join(' ') : getString('login')}</div>
                        <form>
                            <div style={{ borderBottomColor: loginFocus['userName'] ? '#4DA1FF' : 'rgba(18,33,51,0.3)' }}>
                                <Icon wrapperStyle={{ width: 24, height: 20 }} iconSize={[20, 20]} iconPath='icon-user' iconColor={loginFocus['userName'] ? '#4DA1FF' : '#808FA3'} />
                                <input type='text' name='userName'
                                    onKeyUp={(e) => { this.checkLogin(e); }}
                                    onFocus={(e) => { this.setLoginFocus(e, true); }}
                                    onBlur={(e) => { this.setLoginFocus(e, false); }}
                                    className={loginCheck['userName'] ? 'red' : ''}
                                    placeholder={getString('please+fill+userName')}
                                />
                            </div>
                            <div style={{
                                marginTop: 30,
                                borderBottomColor: loginFocus['password'] ? '#4DA1FF' : 'rgba(18,33,51,0.3)',
                            }}>
                                <Icon wrapperStyle={{ width: 24, height: 20 }} iconSize={[20, 20]} iconPath='icon-lock' iconColor={loginFocus['password'] ? '#4DA1FF' : '#808FA3'} />
                                <input type='password' name='password'
                                    onKeyUp={(e) => { this.checkLogin(e); }}
                                    onFocus={(e) => { this.setLoginFocus(e, true); }}
                                    onBlur={(e) => { this.setLoginFocus(e, false); }}
                                    className={loginCheck['password'] ? 'red' : ''}
                                    placeholder={getString('please+fill+password')} />
                            </div>
                            <div>
                                <span className={'checkBox ' + (remembered ? 'checked' : '')} onClick={() => { this.setState({ remembered: !remembered }); }}>
                                    {!remembered ? '' : <Icon iconSize={[14, 14]} iconPath='icon-check1' iconColor='rgb(255,255,255)' />}
                                </span>
                                <span>{getString('remember+password')}</span>
                            </div>
                            <button type='button' onClick={() => { this.handleSubmit(); }}>{locale === 'zh-CN' ? getString('login').split('').join(' ') : getString('login')}</button>
                        </form>
                        <div className='foot'>
                            <a href='#' style={{ color: '#4DA1FF' }}
                                onClick={() => { this.setState({ modal: { init: true, show: true } }); }}>
                                {getString('apply+account')}
                            </a>
                            <div style={{ float: 'right' }}>
                                <a href='#' style={{ color: locale === 'zh-CN' ? '#4DA1FF' : '#11171B' }} onClick={() => { this.setLocale('zh-CN'); }}>中文</a>
                                /
                                <a href='#' style={{ color: locale === 'zh-CN' ? '#11171B' : '#4DA1FF' }} onClick={() => { this.setLocale('en-US'); }}>English</a>
                            </div>
                        </div>
                        {
                            window.innerHeight <= 600 || window.innerWidth < 768 ? '' : (
                                <div className='qrCodeBox' style={{ bottom: window.innerHeight < 768 ? -0.028 * window.innerHeight : -0.25 * window.innerHeight }}>
                                    {/* <div style={{ float: 'left' }}>
                                        <div className='qrimgBox'>
                                            <QRCode value={origin + '/static/node/media/share_app_android?share=true'} size={146} />
                                        </div>
                                        <span className='qrTitle'>ios {getString('scan_code_download')}</span>
                                    </div> */}
                                    <div>
                                        <div className='qrimgBox' style={{ width: 200, margin: '0 auto' }}>
                                            <QRCode value={origin + '/static/node/media/share_app_android?share=true'} size={200} />
                                        </div>
                                        <span className='qrTitle' style={{ width: '100%', textAlign: 'center' }}>android {getString('scan_code_download')}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    !modal.init ? '' : <Logon modal={modal} modalHide={() => { this.modalHide(); }} />
                }
                {
                    !loading ? '' : (
                        <div style={{ zIndex: 9999 }}>
                            <div className='maskLayer' />
                            <div className='modal-wrap loading'>
                                <div className='loadingBack'>
                                    <div className='la-ball-spin-clockwise'>
                                        <div />
                                        <div />
                                        <div />
                                        <div />
                                        <div />
                                        <div />
                                        <div />
                                        <div />
                                    </div>
                                    <div className='loadingText'>
                                        <strong>{loadingText}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

class Logon extends Component {
    objToUrl(url, obj) {
        const subFix = Object.keys(obj).filter(k => obj[k] != null).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

        if (url.indexOf('?') > 0) {
            url += '&' + subFix;
        } else {
            url += '?' + subFix;
        }
        return url;
    }

    handleSubmit() {
        const { logon, logonCheck } = this.state;
        const check = Object.keys(logon).find(key => this.isNull(logon[key]));
        if (check) {
            logonCheck[check] = true;
            this.setState({ logonCheck });
        } else {
            axios.post(this.objToUrl('/api/mdm/customer/register', logon))
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        alert('申请成功!审核通过后我们会将账号信息发送至您的手机');
                        this.props.modalHide();
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        }
    }

    checkLogon(elm) {
        const { logonCheck } = this.state;
        const { value, name } = elm.target;

        (this.state.logon)[name] = value;

        if (logonCheck[name] !== this.isNull(value)) {
            logonCheck[name] = this.isNull(value);
            this.setState({ logonCheck });
        }
    }

    isNull(value) {
        return value === undefined || value === null || value === '';
    }

    constructor(props) {
        super(props);
        this.state = {
            logon: {
                mdmId: '',
                name: '',
                phone: '',
                type: 'root',
            },
            logonCheck: {},
        };
    }

    render() {
        const { logonCheck } = this.state;
        const { modal } = this.props;

        return (
            <div className={modal.show ? 'md-show' : 'md-hide'} style={{ zIndex: 9999 }}>
                <div className='maskLayer' />
                <div className='modal-wrap' data-type='modal'
                    onClick={(e) => {
                        (e.target.dataset.type === 'modal') && this.props.modalHide();
                    }}>
                    <div className='modal' data-type='modal'>
                        <div className='modal-content'>
                            <div className='modal-close' onClick={() => { this.props.modalHide(); }}>
                                {/* <img src='./close.svg' style={{width: 22, height: 22}} /> */}
                                <i style={{ fontSize: 22, color: 'black', lineHeight: 22 }} className='iconfont icon-close' />
                            </div>
                            <div className='modal-header'>
                                <div>{getString('apply+customer+account')}</div>
                            </div>
                            <div className='modal-body'>
                                <form className='modal-form'>
                                    <div className='modal-item'>
                                        <div className='item-lable'>
                                            <span className='red'>*</span>
                                            {getString('ID')}
                                        </div>
                                        <div className='item-control'>
                                            <input type='text' name='mdmId'
                                                className={logonCheck['mdmId'] ? 'check-error' : ''}
                                                onInput={(e) => { this.checkLogon(e); }} />
                                            <div className='red explain' style={{ display: logonCheck['mdmId'] ? '' : 'none' }}>{getString('please+fill+ID')}</div>
                                        </div>
                                    </div>
                                    <div className='modal-item'>
                                        <div className='item-lable'>
                                            <span className='red'>*</span>  {getString('company+name')}
                                        </div>
                                        <div className='item-control'>
                                            <input type='text' name='name' className={logonCheck['name'] ? 'check-error' : ''} onInput={(e) => { this.checkLogon(e); }} />
                                            <div className='red explain' style={{ display: logonCheck['name'] ? '' : 'none' }}>{getString('please+fill+company+name')}</div>
                                        </div>
                                    </div>
                                    <div className='modal-item'>
                                        <div className='item-lable'>
                                            <span className='red'>*</span> {getString('phone')}
                                        </div>
                                        <div className='item-control'>
                                            <input type='text' name='phone' className={logonCheck['phone'] ? 'check-error' : ''} onInput={(e) => { this.checkLogon(e); }} />
                                            <div className='red explain' style={{ display: logonCheck['phone'] ? '' : 'none' }}>{getString('please+fill+phone')}</div>
                                        </div>
                                    </div>
                                    <div className='modal-item'>
                                        <div className='item-lable'>
                                            <span className='red'>*</span> {getString('account+type')}
                                        </div>
                                        <div className='item-control'>
                                            <select name='type' className={logonCheck['type'] ? 'check-error' : ''} onLoad={(e) => { console.log(e.target); }} onChange={(e) => { this.checkLogon(e); }}>
                                                <option value='root'>主客户</option>
                                            </select>
                                            <div className='red explain' style={{ display: logonCheck['type'] ? '' : 'none' }}>{getString('please+select+account+type')}</div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className='modal-foot'>
                                <button type='button' onClick={() => { this.handleSubmit(); }}>{getString('apply')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
