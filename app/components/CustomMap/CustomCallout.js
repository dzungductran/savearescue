import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './CustomCallout.styles';

const propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
};

class CustomCallout extends React.Component {
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.bubble}>
                    <View style={styles.amount}>
                        {this.props.children}
                    </View>
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
            </View>
        );
    }
}

CustomCallout.propTypes = propTypes;

module.exports = CustomCallout;
