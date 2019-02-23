import React, { Component } from 'react';
import propTypes from 'prop-types';
import styles from './index.less';

const colors = {
    blur: 'rgba(0, 0, 0, 0.5)',
    focus: 'rgb(77, 144, 254)',
    error: 'rgb(244, 67, 54)',
};

export default class OutlineInput extends Component {
    _handleInput(status, value) {
        const { onChange } = this.props;
        this.setState({ status }, () => {
            onChange(value);
        });
    }

    setColor(color) {
        const { status } = this.state;
        const { error } = colors;
        status === 'error' ? this.setState({ color: error }) : this.setState({ color });
    }

    handleFocus() {
        const { focus } = colors;
        this.setColor(focus);
    }

    handleBlur() {
        const { blur } = colors;
        this.setColor(blur);
    }

    handleChange(e) {
        const { validateFields } = this.props;
        const { value } = e.target;
        validateFields(value) ? this._handleInput('default', value) : this._handleInput('error', value);
    }

    constructor(props) {
        super(props);
        const { blur } = colors;
        this.state = {
            status: 'default',
            color: blur,
        };
    }


    render() {
        const { style, value, lable } = this.props;
        const { status, color } = this.state;
        return (
            <div className={styles.outlineInput} style={style}>
                <fieldset className='outlineInput-fieldset' style={{ borderColor: color }}>
                    {/* <div style={{ width: '100%' }} ></div> */}
                    <legend className='outlineInput-legend' style={{ color }}>{status === 'error' ? 'error' : lable }</legend>
                    <input
                        type='text'
                        className='outlineInput-input'
                        value={value}
                        onFocus={this.handleFocus.bind(this)}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />
                </fieldset>
            </div>
        );
    }
}

OutlineInput.propTypes = {
    // eslint-disable-next-line
    style: propTypes.object,
    lable: propTypes.string,
    value: propTypes.string,
    // eslint-disable-next-line
    onChange: propTypes.func,
    // eslint-disable-next-line
    validateFields: propTypes.func,
};

OutlineInput.defaultProps = {
    style: {},
    lable: '',
    value: '',

    onChange: (value) => { console.log(value); },
    validateFields: () => true,
};
