import React, { Component } from 'react';
import styles from './index.less';
import background from '../../public/register-background.jpg';
import FileInput from '../../compent/FileInput';
import { historyPush } from '../../util/index';

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
            callback(false, '密码中不能有空格');
        } else if (value.length < 8) {
            callback(false, '最少8个字符');
        } else {
            callback(true, '');
        }
    }

    checkConfirmPassword(value, callback) {
        const { password } = this.state;
        if (password !== value) {
            callback(false, '这些密码不匹配');
        } else {
            callback(true, '');
        }
    }

    renderstep1() {
        const { account } = this.state;
        return (
            <div className='password_reset-content'>
                <div className='password_reset-title'>恢复你的账户</div>
                <article className='password_reset-points'>
                    <p>我们可以帮助你重置密码和安全信息。首先，请输入你的帐户，然后按照下面的说明操作。</p>
                </article>
                <FileInput
                    ref={(ref) => { this.domRef.step1.account = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder='请输入手机号'
                    value={account}
                    onChange={value => this.handleChange({ account: value })}
                    validateFields={(value, callback) => this.checkAccount(value, callback)}
                />
                <div className='password_reset-footer'>
                    <button
                        type='button'
                        className='password_reset-button'
                        style={{ float: 'right', backgroundColor: '#4C84FF' }}
                        onClick={() => this.jump2Next('step2')}
                    >
                        下一步
                    </button>
                </div>
            </div>
        );
    }

    renderstep2() {
        const { account, verificationCode } = this.state;
        return (
            <div className='password_reset-content'>
                <div className='password_reset-title'>手机号验证码</div>
                <article className='password_reset-points'>
                    <p>我们刚才向 {account} 发送了一个代码。请输入你收到的验证码。</p>
                </article>
                <FileInput
                    ref={(ref) => { this.domRef.step2.verificationCode = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder='请输入验证码'
                    value={verificationCode}
                    onChange={value => this.handleChange({ verificationCode: value })}
                />
                <div className='password_reset-footer'>
                    <div style={{ float: 'right' }}>
                        <button
                            type='button'
                            className='password_reset-button'
                            style={{ backgroundColor: '#CCCCCC', color: 'rgba(0,0,0,0.60)' }}
                            onClick={() => this.jump2Back('step1')}
                        >
                            上一步
                        </button>
                        <button
                            type='button'
                            className='password_reset-button'
                            style={{ backgroundColor: '#4C84FF', marginLeft: 20 }}
                            onClick={() => this.jump2Next('step3')}
                        >
                            下一步
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderstep3() {
        const { usedPassword, password, confirmPassword } = this.state;
        return (
            <div className='password_reset-content'>
                <div className='password_reset-title'>重新设置密码</div>
                {
                    usedPassword
                    && (
                        <article className='password_reset-points' style={{ color: '#FF1F1F' }}>
                            <p>请选择以前未用过的密码。为了帮助保护你的帐户，每次重新设置密码时，你需要选择新的密码。</p>
                        </article>
                    )
                }
                <FileInput
                    ref={(ref) => { this.domRef.step3.password = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder='新密码'
                    value={password}
                    onChange={value => this.handleChange({ password: value })}
                    validateFields={(value, callback) => this.checkPassword(value, callback)}
                />
                <div className='password_reset-tips'><p style={{ margin: '10px 0 0 0' }}>最少8个字符</p></div>
                <FileInput
                    ref={(ref) => { this.domRef.step3.confirmPassword = ref; }}
                    style={{ width: '100%', marginTop: 30 }}
                    required
                    placeholder='重新输入新密码'
                    value={confirmPassword}
                    onChange={value => this.handleChange({ confirmPassword: value })}
                />
                <div className='password_reset-footer'>
                    <div style={{ float: 'right' }}>
                        <button
                            type='button'
                            className='password_reset-button'
                            style={{ backgroundColor: '#CCCCCC', color: 'rgba(0,0,0,0.60)' }}
                            onClick={() => this.jump2Back('step2')}
                        >
                            上一步
                        </button>
                        <button
                            type='button'
                            className='password_reset-button'
                            style={{ backgroundColor: '#4C84FF', marginLeft: 20 }}
                            onClick={() => this.jump2Next('step4')}
                        >
                            下一步
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderstep4() {
        const { history } = this.props;
        return (
            <div className='password_reset-content'>
                <div className='password_reset-title'>重新设置密码成功</div>
                <article className='password_reset-points'>
                    <p>现在你可以使用新的安全信息登录到你的帐户。</p>
                </article>
                <div className='password_reset-footer'>
                    <button
                        type='button'
                        className='password_reset-button'
                        style={{ backgroundColor: '#4C84FF', width: '100%' }}
                        onClick={() => historyPush(history, '/')}
                    >
                        下一步
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
        if (!step) {
            const { history } = this.props;
            historyPush(history, '/password_reset/step1');
        }
    }

    render() {
        return (
            <div className={styles.password_reset} style={{ backgroundImage: `url(${background})` }}>
                {this.renderStep()}
                <div className='password_reset-copyright'>
                    <span>
                        ©2019 Jowoiot  使用条款 隐私和Cookie
                    </span>
                </div>
            </div>
        );
    }
}
