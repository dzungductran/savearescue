import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Switch,
    Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LabelIconText from '../../components/IconText/LabelIconText';
import styles, { colors, INPUT_HEIGHT } from './styles';
import Button from '../../components/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions as PetActions } from '../../data/petSearch';
import { Actions as ServiceActions } from '../../data/serviceSearch';
import { Actions as ShelterActions } from '../../data/shelterSearch';
import { Actions as GlobalActions } from '../../data/globals';
import ModalSelector from 'react-native-modal-selector';
import { getValue, setValue, deleteAllFavorites, GOOGLE_MAPS, NUM_RESULTS,
    SEARCH_RADIUS, YELP_RESULTS, CAROUSEL, DEFAULT_SETTINGS } from '../../api/settings';

const dataSetR = ['10', '15', '20',
                  '25', '30', '35',
                  '40', '45', '50',
                  '60', '70', '80',
                  '90', '100'];

const dataSetM = ['10', '20', '30',
                  '40', '50', '60',
                  '70', '80','100',
                  '120', '140'];

class SettingsView extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'Settings',
        drawerIcon: (<Ionicons name="ios-settings" size={24} color={colors.primary} />)
    };

    static propTypes = {
        globals: PropTypes.shape({
            location: PropTypes.shape({
                zipCode: PropTypes.string,
                latitude: PropTypes.number,
                longitude: PropTypes.numbers
            }),
            database: PropTypes.shape({
                fileName: PropTypes.string,
                isLoaded: PropTypes.bool
            }),
        }),
        clearFavorites: PropTypes.func.isRequired,
        requeryPet: PropTypes.func.isRequired,
        requeryService: PropTypes.func.isRequired,
        requeryShelter: PropTypes.func.isRequired,
    };

    static defaultProps = {
        globals: {},
    };


    constructor (props) {
        super(props);

        this.state = {
            numResults: DEFAULT_SETTINGS[NUM_RESULTS],
            numMiles: DEFAULT_SETTINGS[SEARCH_RADIUS],
            YelpResults: DEFAULT_SETTINGS[YELP_RESULTS],
            carouselOn: DEFAULT_SETTINGS[CAROUSEL],
            GoogleMaps: DEFAULT_SETTINGS[GOOGLE_MAPS],
        };
    }

    loadInitialResults = async () => {
        const useGoogleMaps = await getValue(GOOGLE_MAPS);
        const useYelp = await getValue(YELP_RESULTS);
        const numItems = await getValue(NUM_RESULTS);
        const searchRadius = await getValue(SEARCH_RADIUS);
        const carousel = await getValue(CAROUSEL);
        this.setState({
            orgYelpResults: useYelp,
            orgNumResults: numItems,
            orgNumMiles: searchRadius,
            numResults: numItems,
            numMiles: searchRadius,
            YelpResults: useYelp,
            carouselOn: carousel,
            GoogleMaps: useGoogleMaps,
        });
    }

    componentWillMount() {
        this.loadInitialResults();
    }

    cancel = () => {
        if (this.state.orgNumResults !== this.state.numResults
            || this.state.orgNumMiles !== this.state.numMiles
            || this.state.orgYelpResults !== this.state.YelpResults) {
            this.props.requeryService();    // requery all results
            this.props.requeryShelter();
            if (this.state.orgNumResults !== this.state.numResults
                || this.state.orgNumMiles !== this.state.numMiles) {
                this.props.requeryPet();
            }
        }
        this.props.navigation.goBack();
    }

    _turnOnYelpResults = (value) => {
       this.setState({YelpResults: value ? '1' : '0'})
       setValue(YELP_RESULTS, value ? '1' : '0');
       if (__DEV__) { console.log('Yelp Results is: ' + value) }
    }

    _turnOnGoogleMaps = (value) => {
       this.setState({GoogleMaps: value ? '1' : '0'})
       setValue(GOOGLE_MAPS, value ? '1' : '0');
       if (__DEV__) { console.log('GoogleMaps is: ' + value) }
    }

    _turnOnCarousel = (value) => {
       this.setState({carouselOn: value ? '1' : '0'})
       setValue(CAROUSEL, value ? '1' : '0');
       if (__DEV__) {  console.log('Carousel is: ' + value) }
       this.props.setAutoplay(value);
    }

    _clearFavorites = () => {
        deleteAllFavorites();
        this.props.clearFavorites();
    }

    render() {
        return (
            <View style={styles.mainContainer__noNav}>
                <View style={styles.topBar}>
                    <Icon iconStyle={{margin:10}} name='close' type='iconicon' activeOpacity={0.4} underlayColor='transparent'
                        onPress={this.cancel} size={30} color={colors.primary} />
                </View>
                <ScrollView contentContainerStyle={styles.scrollWrapper}>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.line}/>
                    <ModalSelector
                        data={dataSetR}
    			        keyExtractor={(item) => item}
    			        labelExtractor={(item) => item}
    			        componentExtractor={(item) => null}
			            selectedKey={this.state.numResults}
			            selectedItemTextStyle={{fontSize: 20, fontWeight: 'bold'}}
                        cancelStyle={{backgroundColor: 'rgba(255,255,255,1.0)'}}
                        optionContainerStyle={{backgroundColor: 'rgba(255,255,255,1.0)'}}
                        onChange={option => {this.setState({ numResults: option}); setValue(NUM_RESULTS, option);} }>
                        <LabelIconText style={styles.picker}
                            title="Number search results" value={this.state.numResults} icon="triangle-down"/>
                    </ModalSelector>
                    <ModalSelector
                        data={dataSetM}
    			        keyExtractor={(item) => item}
    			        labelExtractor={(item) => item}
    			        componentExtractor={(item) => null}
			            selectedKey={this.state.numMiles}
			            selectedItemTextStyle={{fontSize: 20, fontWeight: 'bold'}}
                        cancelStyle={{backgroundColor: 'rgba(255,255,255,1.0)'}}
                        optionContainerStyle={{backgroundColor: 'rgba(255,255,255,1.0)'}}
                        onChange={option => {this.setState({ numMiles: option}); setValue(SEARCH_RADIUS, option);} }>
                        <LabelIconText style={styles.picker}
                            title="Search within miles" value={this.state.numMiles} icon="triangle-down"/>
                    </ModalSelector>
                    <View style={styles.picker}>
                        <Text style={styles.switchLabel}>Include Yelp results</Text>
                        <View style={styles.rightContainer}>
                            <Switch size={INPUT_HEIGHT/2} thumbColor={colors.drkgray} trackColor={{false: colors.grey4, true: colors.primary}}
                                style={{marginRight: 10}}
                                onValueChange = {this._turnOnYelpResults}
                                value = {this.state.YelpResults === '1' ? true : false}/>
                        </View>
                    </View>
                    <View style={styles.picker}>
                        <Text style={styles.switchLabel}>Turn on carousel</Text>
                        <View style={styles.rightContainer}>
                            <Switch size={INPUT_HEIGHT/2} thumbColor={colors.drkgray} trackColor={{false: colors.grey4, true: colors.primary}}
                                style={{marginRight: 10}}
                                onValueChange = {this._turnOnCarousel}
                                value = {this.state.carouselOn === '1' ? true : false}/>
                        </View>
                    </View>
                    { (Platform.OS === 'ios') ?
                    <View style={styles.picker}>
                        <Text style={styles.switchLabel}>Use Google Maps</Text>
                        <View style={styles.rightContainer}>
                            <Switch size={INPUT_HEIGHT/2} thumbColor={colors.drkgray} trackColor={{false: colors.grey4, true: colors.primary}}
                                style={{marginRight: 10}}
                                onValueChange = {this._turnOnGoogleMaps}
                                value = {this.state.GoogleMaps === '1' ? true : false}/>
                        </View>
                    </View> : null }
                    <Button style={styles.button} onPress={() => { this._clearFavorites(); }} title="CLEAR FAVORITES" icon="heart" />
                </ScrollView>
            </View>
        );
    }
}



function mapStateToProps(state, props) {
    return {
        globals: state.globals,
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        clearFavorites: () => dispatch(PetActions.clearFavorites()),
        requeryPet: () => dispatch(PetActions.requeryPet()),
        requeryService: () => dispatch(ServiceActions.requeryService()),
        requeryShelter: () => dispatch(ShelterActions.requeryShelter()),
        setAutoplay: (autoplay) => dispatch(GlobalActions.setAutoplay(autoplay))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
