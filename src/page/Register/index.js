import React, { Component } from 'react';
import styles from './index.less';
import logo from '../../public/logo.png';
import FileInput from '../../compent/FileInput';
import { historyPush, getString } from '../../util/index';
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
                                step1.account.setErrorMessage(account + getString('account_tips'));
                            } else {
                                historyPush(history, `/register/${step}`);
                            }
                        });
                    } else {
                        const params = { account, password, phone, email };
                        register(customerId, params).then((response) => {
                            if (response.status === 200) {
                                historyPush(history, step);
                                setTimeout(() => {
                                    historyPush(history, '/');
                                }, 1000);
                            }
                        }).catch((error) => {
                            const type = error.response.data.error;
                            step2[type].setErrorMessage((type === 'phone' ? phone : email) + getString('has_been_used'));
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
        const { customer } = this.state;
        function getPasswordRules(customerObj) {
            const complex = customerObj.complex || [];
            const rules = [{
                pattern: /^[^\s]*$/,
                message: '有空格',
            }];
            complex.map((item, i) => {
                switch (i) {
                case 0:
                    if (Number(item) === 1) {
                        rules.push({
                            pattern: /[A-Z]+/,
                            message: '缺少大写字母',
                        });
                    }
                    break;
                case 1:
                    if (Number(item) === 1) {
                        rules.push({
                            pattern: /[a-z]+/,
                            message: '缺少小写字母',
                        });
                    }
                    break;
                case 2:
                    if (Number(item) === 1) {
                        rules.push({
                            pattern: /[\d]+/,
                            message: '缺少数字',
                        });
                    }
                    break;
                case 3:
                    if (Number(item) === 1) {
                        rules.push({
                            pattern: /[\W]+/,
                            message: '缺少特殊字符',
                        });
                    }
                    break;
                default:
                    if (Number(item) === 1) {
                        rules.push({
                            pattern: /[\w|\W]{8,}/,
                            message: '密码至少8位',
                        });
                    }
                }
            });
            return rules;
        }
        const rules = getPasswordRules(customer);
        for (let i = 0, len = rules.length; i < len; i++) {
            const { pattern, message } = rules[i];
            if (!pattern.test(value)) {
                callback(false, message);
                break;
            }
            if (i === len - 1) {
                callback(true, '');
            }
        }
    }

    checkPhone(value, callback) {
        const check = /^1[3|4|5|7|8]\d{9}$/;
        callback(check.test(value), getString('phone_error1'));
    }

    checkEmail(value, callback) {
        // eslint-disable-next-line
        const check = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
        callback(check.test(value), getString('email_error1'));
    }

    renderstep1() {
        const { history, offLine } = this.props;
        const { customer, account } = this.state;
        return (
            <div className='register-content'>
                <div className='register-logo' style={{ backgroundImage: `url(${customer.logo || logo})` }} />
                <div className='register-title'>
                    {getString('create1+account')}
                </div>
                <FileInput
                    ref={(ref) => { this.domRef.step1.account = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder={getString('account_placeholder')}
                    value={account}
                    onChange={value => this.handleChange({ account: value })}
                    validateFields={(value, callback) => this.checkAccount(value, callback)}
                />
                <div className='register-jump'>
                    <span className='jump-span' onClick={() => {
                        historyPush(history, '/');
                    }}>
                        <div className='jump-text'>{getString('already+have1+account')}</div>
                        <div className='jump-arrowblueicon' style={{ backgroundImage: 'url(./login/arrowblueicon.png)' }} />
                    </span>
                </div>
                <div className='register-footer'>
                    <button
                        type='button'
                        className='register-button'
                        disabled={offLine}
                        style={{ float: 'right', backgroundColor: '#4C84FF' }}
                        onClick={() => this.jump2Step('step2')}
                    >
                        {getString('next_step')}
                    </button>
                </div>
            </div>
        );
    }

    renderstep2() {
        const { offLine } = this.props;
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
                    {getString('setting+account1')}
                </div>
                <FileInput
                    ref={(ref) => { this.domRef.step2.password = ref; }}
                    type='password'
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder={getString('please+input+password')}
                    value={password}
                    onChange={value => this.handleChange({ password: value })}
                    validateFields={(value, callback) => this.checkPassword(value, callback)}
                />
                <FileInput
                    ref={(ref) => { this.domRef.step2.phone = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder={getString('binding+phone')}
                    value={phone}
                    onChange={value => this.handleChange({ phone: value })}
                    validateFields={(value, callback) => this.checkPhone(value, callback)}
                />
                <div style={{ fontSize: 12, color: '#4C84FF', marginTop: 30 }}>选填*</div>
                <FileInput
                    ref={(ref) => { this.domRef.step2.email = ref; }}
                    style={{ width: '100%', marginTop: 10 }}
                    placeholder={getString('binding+email')}
                    value={email}
                    onChange={value => this.handleChange({ email: value })}
                    validateFields={(value, callback) => this.checkEmail(value, callback)}
                />
                <div className='register-footer'>
                    <button
                        type='button'
                        disabled={offLine}
                        className='register-button'
                        style={{ float: 'right', backgroundColor: '#4C84FF' }}
                        onClick={() => this.jump2Step('step3')}
                    >
                        {getString('next_step')}
                    </button>
                </div>
            </div>
        );
    }

    renderstep3() {
        return (
            <div className='register-content' style={{ display: 'flex', flexFlow: 'column nowrap', justifyContent: 'center', alignItems: 'center' }}>
                <div className='register-title'>
                    {getString('register+success')}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.60)', fontFamily: 'PingFangSC-Regular', marginTop: 30 }}>
                    {getString('register_success_tips')}
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
        const { match: { params: { step } }, customerId, history } = this.props;
        window.document.title = getString('register+account');
        fetchCustomerData(customerId).then((response) => {
            this.setState({ customer: response.data });
        }).catch((error) => {
            console.error(error);
        });

        if (!step) {
            historyPush(history, '/register/step1');
        }
    }

    render() {
        return (
            <div className={styles.register}>
                { this.renderStep() }
            </div>
        );
    }
}
