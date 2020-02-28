import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SideButton = ({ title, iconName }) => (
    <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent: 'center'}}>
        <Ionicons name={iconName} size={30} color={'white'} />
        <Text style={styles.textButton}>{title}</Text>
    </View>
);

SideButton.propTypes = {
    iconName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default SideButton;
