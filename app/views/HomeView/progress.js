import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Modal from "react-native-modal";
import styles, { colors, progressWidth } from './styles';
import ProgressBar from 'react-native-progress/Bar';

export default class Progress extends Component {
    static propTypes = {
        percentage: PropTypes.number.isRequired
    };

    static defaultProps = {
        percentage: 0
    };

    constructor (props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    openModal() {
        this.setState({modalVisible:true});
    }

    closeModal() {
        this.setState({modalVisible:false});
    }


    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    render() {
        return (
            <Modal isVisible={this.state.modalVisible}>
                <View style={styles.innerContainer}>
                    <Text style={styles.text}>{'Downloading Database: '}{this.props.percentage}{'%'}</Text>
                    <ProgressBar progress={this.props.percentage*.01} width={progressWidth} />
                </View>
            </Modal>
        );
    }
}
