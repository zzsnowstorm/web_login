import React, { Component } from 'react';
import styles from './index.less';
import FileInput from '../../compent/FileInput';
import { historyPush, getStorage } from '../../util/index';
import { checkSms } from '../../util/api';

export default class Authentication extends Component {
    jump2Back(step) {
        const { history } = this.props;
        historyPush(history, step);
    }

    handleChange(state) {
        this.setState(state);
    }

    checkSmsCode(value, callback) {
        if (value.length === 6) {
            callback(true, '');
        } else {
            callback(false, '请填写6位验证码');
        }
    }

    handleSubmit() {
        this.domRef.smsCode.handleCheck().then((value) => {
            if (value) {
                const { smsCode } = this.state;
                checkSms(smsCode).then((response) => {
                    const { accessToken, refreshToken, user } = response.data;
                    const { fetchPageData } = this.props;
                    fetchPageData({ accessToken, refreshToken }, user.userId);
                }).catch((error) => {
                    this.domRef.smsCode.setErrorMessage(error.response.data.error);
                });
            }
        });
    }

    constructor(props) {
        super(props);
        const { phone } = getStorage('user', true);

        this.state = {
            phone,
            smsCode: '',
        };
        this.domRef = {};
    }

    render() {
        const { phone, smsCode } = this.state;
        return (
            <div className={styles.authentication}>
                <div className='authentication-content'>
                    <div className='authentication-title'>手机号验证码</div>
                    <article className='authentication-points'>
                        <p>我们刚才向 {phone} 发送了一个验证码。请输入你收到的验证码。</p>
                    </article>
                    <FileInput
                        ref={(ref) => { this.domRef.smsCode = ref; }}
                        style={{ width: '100%', marginTop: 30 }}
                        required
                        placeholder='请输入验证码'
                        value={smsCode}
                        onChange={value => this.handleChange({ smsCode: value })}
                        validateFields={(value, callback) => this.checkSmsCode(value, callback)}
                    />
                    <div className='authentication-footer'>
                        <div style={{ float: 'right' }}>
                            <button
                                type='button'
                                className='authentication-button'
                                style={{ backgroundColor: '#CCCCCC', color: 'rgba(0,0,0,0.60)' }}
                                onClick={() => this.jump2Back('/')}
                            >
                                返回
                            </button>
                            <button
                                type='button'
                                className='authentication-button'
                                style={{ backgroundColor: '#4C84FF', marginLeft: 20 }}
                                onClick={() => this.handleSubmit()}
                            >
                                登录
                            </button>
                        </div>
                    </div>
                </div>
                <div className='authentication-copyright'>
                    <span>
                    ©{(new Date()).getFullYear()} <span style={{ textTransform: 'capitalize' }}>{document.domain}</span>  使用条款 隐私和Cookie
                    </span>
                </div>
            </div>
        );
    }
}
