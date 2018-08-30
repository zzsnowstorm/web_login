import React, {Component} from 'react';
import QRCode  from 'qrcode-react';
import Icon from '../compent/Icon';
import getString from '../util/intl';
import {clearStorage, setStorage, setCookie, getStorage} from '../util/index';
import axios from 'axios';
import './login.css';

export default class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            login:{
                userName: '',
                password: ''
            },
            loginCheck:{},
            loginFocus:{},
            _version: 0,

            origin: window.store.origin,
            remembered: getStorage('remembered') == '1' ? true : false,
            token: window.store.tokenInfo && window.store.tokenInfo.accessToken,
            user: window.store.user,
        };
    }

    handleSubmit(){
        const {login, loginCheck, remembered, origin} = this.state;
        const check = Object.keys(login).find((key)=>{return this.isNull(login[key])});
        if(check){
            loginCheck[check] = true;
            this.setState({loginCheck: loginCheck});
        }else{
            axios.post('/api/users/login', login)
            .then((response)=> {
                if(response.status=='200'){
                    const accessToken = response.data.accessToken;
                    const refreshToken = response.data.refreshToken;

                    //remembered && setCookie('login', JSON.stringify(login))

                    const _remembered = remembered ? 1 : 0;
                    setStorage('remembered', _remembered)
                    window.store.remembered = _remembered
                    setStorage('token', { accessToken, refreshToken })
                    window.store = { ...window.store, tokenInfo: { accessToken, refreshToken } }

                    const Authorization = 'Bearer ' + accessToken;
                    axios.get('/api/mdm/person/user/'+response.data.user.userId,{
                        headers: {Authorization, "Accept-Language": window.store.locale },
                    })
                    .then((response)=>{
                        if(response.status=='200'){
                            const userData = {
                                ...response.data.user,
                                ...response.data
                            }
                            setStorage('user', userData);
                            window.store.user = userData;
    
                            window.location.href = origin + '/#/index';
                        }
                        
                    })
                    .catch((error)=>{
                        alert(error.response.status);
                    })
                }
            })
            .catch((error)=> {
                alert(error.response.data.error);
            });
        }
    }

    login(e){
        let key = window.event ? e.keyCode :e.which;  //获取被按下的键值 
        //判断如果用户按下了回车键（keycody=13） 
        if(key==13){ 
            this.handleSubmit();
        }
    }

    checkLogin(elm){
        const {loginCheck} = this.state;
        const {value, name} = elm.target;

        (this.state.login)[name] = value;

        if(loginCheck[name] != this.isNull(value)){
            loginCheck[name] = this.isNull(value);
            this.setState({loginCheck: loginCheck});
        }
    }

    isNull(value){
        return value===undefined||value===null||value==='';
    }

    setLoginFocus(e,bool){
        const {loginFocus} = this.state;
        const {name} = e.target;

        loginFocus[name] = bool
        this.setState({loginFocus: loginFocus});
    }

    getLocale(){
        let locale;
        if(navigator.browserLanguage){
            locale = navigator.browserLanguage;
        }else{
            locale = navigator.language;
        }
        return locale;
    }

    setLocale(locale){
        setStorage("locale", locale);
        window.store.locale = locale;
        this.setState({locale: locale});
    }

    onWindowResize(){
        console.log('window resize');
        this.setState({_version: this.state._version + 1});
    }

    jumpIfAlreadyLogin() {
        const { user, remembered, token, origin } = this.state
        if (remembered && token && user && user.customer) {
            window.location.href = origin + '/#/index';
        } else {
            clearStorage()
        }

    }

    componentWillMount(){
        this.jumpIfAlreadyLogin();

        const locale = this.getLocale();
        setStorage('locale', locale || 'zh-CN')
        window.store.locale = locale || 'zh-CN';

        this.state.locale = locale || 'zh-CN';
    }

    componentDidMount(){
        this._onWindowResize = this.onWindowResize.bind(this);
        this._login = this.login.bind(this);
        window.addEventListener('resize', this._onWindowResize);
        window.addEventListener('keydown', this._login);

        const { login } = this.state
        // 强制重写用户名密码,阻止微信浏览器等重写表单
        setTimeout(() => {
            login.userName && (document.querySelector(`input[name='userName']`).value = login.userName);
            login.password && (document.querySelector(`input[name='password']`).value = login.password);
        }, 20)
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this._onWindowResize);
        window.removeEventListener('keydown', this._login);
    }

    render(){
        const {locale, remembered, origin, modal, loginCheck, loginFocus} = this.state;
        
        const showImage = window.innerWidth<1440 ? true : false;

        return (<div className='root'>
                    <div className='content'>
                        {showImage ? '':
                            <div className='img' style={{backgroundImage: 'url(login/landing_img_3@3x.jpg)'}}></div>
                        }
                        <div className='loginBox'>
                            <div className="title">{locale=='zh-CN' ? Array.from(getString('login')).join(' ') : getString('login')}</div>
                            <form>
                                <div style={{borderBottomColor: loginFocus['userName'] ? '#4DA1FF' : 'rgba(18,33,51,0.3)'}}>
                                    <Icon iconSize={[24,24]} iconPath='icon-user' iconColor={loginFocus['userName'] ? '#4DA1FF' : '#808FA3'} />
                                    <input type="text" name='userName' 
                                        onInput={(e)=>{this.checkLogin(e)}} 
                                        onFocus={(e)=>{ this.setLoginFocus(e,true) }}
                                        onBlur={(e)=>{ this.setLoginFocus(e,false) }}
                                        className={loginCheck['userName'] ? 'red' : ''} 
                                        placeholder={getString("please+fill+userName")} />
                                </div>
                                <div style={{marginTop: window.innerHeight <= 450 ? 30 : 55,
                                            borderBottomColor: loginFocus['password'] ? '#4DA1FF' : 'rgba(18,33,51,0.3)'}}>
                                    <Icon iconSize={[24,24]} iconPath='icon-lock' iconColor={loginFocus['password'] ? '#4DA1FF' : '#808FA3'} />
                                    <input type="password" name='password' 
                                        onInput={(e)=>{this.checkLogin(e)}} 
                                        onFocus={(e)=>{ this.setLoginFocus(e,true) }}
                                        onBlur={(e)=>{ this.setLoginFocus(e,false) }}
                                        className={loginCheck['password'] ? 'red' : ''} 
                                        placeholder={getString("please+fill+password")} />
                                </div>
                                <div>
                                    <input type="checkbox" checked={remembered} onChange={(e)=>{this.setState({remembered: e.target.checked})}} />
                                    <span>{getString('remember+password')}</span>
                                </div>
                                <button type="button" onClick={()=>{this.handleSubmit()}}>{locale=='zh-CN' ? Array.from(getString('login')).join(' ') : getString('login')}</button>  
                            </form>
                            <div className="foot">
                                <a href="#" style={{color:'#4DA1FF'}} onClick={()=>{this.setState({modal: true})}}>{getString('apply+account')}</a>
                                <div style={{float: 'right'}}>
                                    <a href="#"  style={{color: locale=='zh-CN' ? '#4DA1FF': '#11171B'}} onClick={()=>{this.setLocale('zh-CN')}}>中文</a>
                                    /
                                    <a href="#" style={{color: locale=='zh-CN' ? '#11171B': '#4DA1FF'}} onClick={()=>{this.setLocale('en-US')}}>English</a>
                                </div>
                            </div>
                            <div className='qrCodeBox'>
                                <div style={{float: 'left'}}>
                                    <div className='qrimgBox'>
                                        <QRCode value={origin + "/static/node/media/share_app_android?share=true"} size={146} />
                                    </div>
                                    <span className='qrTitle'>ios {getString('scan_code_download')}</span>
                                </div>
                                <div style={{float: 'right'}}>
                                    <div className='qrimgBox'>
                                        <QRCode value={origin + "/static/node/media/share_app_android?share=true"} size={146} />
                                    </div>
                                    <span className='qrTitle'>android {getString('scan_code_download')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!modal ? '' :
                        <Logon modalHide={()=>{this.setState({modal: false})}} />
                    }
                </div>)
    }
}

