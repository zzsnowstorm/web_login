import React, { Component } from 'react';
import styles from './index.less';
import FileInput from '../../compent/FileInput';
import { historyPush, getString } from '../../util/index';

export default class PasswordReset extends Component {
    handleChange(state) {
        this.setState(state);
    }

    filterRefs(refs) {
        return Array.from(new Set(refs.filter(Boolean)));
    }

    jump2Next(step) {
        const { history } = this.props;
        // 下一步
        const { step1, step2, step3 } = this.domRef;
        const currRefs = Object.values(step === 'step2' ? step1 : (step === 'step3' ? step2 : step3));
        const refs = this.filterRefs(currRefs);

        Promise.all(refs.map(ref => ref.handleCheck())).then((values) => {
            if (values.every(Boolean)) {
                // switch (step) {
                //     case 'step2':
                //         return this.renderstep1();
                //     case 'step3':
                //         return this.renderstep2();
                //     case 'step4':
                //         return this.renderstep3();
                //     case 'step4':
                //         return this.renderstep4();
                //     default:
                //         return null;
                // }
                historyPush(history, `/password_reset/${step}`);
            }
        });
    }

    jump2Back(step) {
        const { history } = this.props;
        historyPush(history, `/password_reset/${step}`);
    }

    checkAccount(value, callback) {
        callback(true, '');
    }

    checkPassword(value, callback) {
        const check = /\s+/;
        if (check.test(value)) {
            callback(false, getString('password_error1'));
        } else if (value.length < 8) {
            callback(false, getString('password_reset_tips2'));
        } else {
            callback(true, '');
        }
    }

    checkConfirmPassword(value, callback) {
        const { password } = this.state;
        if (password !== value) {
            callback(false, getString('password+bu+match'));
        } else {
            callback(true, '');
        }
    }

    renderstep1() {
        const { account } = this.state;
        return (
            <div className='password_reset-content'>
                <div className='password_reset-title'>{getString('recover+your+account')}</div>
                <article className='password_reset-points'>
                    <p>{getString('password_reset_tips1')}</p>
                </article>
                <FileInput
                    ref={(ref) => { this.domRef.step1.account = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder={getString('please+input+phone')}
                    value={account}
                    onChange={value => this.handleChange({ account: value })}
                    validateFields={(value, callback) => this.checkAccount(value, callback)}
                />
                <div className='password_reset-footer password_reset-footer1'>
                    <button
                        type='button'
                        className='password_reset-button'
                        style={{ backgroundColor: '#4C84FF' }}
                        onClick={() => this.jump2Next('step2')}
                    >
                        {getString('next_step')}
                    </button>
                </div>
            </div>
        );
    }

    renderstep2() {
        const { account, verificationCode } = this.state;
        return (
            <div className='password_reset-content'>
                <div className='password_reset-title'>{getString('phone+verification_code')}</div>
                <article className='password_reset-points'>
                    <p>{getString('authentication_tips').split('{phone}').join(account)}</p>
                </article>
                <FileInput
                    ref={(ref) => { this.domRef.step2.verificationCode = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder={getString('please+input+verification_code')}
                    value={verificationCode}
                    onChange={value => this.handleChange({ verificationCode: value })}
                />
                <div className='password_reset-footer password_reset-footer2'>
                    <button
                        type='button'
                        className='password_reset-button'
                        style={{ backgroundColor: '#CCCCCC', color: 'rgba(0,0,0,0.60)' }}
                        onClick={() => this.jump2Back('step1')}
                    >
                        {getString('previous_step')}
                    </button>
                    <button
                        type='button'
                        className='password_reset-button'
                        style={{ backgroundColor: '#4C84FF', marginLeft: 20 }}
                        onClick={() => this.jump2Next('step3')}
                    >
                        {getString('next_step')}
                    </button>
                </div>
            </div>
        );
    }

    renderstep3() {
        const { usedPassword, password, confirmPassword } = this.state;
        return (
            <div className='password_reset-content'>
                <div className='password_reset-title'>{getString('reset_the_password')}</div>
                {
                    usedPassword
                    && (
                        <article className='password_reset-points' style={{ color: '#FF1F1F' }}>
                            {/* <p>请选择以前未用过的密码。为了帮助保护你的帐户，每次重新设置密码时，你需要选择新的密码。</p> */}
                            <p>{getString('password_error2')}</p>
                        </article>
                    )
                }
                <FileInput
                    ref={(ref) => { this.domRef.step3.password = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder={getString('new1+password')}
                    value={password}
                    onChange={value => this.handleChange({ password: value })}
                    validateFields={(value, callback) => this.checkPassword(value, callback)}
                />
                <div className='password_reset-tips'><p style={{ margin: '10px 0 0 0' }}>{getString('password_reset_tips2')}</p></div>
                <FileInput
                    ref={(ref) => { this.domRef.step3.confirmPassword = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder={getString('re_enter_new_password')}
                    value={confirmPassword}
                    onChange={value => this.handleChange({ confirmPassword: value })}
                />
                <div className='password_reset-footer password_reset-footer3'>
                    <button
                        type='button'
                        className='password_reset-button'
                        style={{ backgroundColor: '#CCCCCC', color: 'rgba(0,0,0,0.60)' }}
                        onClick={() => this.jump2Back('step2')}
                    >
                        {getString('previous_step')}
                    </button>
                    <button
                        type='button'
                        className='password_reset-button'
                        style={{ backgroundColor: '#4C84FF', marginLeft: 20 }}
                        onClick={() => this.jump2Next('step4')}
                    >
                        {getString('next_step')}
                    </button>
                </div>
            </div>
        );
    }

    renderstep4() {
        const { history } = this.props;
        return (
            <div className='password_reset-content'>
                <div className='password_reset-title'>{getString('successful_password_reset')}</div>
                <article className='password_reset-points'>
                    <p>{getString('password_reset_tips3')}</p>
                </article>
                <div className='password_reset-footer'>
                    <button
                        type='button'
                        className='password_reset-button'
                        style={{ backgroundColor: '#4C84FF', width: '100%' }}
                        onClick={() => historyPush(history, '/')}
                    >
                        {getString('next_step')}
                    </button>
                </div>
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
        case 'step4':
            return this.renderstep4();
        default:
            return null;
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            // step1
            account: '',

            // step2
            verificationCode: '',

            // step3
            password: '',
            confirmPassword: '',

            usedPassword: false,
        };

        this.domRef = {
            step1: {},
            step2: {},
            step3: {},
        };
    }

    componentDidMount() {
        const { step } = this.props.match.params;
        window.document.title = getString('reset+password');
        if (!step) {
            const { history } = this.props;
            historyPush(history, '/password_reset/step1');
        }
    }

    render() {
        return (
            <div className={styles.password_reset}>
                {this.renderStep()}
            </div>
        );
    }
}
