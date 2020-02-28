import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import InputToggles from '../../components/InputToggles';
import Button from '../../components/Button';
import { Actions as BreedActions } from '../../data/breedSearch';
import styles, { NAV_BAR_HEIGHT, colors, STATUS_BAR_HEIGHT, label_width } from './Profile.styles';
import BackgroundImage from '../../components/BackgroundImage';
import { breedFetch } from '../../api/breedFetch';
import { showMessage } from 'react-native-messages';

export default class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            params: this.props.navigation.state.params,
            error: undefined
        }
    }

    componentWillMount() {
        try {
            this.initData();
        } catch (error) {
            showMessage(error.message, {duration: 2000});
        }
    }

    initData = async() => {
        if (__DEV__) { console.log(this.state.params); }
        const { title_id } = this.state.params;
        const filters = {
            columns: "*",
            conditions: "title_id="+"'"+`${title_id}`+"'"
        };

        const { res, dataBlob } = await breedFetch(filters);
        if (__DEV__) { console.log(dataBlob[0]) }
        this.setState({
            params: dataBlob[0].data[0],
            error: res
        })
    }

    cancel = () => {
        this.props.navigation.goBack();
    }

    renderRowBar = (label, values) => {
        return (
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{textAlign:'right'}}>{`${label}`}</Text>
                </View>
                <View style={{ flex: 2, alignItems: 'flex-start'}}>
                <InputToggles
                    style={styles.field}
                    height={20}
                    isReadOnly={true}
                    optionStyle={{paddingHorizontal: 4, minWidth: 20}}
                    options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                    value={[`${values}`]}
                />
                </View>
            </View>
        );
    }

    renderBars = () => {
        // popularity = hypo-Allergenic
        // watch_dog = good with other pets
        if (__DEV__) { console.log(this.state.params); }
        const { Size, Energy, Intelligence, Trainability, Shedding,
            GoodwithKids, GoodWithPets, GuardDog, HypoAllergenic} = this.state.params;
        return (
            <View style={{ alignItems: 'center', padding: 20 }}>
                {this.renderRowBar("Size", Size)}
                {this.renderRowBar("Energy", Energy)}
                {this.renderRowBar("Intelligence", Intelligence)}
                {this.renderRowBar("Trainability", Trainability)}
                {this.renderRowBar("Hypo-Allergenic", HypoAllergenic)}
                {this.renderRowBar("Shedding", Shedding)}
                {this.renderRowBar("Good with Kids", GoodwithKids)}
                {this.renderRowBar("Good with Pets", GoodWithPets)}
                {this.renderRowBar("Guard Dog", GuardDog)}
            </View>
        );
    }

    renderRowInfo = (label, text) => {
        return (
            <View style={{ flexDirection: 'row', padding: 4 }}>
                <Text style={{textAlign:'right'}}>{`${label}`}:</Text>
                <Text style={{textAlign:'left', paddingLeft: 2}}>{`${text}`}</Text>
            </View>
        );
    }

    renderMoreInfo = () => {
        const { group_, origin, height, weight, life_span } = this.state.params;
        return (
            <View style={{ flex:1, flexDirection: 'column', alignItems: 'center', padding: 4 }}>
                {this.renderRowInfo("Breed Group", group_)}
                {this.renderRowInfo("Origin", origin)}
                {this.renderRowInfo("Ave Height", height)}
                {this.renderRowInfo("Ave Weight", weight)}
                {this.renderRowInfo("Life Span", life_span)}
            </View>
        );
    }

    render() {
        if (__DEV__) { console.log(this.state.params) }
        const { title_id, image_url, description } = this.state.params;
        return (
            <View style={styles.mainContainer__noNav}>
                <View style={styles.topBar}>
                    <Icon iconStyle={{margin:10}} name='close' type='iconicon' activeOpacity={0.4} underlayColor='transparent'
                        onPress={this.cancel} size={30} color={colors.primary} />
                    <Text style={[styles.toolbarTitle, {marginRight: 20, color: colors.primary, paddingTop: 0}]}>
                        {`${title_id.toUpperCase()}`}
                    </Text>
                </View>
                <View style={styles.gallery}>
                    <BackgroundImage style={styles.gallery_image} source={{ uri: image_url }}/>
                    {this.renderMoreInfo()}
                </View>
                {this.renderBars()}
                <ScrollView style={styles.innerContainer}>
                    <Text style={styles.value}>{description}</Text>
                </ScrollView>
            </View>
        );
    }
}