class Logon extends Component{
    constructor(props) {
        super(props);
        this.state = {
            logon:{
                mdmId: '',
                name: '',
                phone: '',
                type: 'root'
            },
            logonCheck:{}
        };
    }

    objToUrl(url, obj){
        const subFix = Object.keys(obj).filter(k => obj[k] != null).map((k) =>{
            return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
        }).join('&');

        if (url.indexOf('?') > 0) {
            return url + '&' + subFix
        } else {
            return url + '?' + subFix
        }
    }

    handleSubmit(){
        const {logon, logonCheck} = this.state;
        const check = Object.keys(logon).find((key)=>{
                        return this.isNull(logon[key]);
                      });
        if(check){
            logonCheck[check] = true;
            this.setState({logonCheck: logonCheck});
        }else{
            axios.post(this.objToUrl('/api/mdm/customer/register', logon))
            .then((response)=> {
                console.log(response); 
                if(response.status=='200'){
                    alert("申请成功!审核通过后我们会将账号信息发送至您的手机");
                    this.props.modalHide();
                }
            })
            .catch((error)=> {
                alert(error);
            });
        }
    }

    checkLogon(elm){
        const {logonCheck} = this.state;
        const {value, name} = elm.target;

        (this.state.logon)[name] = value;

        if(logonCheck[name] != this.isNull(value)){
            logonCheck[name] = this.isNull(value);
            this.setState({logonCheck: logonCheck});
        }
    }

