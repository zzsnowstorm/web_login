import React, { PureComponent } from 'react';
import './loading.css';

export default class Loading extends PureComponent {
    render() {
        const { content = '系统加载中...' } = this.props;
        return (
            <div>
                <div className='loader-5 loader-center'><span /></div>
                <div style={{ position: 'absolute', top: '50%', left: 'calc(50% - 20px)', textAlign: 'center', color: 'gray' }}>{content}</div>
            </div>
        );
    }
}
