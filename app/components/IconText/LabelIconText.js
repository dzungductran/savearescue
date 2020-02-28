import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import styles, {INPUT_HEIGHT, colors} from './styles';

const LabelIconText = ({ style, onPress, title, value, icon }) => (
    <View style={[styles.root, style]}>
        <TouchableOpacity onPress={onPress} style={styles.content}>
            {title ? <Text style={[styles.title]}>{title}</Text> : null}
            <View style={styles.rightContainer}>
                {value ? <Text style={[styles.value]}>{value}</Text> : null}
                {icon ? <Icon size={INPUT_HEIGHT/2}
                    style={{color: colors.grey2, marginRight: 10, marginLeft: 10, alignSelf: 'flex-end'}} name={icon}/> : null}
            </View>
        </TouchableOpacity>
    </View>
);

LabelIconText.propTypes = {
    style: ViewPropTypes.style,
    onPress: TouchableOpacity.propTypes.onPress,
    title: PropTypes.string,
    icon: PropTypes.string,
    value: PropTypes.string,
};

export default LabelIconText;
