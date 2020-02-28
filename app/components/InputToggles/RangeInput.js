import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ViewPropTypes } from 'react-native';
import styles, {INPUT_HEIGHT} from './styles';

class RangeInput extends Component {
    static propTypes = {
        label: PropTypes.string,
        height: PropTypes.number,
        style: ViewPropTypes.style,
        labelStyle: ViewPropTypes.style,
        option: PropTypes.shape({
            min: PropTypes.number.isRequired,
            max: PropTypes.number.isRequired
        }),
        value: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number
        }),
        onChangeValue: PropTypes.func.isRequired,
    };

    static defaultProps = {
        style: {},
        labelStyle: {},
        optionStyle: {},
        value: { min: 0, max: 0 }
    };

    onChangeValue = (i) => {
        const { value } = this.props;
        var max = value.max;
        var min = value.min;

        if (!min && !max) {
            max = i;
        } else if (!min && max) {
            if (i < max) {
                min = i;
            } else if (i > max) {
                min = max;
                max = i;
            } else {
                max = 0;
            }
        } else if (min && !max) {
            if (i > min) {
                max= i;
            } else if (i < min) {
                max = min;
                min = i;
            } else {
                min = 0;
            }
        } else if (min && max) {
            if (i > max) {
                max = i;
            } else if (i < min) {
                min = i;
            } else if (i > min && i < max) {
                if ((max - i) > (i - min)) {
                    min = i;
                } else {
                    max = i;
                }
            } else if (i == min) {
                min = 0;
            } else if (i == max) {
                max = 0;
            }
        }

        this.props.onChangeValue(this.props.label, {min: min, max: max});
    }

    getValue() {
        return (this.props.value);
    }

    renderOption = (i) => {
        const { value, option } = this.props;
        const isActive = ((value &&
                                (((value.min > 0 && value.max > 0) &&
                                (i >= value.min && i <= value.max))
                                ||
                                ((value.min > 0 && i == value.min) ||
                                (value.max > 0 && i == value.max))))
                        ? true : false);
        return (
            <TouchableOpacity
                key={i}
                style={[
                    styles.option, this.props.optionStyle,
                    i === option.min
                        && (styles.option__first, {borderTopLeftRadius:4, borderBottomLeftRadius:4}),
                    i === option.max
                        && (styles.option__last, {borderTopRightRadius:4, borderBottomRightRadius:4}),
                    isActive && styles.option__active,
                ]}
                onPress={() => this.onChangeValue(i)}
            >
                <Text style={[ styles.label, isActive && styles.label__active, this.props.labelStyle]}>{i}</Text>
            </TouchableOpacity>
        );
    }

    renderRange = () => {
        const { option } = this.props;
        var options = [];
        for (var i=option.min; i<=option.max; i++) {
          options.push(this.renderOption(i));
        }
        return options;
    }

    render() {
        return (
            <View style={[styles.root, {flex: 1, borderRadius:4}, this.props.style]}>
            {this.renderRange()}
            </View>
        );
    }
}

export default RangeInput;
