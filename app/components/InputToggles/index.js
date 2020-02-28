import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ViewPropTypes } from 'react-native';
import styles, {INPUT_HEIGHT} from './styles';

class InputToggles extends Component {
    static propTypes = {
        pill: PropTypes.bool,
        height: PropTypes.number,
        style: ViewPropTypes.style,
        labelStyle: ViewPropTypes.style,
        multiSelect: PropTypes.bool,
        isReadOnly: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.string).isRequired,
        values: PropTypes.arrayOf(PropTypes.string),
        value: PropTypes.arrayOf(PropTypes.string).isRequired,  // active values
        onChangeValue: PropTypes.func,
    };

    static defaultProps = {
        multiSelect: false,
        height: INPUT_HEIGHT,
        pill: false,
        style: {},
        labelStyle: {},
        optionStyle: {},
        isReadOnly: false,
    };

    onChangeValue = (value) => {
        const i = this.props.value.indexOf(value);
        if (i === -1) {
            // Add value
            if (this.props.multiSelect) {
                this.props.onChangeValue([...this.props.value, value]);
            } else {
                this.props.onChangeValue([value]);
            }
        } else {
            // Remove value
            if (this.props.multiSelect) {
                this.props.onChangeValue(this.props.value.filter(val => val !== value));
            }
        }
    }

    getValue(i) {
        return (this.props.values || this.props.options)[i];
    }

    renderOption = (option, i) => {
        const value = this.getValue(i);
        const half_height = this.props.pill ? (this.props.height/2) : 4;
        const isActive = this.props.value.includes(value);
        if (this.props.isReadOnly) {
            return (
                <View
                    key={option}
                    style={[
                        styles.option, this.props.optionStyle,
                        i === 0
                            && (styles.option__first, {borderTopLeftRadius:half_height, borderBottomLeftRadius:half_height}),
                        i + 1 === this.props.options.length
                            && (styles.option__last, {borderTopRightRadius:half_height, borderBottomRightRadius:half_height}),
                        isActive && styles.option__active,
                    ]}
                >
                    <Text style={[ styles.label, isActive && styles.label__active, this.props.labelStyle]}>
                        {option}
                    </Text>
                </View>
            );
        } else {
            return (
                <TouchableOpacity
                    key={option}
                    style={[
                        styles.option, this.props.optionStyle,
                        i === 0
                            && (styles.option__first, {borderTopLeftRadius:half_height, borderBottomLeftRadius:half_height}),
                        i + 1 === this.props.options.length
                            && (styles.option__last, {borderTopRightRadius:half_height, borderBottomRightRadius:half_height}),
                        isActive && styles.option__active,
                    ]}
                    onPress={() => this.onChangeValue(value)}
                >
                    <Text style={[ styles.label, isActive && styles.label__active, this.props.labelStyle]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            );
        }
    }

    render() {
        const height = this.props.pill ? this.props.height : 4;
        return (
            <View style={[styles.root, {borderRadius:height, height:this.props.height}, this.props.style]}>
                {this.props.options.map(this.renderOption)}
            </View>
        );
    }
}

export default InputToggles;
