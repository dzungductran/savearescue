import React, { Component } from 'react';
import R from 'ramda';
import {Text, TextInput, View, Image, TouchableOpacity, FlatList, Platform} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import {Button, Icon} from 'react-native-elements'
import styles from './styles';
import MapView from "react-native-maps";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import GooglePlacesInput from '../../components/GooglePlacesAutocomplete/GooglePlacesInput';
import DismissKeyboard from '../../components/GooglePlacesAutocomplete/DismissKeyboard';
import { Actions as ServiceActions, getSearchTerm, searchTerms, getSearchKey } from '../../data/serviceSearch';
import { getRegionForCoordinates } from '../../api/geolocation';
import IconText from '../../components/IconText';

import Panel from './Panel';
import { itemHeight, colors } from './Panel.styles';

import BusinessModel from '../../data/models/business';
import RegionModel from '../../data/models/region';

const getStateFilters = propFilters => ({
    location: propFilters.location,
    term: propFilters.term,
    table: propFilters.table
});

const getStateRegion = propRegion => (
    propRegion ? {
        longitudeDelta: propRegion.longitudeDelta,
        latitudeDelta: propRegion.latitudeDelta,
        longitude: propRegion.longitude,
        latitude: propRegion.latitude,
    } : {
        longitudeDelta: undefined,
        latitudeDelta: undefined,
        longitude: undefined,
        latitude: undefined,
    }
);

