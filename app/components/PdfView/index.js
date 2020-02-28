import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types'

const IS_IOS = Platform.OS === 'ios';

const androidPDFViewUriPrefix = 'http://docs.google.com/gview?embedded=true&url='

export default class PdfView extends Component {

    onLoadEnd = () => {
        this.props.onLoadEnd && this.props.onLoadEnd()
    }

    render() {
        const { src } = this.props
        if (IS_IOS) {
            return (
                <WebView
                    source={{ uri: src }}
                    scalesPageToFit
                    domStorageEnabled
                    javaScriptEnabled
                    onLoadEnd={() => this.onLoadEnd()}
                    {...this.props}
                />
            );
        } else {
            return (
                <WebView
                    source={{ uri: `${androidPDFViewUriPrefix}${src}` }}
                    scalesPageToFit
                    javaScriptEnabled
                    domStorageEnabled
                    onLoadEnd={() => this.onLoadEnd()}
                    {...this.props}
                />
            );
        }
    }
}

PdfView.propTypes = {
    ...View.propTypes,
    src: PropTypes.string.isRequired,
    onLoadEnd: PropTypes.func,
}

PdfView.defaultProps = {
    onLoadEnd: null,
}
