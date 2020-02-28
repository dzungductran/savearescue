import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PdfView from '../../components/PdfView';
import styles, { colors} from './styles';

// This points to your terms and conditions policy
const URL = "https://www.yourcompany.com/terms_conditions.pdf";

export default class TermsView extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'Terms of Service',
        drawerIcon: (<Ionicons name="ios-clipboard" size={24} color={colors.primary} />)
    };

    cancel = () => {
        this.props.navigation.goBack();
    }

    onLoadEnd = () => {
    }

    render() {
        return (
            <View style={styles.mainContainer__noNav}>
                <View style={styles.topBar}>
                    <Icon iconStyle={{margin:10}} name='close' type='iconicon' activeOpacity={0.4} underlayColor='transparent'
                        onPress={this.cancel} size={30} color={colors.primary} />
                    <Text style={[styles.toolbarTitle, {marginRight: 20, color: colors.primary, paddingTop: 0}]}>TERMS OF SERVICE</Text>
                </View>
                <PdfView src={URL} tyle={{flex:1}} />
            </View>
        );
    }
}
