import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PdfView from '../../components/PdfView';
import styles, { colors} from './styles';

// This points to your privacy policy file
const URL = "https://www.yourcompany.com/privacy_policy.pdf";

export default class PrivacyView extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'Privacy Policy',
        drawerIcon: (<Ionicons name="ios-lock" size={24} color={colors.primary} />)
    };

    cancel = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.mainContainer__noNav}>
                <View style={styles.topBar}>
                    <Icon iconStyle={{margin:10}} name='close' type='iconicon' activeOpacity={0.4} underlayColor='transparent'
                        onPress={this.cancel} size={30} color={colors.primary} />
                    <Text style={[styles.toolbarTitle, {marginRight: 20, color: colors.primary, paddingTop: 0}]}>PRIVACY POLICY</Text>
                </View>
                <PdfView src={URL} tyle={{flex:1}} />
            </View>
        );
    }
}
