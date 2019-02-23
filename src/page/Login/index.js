import React, { Component } from 'react';
import localforage from 'localforage';
import styles from './index.less';
import background from '../../public/register-background.jpg';
import FileInput from '../../compent/FileInput';
import { historyPush, clearStorage } from '../../util/index';
import { userLogin } from '../../util/api';

export default class Login extends Component {
    jump2passwordReset() {
        const { history } = this.props;
        historyPush(history, '/password_reset/step1');
    }

    handleChange(state) {
        this.setState(state);
    }

    filterRefs() {
        return Array.from(new Set(this.domRefs.filter(Boolean)));
    }

    login(e) {
        const key = window.event ? e.keyCode : e.which;
        // 获取被按下的键值
        // 判断如果用户按下了回车键keycody=13
        if (key === 13) {
            this.handleSubmit();
        }
    }

    handleSubmit() {
        window.localStorage.clear();
        localforage.clear();
        clearStorage();
        const refs = this.filterRefs();

        Promise.all(refs.map(ref => ref.handleCheck())).then((values) => {
            if (values.every(Boolean)) {
                console.log('通过校验');
                const { userName, password } = this.state;
                userLogin({ userName, password })
                    .then((response) => {
                        if (response.status === 200) {
                            const { accessToken, refreshToken, user } = response.data;
                            const { fetchPageData } = this.props;
                            fetchPageData({ accessToken, refreshToken }, user.userId);
                        }
                    })
                    .catch((error) => {
                        alert(error.response.data.error);
                    });
            }
        });
    }

    checkUserName(value, callback) {
        // const checkPhone = /^1[3|4|5|7|8]\d{9}$/;
        // // eslint-disable-next-line
        // const checkEmail = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
        // callback(checkPhone.test(value) || checkEmail.test(value), '请填写电子邮箱或手机号');
        callback(true, '');
    }

    checkPassword(value, callback) {
        const check = /\s+/;
        callback(!check.test(value), '密码中不能有空格');
    }

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
        };

        this.domRefs = [];
    }

    componentDidMount() {
        const { userName, password } = this.state;
        this._login = this.login.bind(this);
        window.addEventListener('keydown', this._login);

        this.setState({ userName, password });
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._login);
    }

    render() {
        // const { isMobile } = this.props;
        const { userName, password } = this.state;
        return (
            <div className={styles.login} style={{ backgroundImage: `url(${background})` }}>
                <div className='login-content'>
                    <div className='login-title'>登陆</div>
                    <FileInput
                        ref={ref => this.domRefs.push(ref)}
                        style={{ width: '100%', marginTop: 30 }}
                        required
                        placeholder='电子邮箱或手机号'
                        value={userName}
                        onChange={value => this.handleChange({ userName: value })}
                        validateFields={(value, callback) => this.checkUserName(value, callback)}
                    />
                    <FileInput
                        ref={ref => this.domRefs.push(ref)}
                        style={{ width: '100%', marginTop: 30 }}
                        required
                        type='password'
                        placeholder='密码'
                        value={password}
                        onChange={value => this.handleChange({ password: value })}
                        validateFields={(value, callback) => this.checkPassword(value, callback)}
                    />
                    <div
                        style={{ marginTop: 30, fontSize: 14, color: ' #4C84FF', cursor: 'pointer' }}
                        onClick={this.jump2passwordReset.bind(this)}
                    >
                        忘记密码？
                    </div>
                    <div className='login-footer'>
                        <button
                            type='button'
                            className='login-button'
                            style={{ float: 'right', backgroundColor: '#4C84FF' }}
                            onClick={() => this.handleSubmit()}
                        >
                            登陆
                        </button>
                    </div>
                </div>
                <div className='login-copyright'>
                    <span>
                        ©2019 Jowoiot  使用条款 隐私和Cookie
                    </span>
                </div>
            </div>
        );
    }
}
