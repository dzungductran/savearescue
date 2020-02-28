import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles, {INPUT_HEIGHT} from './styles';

const Button = ({ style, onPress, title, icon }) => (
    <View style={[styles.root, style]} elevation={1}>
        <TouchableOpacity onPress={onPress} style={styles.content}>
            {icon ? <Icon size={INPUT_HEIGHT/2} style={styles.icon} name={icon}/> : null}
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    </View>
);

Button.propTypes = {
    style: ViewPropTypes.style,
    onPress: TouchableOpacity.propTypes.onPress,
    title: PropTypes.string.isRequired,
};

export default Button;
