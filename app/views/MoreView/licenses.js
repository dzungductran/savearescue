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
import { web } from '../../api/communications';

export default class LicensesView extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'Licenses',
        drawerIcon: (<Ionicons name="ios-paper" size={24} color={colors.primary} />)
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
                </View>
                <ScrollView contentContainerStyle={styles.scrollWrapper}>
                    <Text style={styles.title}>Open Source Licenses</Text>
                    <View style={styles.line}/>
                    <Text style={styles.blockText}>{`At your_company_name we use open source to built our products. We used open source libaries that have one or more of the following licenses:

`}<Text style={{color: 'blue'}} onPress={() => { web("https://opensource.org/licenses/MIT"); }}>{`MIT License`}</Text>{`

`}<Text style={{color: 'blue'}} onPress={() => { web("https://www.apache.org/licenses/LICENSE-2.0"); }}>{`Apache License`}</Text>{`

`}<Text style={{color: 'blue'}} onPress={() => { web("https://opensource.org/licenses/BSD-2-Clause"); }}>{`BSD License

`}</Text>
                    </Text>
                    <Text style={styles.title}>3rd Party Licenses</Text>
                    <View style={styles.line}/>
                    <Text style={styles.blockText}>{`Beside our own database of services, we also augmented our results with Yelp's search results. We adhere to the following API terms:

`}<Text style={{color: 'blue'}} onPress={() => { web("https://www.yelp.com/developers/api_terms"); }}>{`Yelp Terms of Use`}</Text>{`

For other 3rd party licenses; please visit our site at: `}<Text style={{color: 'blue'}} onPress={() => { web("https://your_company.com/"); }}>{`your_company.com`}</Text>
                    </Text>
                </ScrollView>
            </View>
        );
    }
}