class PetServices extends Component {
    static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
        results: PropTypes.arrayOf(BusinessModel),
        filters: PropTypes.shape({
            location: PropTypes.shape({
                zipCode: PropTypes.string,
                latitude: PropTypes.number,
                longitude: PropTypes.numbers
            }),
            term: PropTypes.string,      // search term
            table: PropTypes.string
        }),
        globals: PropTypes.shape({
            location: PropTypes.shape({
                zipCode: PropTypes.string,
                latitude: PropTypes.number,
                longitude: PropTypes.numbers
            }),
        }),
        doSearch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        results: [],
        globals: {}
    };

    constructor (props) {
        super(props);
        this.state = {
            filters: getStateFilters(this.props.filters),
            region: getStateRegion(this.props.region),
            slider1ActiveSlide: undefined,
            PickerValueHolder: getSearchTerm(this.props.filters.term),
            close: (new Map(): Map<string, boolean>),
        };
        if (__DEV__) { console.log(this.state); }

        this.markRef = (new Map(): Map<string, Object>);
        this.slider1Ref = null;
        this.mapRef = null;
        this.searchBarRef = null;
        this.listActiveSwipeOut = null;
        // keep state while we animating to fix iOS bug when
        // showCallOut aslo call onPress/onSelect
        this.animating = false;
        this.dataSetS = Object.keys(searchTerms).map(this._keyValue);
        if (__DEV__) { console.log(this.dataSetS); }
    }

    componentWillReceiveProps(nextProps) {
        const nextFilters = getStateFilters(nextProps.filters);
        if (!R.equals(this.state.filters, nextFilters)) {
            if (__DEV__) { console.log('PetServices set filters'); console.log(nextFilters) }
            this.setState({ filters: nextFilters });
        }
        const nextRegion = getStateRegion(nextProps.region);
        if (!R.equals(this.state.region, nextRegion)) {
            this.setState({ region: nextRegion });
        }
    }

    _keyValue(value) {
        return ({ key: value, label: getSearchTerm(value) });
    }

    _loadInitialResults = () => {
        if (!this.props.results.length) {
            //Only need location for shelter search
            //this.props.doSearch(this.state.filters);
            this.props.doSearch({...this.state.filters,
                location: this.state.filters.location || this.props.globals.location
            });
        }
    }

    componentWillMount() {
        this._loadInitialResults();
    }

    // Hack: Delayed the scrollToIndex so that the list get a chance to render the items first
    _scrollToIndexDelayed = index => {
        if (this.slider1Ref) {
            setTimeout(() => {
                this.slider1Ref.scrollToIndex({animated: false, index: index});
            }, 500)
        }
    }

    _animateToRegion = (id, index) => {
        const { coordinate } = this.props.results[index];
        this.animating = true;  // Hack for iOS when showCallout aslo call onSelect/onPress
        this.mapRef.animateToRegion(
            {
                ...coordinate,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta,
            },
            350
        );
        this.markRef.get(id).showCallout();
    }

    handleItemSlected = (id, index) => {
        if (__DEV__) { console.log('item selected: ' + id + ' index ' + index); }
        // updater functions are preferred for transactional updates
        if (this.state.slider1ActiveSlide && this.state.slider1ActiveSlide !== id) {
            this.setState((state) => {
                const close = (new Map(): Map<string, boolean>);
                close.set(state.slider1ActiveSlide, true);
                return { close };
            });
        }

        this.setState({slider1ActiveSlide: id});
        this._animateToRegion(id, index);
    };

    renderItem = ({item, index}) => {
        return (
            <Panel
                id={item.id}
                index={index}
                data={item}
                close={!!this.state.close.get(item.id)}
                longitude={this.props.globals.location.longitude}
                latitude={this.props.globals.location.latitude}
                onPressItem={this.handleItemSlected}
            />
        )
    };

    _onMarkerPress = (id, index, direction) => {
        if (__DEV__) { console.log('map item clicked: ' + id + ' index ' + index + ' ' + direction); }
        if (!this.animating || Platform.OS === 'android') {
            this.slider1Ref.scrollToIndex({animated: true, index: index});
        }
        this.animating = false;
    }

    _onRegionChangeComplete = region => {
        if (!R.equals(this.state.region, region)) {
            this.setState({region});
        }
    }

    get mapForServices() {
        if (this.props.results.length) {
            return (
                <MapView
                    ref={(ref) => this.mapRef = ref}
                    region={this.state.region}
                    style={styles.container}
                    showsUserLocation={true}
                    onRegionChangeComplete={this._onRegionChangeComplete}
                >
                    {this.props.results.map((marker, index) => {
                        return (
                            <MapView.Marker
                                ref={(ref) => this.markRef.set(marker.id, ref) }
                                key={marker.id}
                                title={marker.name}
                                onPress={(e) => { if (Platform.OS === 'android') { this._onMarkerPress(marker.id, index, "onPress"); } } }
                                onSelect={(e) => { if (Platform.OS === 'ios') { this._onMarkerPress(marker.id, index, "onSelect"); } } }
                                coordinate={marker.coordinate}
                                image={require('../../assets/icons-marker.png')}>
                            </MapView.Marker>
                        );
                    })}
                </MapView>
            );
        }
        else {
            return (
                <TouchableOpacity
                    style={[styles.startSearch]}
                    onPress={() => this.searchBarRef.show()}
                >
                    <Image style={styles.searchImage} source={require('../../assets/start_search.png')}/>
                </TouchableOpacity>
            );
        }
    }

    handleLoadMore = () => {
        if (__DEV__) { console.log('load more....'); }
    };

    _onScrollBeginDrag = (e) => {
        if (__DEV__) { console.log('onScrollBeginDrag ' + this.state.slider1ActiveSlide); }
        if (this.state.slider1ActiveSlide) {
            this.setState((state) => {
                const close = (new Map(): Map<string, boolean>);
                close.set(this.state.slider1ActiveSlide, true);
                return { close, slider1ActiveSlide: undefined };
            });
        }
    }

    getItemLayout = (data, index) => (
        { length: itemHeight + 1, offset: (itemHeight + 1) * index, index }
    )

    get listForServices () {
        if (this.props.results.length) {
            return (
                <View style={styles.container}>
                    <FlatList
                        vertical
                        ref={(ref) => this.slider1Ref = ref}
                        data={this.props.results}
                        extraData={this.state}
                        keyExtractor={item => item.id}
                        getItemLayout={this.getItemLayout}
                        renderItem={this.renderItem}
                        //snapToAlignment={'center'}
                        // Defines here the interval between to item (basically the height of an item with margins)
                        //snapToInterval={itemHeight+1}
                        // onScrollBeginDrag={this._onScrollBeginDrag}
                        //onEndReachedThreshold={50}
                        ItemSeparatorComponent={ () => <View style={ { flex: 1, height: 1, backgroundColor: colors.drkgray } } /> }
                    />
                </View>
            );
        }
    }

    onPressSearch = (rowData, zip) => {
        this.searchBarRef.hide();
        if (__DEV__) { console.log(zip); console.log(rowData) }
        if ((zip && zip.length && this.state.filters.location)
                && (zip !== this.state.filters.location.zipCode
                || !this.props.results.length)) {  // or we don't have previous results
            const lonlat = this.searchBarRef.getLocation();
            if (__DEV__) { console.log(lonlat) }
            this.props.doSearch({...this.state.filters,
                location: {
                    zipCode: zip,
                    latitude: lonlat.lat,
                    longitude: lonlat.lng
                }
            });
        }
    }

    _onPress = (option) => {
        let value = getSearchKey(option.label);
        this.setState({PickerValueHolder: option.label});
        if (value !== this.state.filters.term) {
            if (__DEV__) { console.log(this.state.filters.term); }
            this.props.doSearch({...this.state.filters, term: value});
        }
    }

    // If we want Drawer then navigate to "DrawerOpen", instead of "More" which is our
    // modal screen for More stuff
    //                      <Picker.Item label="RESCUES & SHELTERS" value="rescues;shelters" />
    //                        <Text style={styles.text}>{this.state.PickerValueHolder}}</Text>
    // <IconText style={styles.picker} styleText={{color:'white'}} styleIcon={{color:'white'}}
    //    value={this.state.PickerValueHolder} icon="triangle-down"/>
    //
    //                         <Text style={styles.pickerText}>{this.state.PickerValueHolder}</Text>
    //                        <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
    render() {
        if (__DEV__) { console.log(this.state.filters.term); }
        return (
            <DismissKeyboard>
            <View style={styles.mainContainer__full}>
                <View style={styles.toolbar}>
                    <Icon iconStyle={styles.toolbarButton} name='menu' type='iconicon' activeOpacity={0.4}
                        underlayColor='transparent' color={colors.white} onPress={() => { this.props.navigation.navigate("DrawerOpen")} }/>
                    <ModalSelector childrenContainerStyle={styles.content}
                        data={this.dataSetS}
                        selectedKey={this.state.filters.term}
                        selectedItemTextStyle={{fontSize: 20, fontWeight: 'bold'}}
                        cancelStyle={{backgroundColor: 'rgba(255,255,255,1.0)'}}
                        optionContainerStyle={{backgroundColor: 'rgba(255,255,255,1.0)'}}
                        onChange={option => this._onPress(option) }>
                        <IconText style={styles.picker} styleText={{color:'white'}} styleIcon={{color:'white'}}
                            value={this.state.PickerValueHolder} icon="triangle-down"/>
                    </ModalSelector>
                    <Icon iconStyle={styles.toolbarButton} name='search' type='iconicon' activeOpacity={0.4}
                        underlayColor='transparent' color={colors.white} onPress={() => { this.searchBarRef.show()}} />
                </View>
                <GooglePlacesInput ref={(ref) => this.searchBarRef = ref}
                iconColor={colors.primary}
                getDefaultValue={() => this.state.filters.location ? this.state.filters.location.zipCode : ''}
                onPress={this.onPressSearch}/>
                { this.mapForServices }
                { this.listForServices }
            </View>
            </DismissKeyboard>
        );
    }
}


function mapStateToProps(state, props) {
    return {
        results: state.serviceSearch.serviceResults,
        region: getRegionForCoordinates(state.serviceSearch.serviceResults),
        filters: state.serviceSearch.filters,
        globals: state.globals,
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        // Search will pickup filters from redux store
        doSearch: filters => dispatch(ServiceActions.searchServiceRequest(filters)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PetServices);
