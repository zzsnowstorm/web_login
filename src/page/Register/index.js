import React, { Component } from 'react';
import styles from './index.less';
import logo from '../../public/logo.png';
import FileInput from '../../compent/FileInput';
import { historyPush } from '../../util/index';
import { fetchCustomerData, checkUserName, register } from '../../util/api';

export default class Register extends Component {
    filterRefs(refs) {
        return Array.from(new Set(refs.filter(Boolean)));
    }

    jump2Step(step) {
        const { history, customerId } = this.props;

        if (['step2', 'step3'].includes(step)) {
            // 下一步
            const { step1, step2 } = this.domRef;
            const currRefs = Object.values(step === 'step2' ? step1 : step2);
            const refs = this.filterRefs(currRefs);

            Promise.all(refs.map(ref => ref.handleCheck())).then((values) => {
                if (values.every(Boolean)) {
                    const { account, password, phone, email } = this.state;
                    if (step === 'step2') {
                        // 校验账号是否存在
                        checkUserName(customerId, account).then((response) => {
                            if (response.data) {
                                step1.account.setErrorMessage(`${account}已经是注册过的帐户。如果是你的账户，请立即登录。`);
                            } else {
                                historyPush(history, `/register/${step}`);
                            }
                        });
                    } else {
                        const params = { customerKey: customerId, account, password, phone, email };
                        register(params).then((response) => {
                            if (response.status === 200) {
                                historyPush(history, step);
                                setTimeout(() => {
                                    historyPush(history, '/');
                                }, 1000);
                            }
                        }).catch((error) => {
                            alert(error.response.data.error);
                        });
                    }
                }
            });
        } else {
            // 其他跳转
            historyPush(history, `/register/${step}`);
        }
    }

    checkAccount(value, callback) {
        // const checkPhone = /^1[3|4|5|7|8]\d{9}$/;
        // eslint-disable-next-line
        // const checkEmail = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

        callback(true, '');
    }

    checkPassword(value, callback) {
        const check = /\s+/;
        callback(!check.test(value), '密码中不能有空格');
    }

    checkPhone(value, callback) {
        const check = /^1[3|4|5|7|8]\d{9}$/;
        callback(check.test(value), '手机号格式不正确');
    }

    checkEmail(value, callback) {
        // eslint-disable-next-line
        const check = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
        callback(check.test(value), '邮箱格式不正确');
    }

    renderstep1() {
        const { history } = this.props;
        const { customer, account } = this.state;
        return (
            <div className='register-content'>
                <div className='register-logo' style={{ backgroundImage: `url(${customer.logo || logo})` }} />
                <div className='register-title'>
                    创建账号
                </div>
                <FileInput
                    ref={(ref) => { this.domRef.step1.account = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder='建议电子邮箱或手机号'
                    value={account}
                    onChange={value => this.handleChange({ account: value })}
                    validateFields={(value, callback) => this.checkAccount(value, callback)}
                />
                <div className='register-jump'>
                    <span className='jump-span' onClick={() => historyPush(history, '/')}>
                        <div className='jump-text'>已有账号</div>
                        <div className='jump-arrowblueicon' style={{ backgroundImage: 'url(./login/arrowblueicon.png)' }} />
                    </span>
                </div>
                <div className='register-footer'>
                    <button
                        type='button'
                        className='register-button'
                        style={{ float: 'right', backgroundColor: '#4C84FF' }}
                        onClick={() => this.jump2Step('step2')}
                    >
                        下一步
                    </button>
                </div>
            </div>
        );
    }

    renderstep2() {
        const { customer, account, password, phone, email } = this.state;
        return (
            <div className='register-content'>
                <div className='register-logo' style={{ backgroundImage: `url(${customer.logo || logo})` }} />
                <div
                    className='register-jump2step1'
                    onClick={() => this.jump2Step('step1')}
                >
                    <span className='jump-span'>
                        <div className='jump-arrowblackicon' style={{ backgroundImage: 'url(./login/arrowblackicon.png)' }} />
                        <div className='jump-text'>{account}</div>
                    </span>
                </div>
                <div className='register-title'>
                    创建账号
                </div>
                <FileInput
                    ref={(ref) => { this.domRef.step2.password = ref; }}
                    type='password'
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder='输入密码'
                    value={password}
                    onChange={value => this.handleChange({ password: value })}
                    validateFields={(value, callback) => this.checkPassword(value, callback)}
                />
                <FileInput
                    ref={(ref) => { this.domRef.step2.phone = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder='绑定手机号'
                    value={phone}
                    onChange={value => this.handleChange({ phone: value })}
                    validateFields={(value, callback) => this.checkPhone(value, callback)}
                />
                <div style={{ fontSize: 12, color: '#4C84FF', marginTop: 30 }}>选填*</div>
                <FileInput
                    ref={(ref) => { this.domRef.step2.email = ref; }}
                    style={{ width: '100%', marginTop: 10 }}
                    placeholder='绑定邮箱'
                    value={email}
                    onChange={value => this.handleChange({ email: value })}
                    validateFields={(value, callback) => this.checkEmail(value, callback)}
                />
                <div className='register-footer'>
                    <button
                        type='button'
                        className='register-button'
                        style={{ float: 'right', backgroundColor: '#4C84FF' }}
                        onClick={() => this.jump2Step('step3')}
                    >
                        下一步
                    </button>
                </div>
            </div>
        );
    }

    renderstep3() {
        return (
            <div className='register-content' style={{ display: 'flex', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center' }}>
                <div className='register-title'>
                    注册成功
                </div>
                <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.60)', fontFamily: 'PingFangSC-Regular', marginTop: 30 }}>
                    现在你可以使用账号到你的帐户。
                </div>
                <div className='register-logo' style={{ backgroundImage: 'url(./login/checkmarkicon.png)', width: 43, height: 43, marginTop: 30 }} />
            </div>
        );
    }

    renderStep() {
        const { step } = this.props.match.params;
        switch (step) {
        case 'step1':
            return this.renderstep1();
        case 'step2':
            return this.renderstep2();
        case 'step3':
            return this.renderstep3();
        default:
            return null;
        }
    }

    handleChange(state) {
        this.setState(state);
    }

    constructor(props) {
        super(props);
        this.state = {
            customer: {
                logo: '',
                name: '',
            },
            account: '',
            password: '',
            phone: '',
            email: '',
        };
        this.domRef = {
            step1: {},
            step2: {},
        };
    }

    componentDidMount() {
        const { match: { params: { step } }, customerId } = this.props;
        fetchCustomerData(customerId).then((response) => {
            this.setState({ customer: response.data });
        }).catch((error) => {
            console.log(error);
        });

        if (!step) {
            const { history } = this.props;
            historyPush(history, '/register/step1');
        }
    }

    render() {
        const { customer: { name } } = this.state;
        return (
            <div className={styles.register}>
                { this.renderStep() }
                <div className='register-copyright'>
                    <span>
                        ©2019 { name || 'Jowoiot' }  使用条款 隐私和Cookie
                    </span>
                </div>
            </div>
        );
    }
}