    isNull(value){
        return value===undefined||value===null||value==='';
    }

    render(){
        const {logonCheck} = this.state;

        return (<div style={{zIndex: 9999}}>
                    <div className='maskLayer'></div>
                    <div className='modal-wrap' data-type="modal" onClick={(e)=>{
                        (e.target.dataset.type=='modal')&&this.props.modalHide()
                    }}>
                        <div className="modal" data-type="modal"> 
                            <div className="modal-content"> 
                                <div className='modal-close' onClick={()=>{this.props.modalHide()}}>
                                    {/* <img src="./close.svg" style={{width: 22, height: 22}} /> */}
                                    <i style={{ fontSize: 22, color: 'black', lineHeight: 22 }} className="iconfont icon-close" />
                                </div>
                                <div className='modal-header'>
                                    <div>{getString("apply+customer+account")}</div>
                                </div>
                                <div className="modal-body">
                                    <form className='modal-form'>
                                        <div className='modal-item'>
                                            <div className='item-lable'>
                                                <span className='red'>*</span> {getString("ID")}
                                            </div>
                                            <div className='item-control'>
                                                <input type="text" name='mdmId' 
                                                    className={logonCheck['mdmId'] ? 'check-error' : ''} 
                                                    onInput={(e)=>{this.checkLogon(e)}}/>
                                                <div className="red explain" style={{display: logonCheck['mdmId'] ? '' : 'none' }}>{getString("please+fill+ID")}</div>
                                            </div>
                                        </div>
                                        <div className='modal-item'>
                                            <div className='item-lable'>
                                                <span className='red'>*</span> {getString("company+name")}
                                            </div>
                                            <div className='item-control'>
                                                <input type="text" name='name' className={logonCheck['name'] ? 'check-error' : ''} onInput={(e)=>{this.checkLogon(e)}} />
                                                <div className="red explain" style={{display: logonCheck['name'] ? '' : 'none' }}>{getString("please+fill+company+name")}</div>
                                            </div>
                                        </div>
                                        <div className='modal-item'>
                                            <div className='item-lable'>
                                                <span className='red'>*</span> {getString("phone")}
                                            </div>
                                            <div className='item-control'>
                                                <input type="text" name='phone' className={logonCheck['phone'] ? 'check-error' : ''} onInput={(e)=>{this.checkLogon(e)}} />
                                                <div className="red explain" style={{display: logonCheck['phone'] ? '' : 'none' }}>{getString("please+fill+phone")}</div>
                                            </div>
                                        </div>
                                        <div className='modal-item'>
                                            <div className='item-lable'>
                                                <span className='red'>*</span> {getString("account+type")}
                                            </div>
                                            <div className='item-control'>
                                                <select name='type' className={logonCheck['type'] ? 'check-error' : ''} onLoad={(e)=>{console.log(e.target)}} onChange={(e)=>{this.checkLogon(e)}}>
                                                    <option value='root'>主客户</option>
                                                </select>
                                                <div className="red explain" style={{display: logonCheck['type'] ? '' : 'none' }}>{getString("please+select+account+type")}</div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className='modal-foot'>
                                    <button onClick={()=>{this.handleSubmit()}}>{getString("apply")}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
    }
}

