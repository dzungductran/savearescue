import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Switch
} from 'react-native';
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LabelIconText from '../../components/IconText/LabelIconText';
import styles, { colors, INPUT_HEIGHT } from './styles';
import { sendEmail } from '../../api/communications';

export default class VolunteerView extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'Volunteer Information',
        drawerIcon: (<Ionicons name="ios-people" size={24} color={colors.primary} />)
    };

    cancel = () => {
        this.props.navigation.goBack();
    }

    linkEmail = () => {
        let addr = "info@your_company.com";
        sendEmail(addr.split(), undefined, undefined,
                  "Request for volunteer information",
                  "I am interested in volunteering. I would like more information");
    }

    render() {
        return (
            <View style={styles.mainContainer__noNav}>
                <View style={styles.topBar}>
                    <Icon iconStyle={{margin:10}} name='close' type='iconicon' activeOpacity={0.4} underlayColor='transparent'
                        onPress={this.cancel} size={30} color={colors.primary} />
                </View>
                <ScrollView contentContainerStyle={styles.scrollWrapper}>
                    <Text style={styles.title}>Volunteer Information</Text>
                    <View style={styles.line}/>
                    <Text style={styles.blockText}>{`Email us at: `}<Text style={{color: 'blue'}} onPress={() => { this.linkEmail(); }}
                    >{`info@your_company.com`}</Text>{` ~ We'd love you to Join "Our Team".

Your_company_name provides massive information for any Dog or Cat owner or lover.  We are all unpaid Volunteers and work virally throughout the United States & Canada to bring pet lovers all the information and listings of adoptables, Rescues & shelters everywhere.  We are always in need of good Volunteers to add to "Our Team".  Its easy, fun and every new database entry helps us save more Dogs and Cats in need every day.  With our Toll Free "Hotline" we rely on our database to find immediate resources, aid and support for any Dog or Cat in a life-threatening, displacement situation, and your willingness to help us Be more, Do more and Save more is invaluable.  Please do not hesitate to email us at:`}
<Text style={{color: 'blue'}} onPress={() => { this.linkEmail(); }}
>{`info@your_company.com`}</Text>{` for more information.
Contact info here
"We make ourselves available for you"`}</Text>
                </ScrollView>
            </View>
        );
    }
}
