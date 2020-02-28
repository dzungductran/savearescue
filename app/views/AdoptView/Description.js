import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import { Icon } from 'react-native-elements';
import styles, { colors } from './Description.styles';
import PropTypes from 'prop-types';

export default class Description extends Component {
    constructor (props) {
        super(props);
        this.state = {
            modalVisible: false,
            desc: 'No information'
        };
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    openModal(description) {
        this.setState({desc: description, modalVisible:true});
    }

    closeModal() {
        this.setState({modalVisible:false});
    }


    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    render() {
        return (
            <Modal style={styles.modalContainer} isVisible={this.state.modalVisible}>
                <View style={styles.innerContainer}>
                    <View style={styles.topBar}>
                        <Icon iconStyle={{margin:10}} name='close' type='iconicon' activeOpacity={0.4} underlayColor='transparent'
                            onPress={this.closeModal} size={30} color={colors.primary} />
                    </View>
                    <ScrollView>
                        <Text style={styles.value}>{this.state.desc}</Text>
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}
