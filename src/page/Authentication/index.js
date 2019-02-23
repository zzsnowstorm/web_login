import React, { Component } from 'react';
import styles from './index.less';
import background from '../../public/register-background.jpg';
import FileInput from '../../compent/FileInput';
// import { historyPush } from '../../util/index';

export default class Authentication extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.domRef = {};
    }

    render() {
        const { account, verificationCode } = this.state;
        return (
            <div className={styles.authentication} style={{ backgroundImage: `url(${background})` }}>
                <div className='authentication-content'>
                    <div className='authentication-title'>手机号验证码</div>
                    <article className='authentication-points'>
                        <p>我们刚才向 {account} 发送了一个验证码。请输入你收到的验证码。</p>
                    </article>
                    <FileInput
                        ref={(ref) => { this.domRef.verificationCode = ref; }}
                        style={{ width: '100%', marginTop: 30 }}
                        required
                        placeholder='请输入验证码'
                        value={verificationCode}
                        onChange={value => this.handleChange({ verificationCode: value })}
                    />
                    <div className='authentication-footer'>
                        <div style={{ float: 'right' }}>
                            <button
                                type='button'
                                className='authentication-button'
                                style={{ backgroundColor: '#CCCCCC', color: 'rgba(0,0,0,0.60)' }}
                                onClick={() => this.jump2Back('step1')}
                            >
                                上一步
                            </button>
                            <button
                                type='button'
                                className='authentication-button'
                                style={{ backgroundColor: '#4C84FF', marginLeft: 20 }}
                                onClick={() => this.jump2Next('step3')}
                            >
                                下一步
                            </button>
                        </div>
                    </div>
                </div>
                <div className='authentication-copyright'>
                    <span>
                        ©2019 Jowoiot  使用条款 隐私和Cookie
                    </span>
                </div>
            </div>
        );
    }
}
