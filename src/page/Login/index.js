import React, { Component } from 'react';
import localforage from 'localforage';
import styles from './index.less';
import Icon from '../../compent/Icon';
import FileInput from '../../compent/FileInput';
import { historyPush, clearStorage, setStorage, getString, getStorage, setStore } from '../../util/index';
import { userLogin } from '../../util/api';

export default class Login extends Component {
    jump2passwordReset() {
        // const { history } = this.props;
        // historyPush(history, '/password_reset/step1');
    }

    handleChange(state) {
        this.setState({ ...state, errorMessage: '' });
    }

    login(e) {
        const { offLine } = this.props;
        const key = window.event ? e.keyCode : e.which;
        // 获取被按下的键值
        // 判断如果用户按下了回车键keycody=13
        if (!offLine && key === 13) {
            this.handleSubmit();
        }
    }

    handleSubmit() {
        window.localStorage.clear();
        localforage.clear();
        clearStorage();
        const refs = Object.values(this.domRefs);

        Promise.all(refs.map(ref => ref.handleCheck())).then((values) => {
            if (values.every(Boolean)) {
                const { userName, password, remembered } = this.state;
                setStorage('remembered', remembered);
                userLogin({ userName, password })
                    .then((response) => {
                        if (response.status === 200) {
                            const { accessToken, refreshToken, user, doubleFactor } = response.data;
                            if (doubleFactor) {
                                const { history } = this.props;
                                setStorage('token', { accessToken, refreshToken });
                                setStorage('user', user);

                                historyPush(history, '/authentication');
                            } else {
                                const { fetchPageData } = this.props;
                                fetchPageData({ accessToken, refreshToken }, user.userId);
                            }
                        }
                    })
                    .catch((error) => {
                        if (error.response.data.message === '用户校验错误') {
                            this.setState({ errorMessage: 'login_error' });
                        } else {
                            alert(getString('service_error'));
                        }
                    });
                this.setState({ errorMessage: '' });
            }
        });
    }

    checkPassword(value, callback) {
        const check = /\s+/;
        callback(!check.test(value), getString('password_error1'));
    }

    setRemembered(remembered) {
        setStorage('remembered', remembered);
        this.setState({ remembered });
    }

    setLocale(locale) {
        const { locale: _locale } = this.state;
        if (locale !== _locale) {
            setStore('locale', locale);
            setStorage('locale', locale);
            window.document.title = getString('login');
            this.setState({ locale });
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            locale: getStorage('locale'),
            remembered: Number(getStorage('remembered')),
            errorMessage: '',
        };

        this.domRefs = {};
    }

    componentDidMount() {
        window.document.title = getString('login');

        const { userName, password } = this.state;
        this._login = this.login.bind(this);
        window.addEventListener('keydown', this._login);

        this.setState({ userName, password });
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._login);
    }

    render() {
        const { offLine, domain } = this.props;
        const { errorMessage, userName, password, remembered, locale } = this.state;

        return (
            <div className={styles.login}>
                <div className='login-content'>
                    <div className='login-title'> {getString('login')} </div>
                    {errorMessage && <div style={{ marginTop: 10, color: '#FF1F1F' }}> <span>{getString(errorMessage)}</span> </div>}
                    <form>
                        <FileInput
                            name='userName'
                            ref={(ref) => { this.domRefs.userName = ref; }}
                            style={{ width: '100%', marginTop: errorMessage ? 10 : 30 }}
                            placeholder={getString('email2+or+phone')}
                            value={userName}
                            onChange={value => this.handleChange({ userName: value })}
                        />
                        <FileInput
                            name='password'
                            ref={(ref) => { this.domRefs.password = ref; }}
                            style={{ width: '100%', marginTop: 30 }}
                            type='password'
                            placeholder={getString('password')}
                            value={password}
                            onChange={value => this.handleChange({ password: value })}
                            validateFields={(value, callback) => this.checkPassword(value, callback)}
                        />
                    </form>
                    <div className='login-block' style={{ marginTop: 30, fontSize: 14, color: ' #4C84FF' }}>
                        <div className='login-rememberme' onClick={() => { this.setRemembered(Number(!remembered)); }}>
                            <span className={'checkBox ' + (remembered ? 'checked' : '')}>
                                {!remembered ? '' : <Icon iconSize={[14, 14]} iconPath='icon-check1' iconColor='rgb(255,255,255)' />}
                            </span>
                            <span>{getString('remember+me')}</span>
                        </div>
                        <div>
                            <span style={{ color: locale === 'zh-CN' ? '#4DA1FF' : '#11171B', cursor: 'pointer' }} onClick={() => this.setLocale('zh-CN')}>中文</span>
                            /
                            <span style={{ color: locale === 'zh-CN' ? '#11171B' : '#4DA1FF', cursor: 'pointer' }} onClick={() => this.setLocale('en-US')}>English</span>
                        </div>
                    </div>
                    <div className='login-footer'>
                        <button
                            type='button'
                            className='login-button'
                            disabled={offLine}
                            style={{ backgroundColor: '#4C84FF' }}
                            onClick={() => this.handleSubmit()}
                        >
                            {getString('login')}
                        </button>
                        <div className='login-footer-option'>
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={this.jump2passwordReset.bind(this)}
                            >
                                {getString('forgot+password')}
                            </div>
                            <div className='login-footer-separate'> · </div>
                            <div style={{ cursor: 'pointer' }} onClick={() => domain && window.open('https://fir.im/iiot' + domain)}>
                                {getString('App+download')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
