import React, { Component } from 'react';
import propTypes from 'prop-types';
import styles from './index.less';
import { getString, getStorage } from '../../util';

export default class FileInput extends Component {
    setErrorMessage(errorMessage) {
        this.setState({ error: true, errorMessage });
    }

    handleCheck() {
        const status = () => !this.state.error;
        return new Promise((resolve) => {
            const { required, value, validateFields } = this.props;
            if (required && !value) {
                this.setState({ error: true, errorMessage: getString('not_empty') }, () => resolve(status()));
                return;
            }
            if (!required && !value) {
                this.setState({ error: false, errorMessage: '' }, () => resolve(status()));
                return;
            }
            validateFields(value, (error, errorMessage) => {
                this.setState({ error: !error, errorMessage }, () => resolve(status()));
            });
        });
    }

    handlevalidate(error, errorMessage) {
        this.setState({ error: !error, errorMessage });
    }

    handleFocus() {
        this.setState({ focus: true });
    }

    handleBlur() {
        this.setState({ focus: false }, () => {
            this.handleCheck();
        });
    }

    handleChange(e) {
        const { onChange } = this.props;
        onChange(e.target.value);
    }

    constructor(props) {
        super(props);
        this.state = {
            locale: getStorage('locale'),
            error: false,
            errorMessage: '',

            focus: false,
        };
    }

    componentDidUpdate() {
        const { locale, error, errorMessage } = this.state;
        if (locale !== getStorage('locale') && error && errorMessage) {
            this.setState({ locale: getStorage('locale') }, () => this.handleCheck());
        }
    }

    render() {
        const { error, errorMessage, focus } = this.state;
        const { value, placeholder, type, style, name } = this.props;
        return (
            <div
                className={`${styles.fileInput} ${error ? styles.fileInputError : (focus ? styles.fileInputFocus : '')}`}
                style={style}
            >
                { error && <span className='fileInput-errorMessage'>{errorMessage}</span>}
                <input
                    name={name || null}
                    type={type}
                    className='fileInput-input'
                    value={value}
                    placeholder={placeholder}
                    onFocus={this.handleFocus.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );
    }
}

FileInput.propTypes = {
    name: propTypes.string,
    // eslint-disable-next-line
    style: propTypes.object,
    placeholder: propTypes.string,
    value: propTypes.string,
    type: propTypes.string,
    // eslint-disable-next-line
    onChange: propTypes.func,
    // eslint-disable-next-line
    validateFields: propTypes.func,
    required: propTypes.bool,
};

FileInput.defaultProps = {
    name: '',
    style: {},
    placeholder: '',
    value: '',
    type: 'text',

    onChange: (value) => { console.log(value); },
    validateFields: (value, callback) => callback(true, ''),
    required: false,
};
