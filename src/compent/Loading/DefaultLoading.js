import React, { PureComponent } from 'react';
import './loading.css';

export default class Loading extends PureComponent {
    render() {
        const { content = '系统加载中...' } = this.props;
        return (
            <div>
                <div className='loader-5 loader-center'><span /></div>
                <div style={{ position: 'absolute', top: '50%', width: 'calc(100% - 30px)', textAlign: 'center', color: 'gray', marginLeft: 30 }}>{content}</div>
            </div>
        );
    }
}
