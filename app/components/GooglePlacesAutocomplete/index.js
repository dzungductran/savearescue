import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    TextInput,
    View,
    FlatList,
    ScrollView,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    Platform,
    ActivityIndicator,
    PixelRatio,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { getLocation, getPostalCode } from '../../api/geolocation';
import { showMessage } from 'react-native-messages';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Qs from 'qs';
import debounce from 'lodash.debounce';

const WINDOW = Dimensions.get('window');

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 0 });

const INITIAL_TOP = -(NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT);

const defaultStyles = {
    container: {
        flex: 1,
        position: 'absolute',
        zIndex: 10,
        width: WINDOW.width,
    },
    textInputContainer: {
        backgroundColor: '#FFFFFF',
//        backgroundColor: '#C9C9CE',
        height: NAV_BAR_HEIGHT,
//        borderTopColor: '#7e7e7e',
//        borderBottomColor: '#b5b5b5',
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    textInput: {
        backgroundColor: '#FFFFFF',
//        height: 28,
//        borderRadius: 5,
//        paddingTop: 4.5,
//        paddingBottom: 4.5,
//        paddingLeft: 10,
//        paddingRight: 10,
//        marginTop: 7.5,
//        marginLeft: 8,
//        marginRight: 10,
//        fontSize: 15,
        flex: 1
    },
    icon_wrapper: {
//        position: 'relative',
        zIndex: 2,
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    powered: {},
    listView: {
        backgroundColor: '#FFFFFF',
    },
    row: {
        padding: 13,
        height: 44,
        flexDirection: 'row',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#c8c7cc',
    },
    description: {
        fontWeight: 'bold'
    },
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    androidLoader: {
        marginRight: -15,
    },
};

export default class GooglePlacesAutocomplete extends Component {
    _isMounted = false;
    _results = [];
    _requests = [];

    constructor (props) {
        super(props);
        this.state = {
            text: this.props.getDefaultValue(),
            dataSource: this.buildRowsFromResults([]),
            listViewDisplayed: this.props.listViewDisplayed === 'auto' ? false : this.props.listViewDisplayed,
            show: false,
            top: new Animated.Value(INITIAL_TOP),
            location: undefined,
            zipCode: null,
        }
    }

    show = () => {
        const { animate, animationDuration, clearOnShow, topLocation } = this.props;
        if (clearOnShow) {
            this.setState({ text: '' });
        }
        this.setState({ show: true });
        if (animate) {
            Animated.timing(this.state.top, {
                toValue: topLocation,
                duration: animationDuration
            }).start();
        } else {
            this.setState({ top: new Animated.Value(topLocation) });
        }
        this.triggerFocus();
    };

    hide = () => {
        const { onHide, animate, animationDuration } = this.props;
        if (onHide) {
            onHide(this.state.input);
        }
        if (animate) {
            Animated.timing(this.state.top, {
                toValue: INITIAL_TOP,
                duration: animationDuration
            }).start();
            const timerId = setTimeout(() => {
                this._doHide();
                clearTimeout(timerId);
            }, animationDuration);
        } else {
            this.setState({ top: new Animated.Value(INITIAL_TOP) });
            this._doHide();
        }
    };

    _doHide = () => {
        const { clearOnHide } = this.props;
        this.setState({ show: false });
        if (clearOnHide) {
            this.setState({ text: '' });
        }
    };

    setAddressText = address => this.setState({ text: address });

    getAddressText = () => this.state.text;

    getZipCode = () => this.state.zipCode;

    getLocation = () => this.state.location;

    buildRowsFromResults = (results) => {
        let res = [];

        if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
            res = [...this.props.predefinedPlaces];

            if (this.props.currentLocation === true) {
                res.unshift({
                    description: this.props.currentLocationLabel,
                    isCurrentLocation: true,
                });
            }
        }

        res = res.map(place => ({
            ...place,
            isPredefinedPlace: true
        }));

        return [...res, ...results];
    }

    componentWillMount() {
        this._request = this.props.debounce
        ? debounce(this._request, this.props.debounce)
        : this._request;
    }

    componentDidMount() {
        // This will load the default value's search results after the view has
        // been rendered
        this._onChangeText(this.state.text);
        this._isMounted = true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.listViewDisplayed !== 'auto') {
            this.setState({
                listViewDisplayed: nextProps.listViewDisplayed,
            });
        }

        if(typeof(nextProps.text) !== "undefined" && this.state.text !== nextProps.text) {
            this.setState({
                listViewDisplayed:true
            }, this._handleChangeText(nextProps.text));
        }
    }

    componentWillUnmount() {
        this._abortRequests();
        this._isMounted = false;
    }

    _abortRequests = () => {
        this._requests.map(i => i.abort());
        this._requests = [];
    }

    /**
    * This method is exposed to parent components to focus on textInput manually.
    * @public
    */
    triggerFocus = () => {
        if (this.textInput) {
            if (__DEV__) { console.log("focus on textInput"); }
            this.textInput.focus();
        }
    }

    /**
    * This method is exposed to parent components to blur textInput manually.
    * @public
    */
    triggerBlur = () => {
        if (this.textInput) this.textInput.blur();
    }

    getCurrentLocation = () => {
        let options = {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 1000
        };

        if (this.props.enableHighAccuracyLocation && Platform.OS === 'android') {
            options = {
                enableHighAccuracy: true,
                timeout: 20000
            }
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (this.props.nearbyPlacesAPI === 'None') {
                    let currentLocation = {
                        description: this.props.currentLocationLabel,
                        geometry: {
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        }
                    };

                    this._disableRowLoaders();
                    this.props.onPress(currentLocation, currentLocation);
                } else {
                    this._requestNearby(null, position.coords.latitude, position.coords.longitude);
                }
            },
            (error) => {
                this._disableRowLoaders();
                alert(error.message);
            },
            options
        );
    }

    _handleSubmitEditing = () => {
        // Return the first item.
        if (__DEV__) { console.log('_handleSubmitEditing'); console.log(this.state.text)}
        if (this.state.dataSource && this.state.dataSource.length) {
            if (__DEV__) { console.log(this.state.dataSource[0]) }
            this._onPress(this.state.dataSource[0]);
        }

        const onSubmitEditing = this.props
        && this.props.textInputProps
        && this.props.textInputProps.onSubmitEditing;

        if (onSubmitEditing) {
            if (__DEV__) { console.log('onSubmitEditing') }
            onSubmitEditing();
        }
    }

    _onPress = (rowData) => {
        if (rowData.isPredefinedPlace !== true && this.props.fetchDetails === true) {
            if (rowData.isLoading === true) {
                // already requesting
                return;
            }

            this._abortRequests();

            // display loader
            this._enableRowLoader(rowData);

            // fetch details
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) return;

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    if (responseJSON.status === 'OK') {
                        if (this._isMounted === true) {
                            const details = responseJSON.result;
                            this._disableRowLoaders();
                            this._onBlur();

                            this.setState({
                                text: this._renderDescription( rowData ),
                                location: details.geometry.location,
                                zipCode: this._renderPostalCode( details, this.props.filterReverseGeocodingByTypes)
                            });

                            if (this.state.zipCode !== null) {
                                delete rowData.isLoading;
                                this.props.onPress(rowData, this.state.zipCode);
                            } else {
                                this._onPressNeedsPostalCode(rowData, details.geometry.location.lat, details.geometry.location.lng);
                            }
                        }
                    } else {
                        this._disableRowLoaders();

                        if (this.props.autoFillOnNotFound) {
                            this.setState({
                                text: this._renderDescription(rowData)
                            });
                            delete rowData.isLoading;
                        }

                        if (!this.props.onNotFound) {
                            showMessage('Network issues 1 - google places autocomplete: ' + responseJSON.status, {duration: 2000});
                        } else {
                            this.props.onNotFound(responseJSON);
                        }
                    }
                } else {
                    this._disableRowLoaders();

                    if (!this.props.onFail) {
                        showMessage('Network issues 2 - google places autocomplete: request could not be completed or has been aborted', {duration: 2000});
                    } else {
                        this.props.onFail();
                    }
                }
            };

            request.open('GET', 'https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
                key: this.props.query.key,
                placeid: rowData.place_id,
                language: this.props.query.language,
            }));

            if (this.props.query.origin !== null) {
                request.setRequestHeader('Referer', this.props.query.origin)
            }

            request.send();
        } else if (rowData.isCurrentLocation === true) {
            // display loader
            if (__DEV__) { console.log('isCurrentLocation ' + rowData) }
            this._enableRowLoader(rowData);

            this.setState({
                text: this._renderDescription( rowData ),
            });

            this.triggerBlur(); // hide keyboard but not the results
            delete rowData.isLoading;
            this.getCurrentLocation();

        } else {
            this.setState({
                text: this._renderDescription( rowData ),
            });

            this._onBlur();
            delete rowData.isLoading;
            let predefinedPlace = this._getPredefinedPlace(rowData);

            // sending predefinedPlace as details for predefined places
            this.props.onPress(predefinedPlace, predefinedPlace);
        }
    }

    _enableRowLoader = (rowData) => {
        let rows = this.buildRowsFromResults(this._results);
        for (let i = 0; i < rows.length; i++) {
            if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
                rows[i].isLoading = true;
                this.setState({
                    dataSource: rows,
                });
                break;
            }
        }
    }

    _disableRowLoaders = () => {
        if (this._isMounted === true) {
            for (let i = 0; i < this._results.length; i++) {
                if (this._results[i].isLoading === true) {
                    this._results[i].isLoading = false;
                }
            }

            this.setState({
                dataSource: this.buildRowsFromResults(this._results),
            });
        }
    }

    _getPredefinedPlace = (rowData) => {
        if (rowData.isPredefinedPlace !== true) {
            return rowData;
        }

        for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
            if (this.props.predefinedPlaces[i].description === rowData.description) {
                return this.props.predefinedPlaces[i];
            }
        }

        return rowData;
    }

    _filterResultsByTypes = (responseJSON, types) => {
        if (types.length === 0) return responseJSON.results;

        var results = [];
        for (let i = 0; i < responseJSON.results.length; i++) {
            let found = false;

            for (let j = 0; j < types.length; j++) {
                if (responseJSON.results[i].types.indexOf(types[j]) !== -1) {
                    found = true;
                    break;
                }
            }

            if (found === true) {
                results.push(responseJSON.results[i]);
            }
        }
        return results;
    }

    _requestNearby = (address, latitude = null, longitude = null, update = false) => {
        this._abortRequests();

        if (__DEV__) { console.log(address, latitude, longitude); }
        if ((address !== undefined && address !== null)
        || (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null)) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    this._disableRowLoaders();

                    if (typeof responseJSON.results !== 'undefined') {
                        if (this._isMounted === true) {
                            var results = [];
                            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                                results = this._filterResultsByTypes(responseJSON, this.props.filterReverseGeocodingByTypes);
                            } else {
                                results = responseJSON.results;
                            }
                            if (__DEV__) { console.log(results); }
                            let rows = this.buildRowsFromResults(results);
                            this.setState({
                                dataSource: rows
                            });
                            // Update text field
                            if (update && rows && rows.length) {
                                let rowData = rows[0];
                                this.setState({
                                    text: this._renderDescription( rowData ),
                                    location: rowData.geometry.location,
                                    zipCode: rowData.address_components[0].long_name
                                });
                                if (__DEV__) { console.log( rows[0]) }
                            }
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        showMessage('Network issues 3 - google places autocomplete: ' + responseJSON.error_message, {duration: 2000});
                    }
                } else {
                    //showMessage('Network issues 4 - google places autocomplete: request could not be completed or has been aborted', {duration: 2000});
                }
            };

            let url = '';
            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                // your key must be allowed to use Google Maps Geocoding API
                if (address !== undefined && address !== null) {
                    url = 'https://maps.googleapis.com/maps/api/geocode/json?' + Qs.stringify({
                        address: address,
                        key: this.props.query.key,
                        ...this.props.GoogleReverseGeocodingQuery,
                    });
                }
                else if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
                    url = 'https://maps.googleapis.com/maps/api/geocode/json?' + Qs.stringify({
                        latlng: latitude + ',' + longitude,
                        key: this.props.query.key,
                        ...this.props.GoogleReverseGeocodingQuery,
                    });
                }
            } else {
                url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + Qs.stringify({
                    location: latitude + ',' + longitude,
                    key: this.props.query.key,
                    ...this.props.GooglePlacesSearchQuery,
                });
            }
            if (__DEV__) { console.log(url); }

            request.open('GET', url);
            if (this.props.query.origin !== null) {
                request.setRequestHeader('Referer', this.props.query.origin)
            }

            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),
            });
        }
    }

    _onPressNeedsPostalCode = (rowData, latitude, longitude) => {
        this._abortRequests();

        if (__DEV__) { console.log(rowData, latitude, longitude); }
        if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    if (typeof responseJSON.results !== 'undefined') {
                        if (this._isMounted === true) {
                            var results = [];
                            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                                results = this._filterResultsByTypes(responseJSON, this.props.filterReverseGeocodingByTypes);
                            } else {
                                results = responseJSON.results;
                            }
                            if (__DEV__) { console.log(results); }
                            delete rowData.isLoading;
                            if (results !== undefined && results !== null && results.length) {
                                this.setState({
                                    zipCode: this._renderPostalCode(results[0], this.props.filterReverseGeocodingByTypes)
                                });
                                this.props.onPress(rowData, this.state.zipCode);
                            }
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        showMessage('Network issues 5 - google places autocomplete: ' + responseJSON.error_message, {duration: 2000});
                        delete rowData.isLoading;
                        this.props.onNotFound(responseJSON);
                    }
                } else {
                    showMessage('Network issues 6 - google places autocomplete: request could not be completed or has been aborted ' + request.status, {duration: 2000});
                }
            };

            let url = '';
            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                // your key must be allowed to use Google Maps Geocoding API
                url = 'https://maps.googleapis.com/maps/api/geocode/json?' + Qs.stringify({
                    latlng: latitude + ',' + longitude,
                    key: this.props.query.key,
                    ...this.props.GoogleReverseGeocodingQuery,
                });
            } else {
                url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + Qs.stringify({
                    location: latitude + ',' + longitude,
                    key: this.props.query.key,
                    ...this.props.GooglePlacesSearchQuery,
                });
            }
            if (__DEV__) { console.log(url); }

            request.open('GET', url);
            if (this.props.query.origin !== null) {
                request.setRequestHeader('Referer', this.props.query.origin)
            }

            request.send();
        } else {
            delete rowData.isLoading;
            showMessage('Network issues 7 - Invalid request without latitude and/or longitude', {duration: 2000});
        }
    }

    _request = (text) => {
        this._abortRequests();
        if (text && text.length >= this.props.minLength) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);
                    if (typeof responseJSON.predictions !== 'undefined') {
                        if (this._isMounted === true) {
                            this._results = responseJSON.predictions;
                            this.setState({
                                dataSource: this.buildRowsFromResults(responseJSON.predictions),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        showMessage('Network issues 8 - google places autocomplete: ' + responseJSON.error_message, {duration: 2000});
                    }
                } else {
                    //showMessage('Network issues 9 - google places autocomplete: request could not be completed or has been aborted', {duration: 2000});
                }
            };
            request.open('GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=' + encodeURIComponent(text) + '&' + Qs.stringify(this.props.query));
            if (this.props.query.origin !== null) {
                request.setRequestHeader('Referer', this.props.query.origin)
            }

            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),
            });
        }
    }

    _onChangeText = (text) => {
        if (__DEV__) { console.log(text); }
        if (text && text.length === 5) {
            this._requestNearby(text);
        } else {
            this._request(text);
        }

        this.setState({
            text: text,
            listViewDisplayed: this._isMounted || this.props.autoFocus,
        });
    }

    _handleChangeText = (text) => {
        this._onChangeText(text);

        const onChangeText = this.props
        && this.props.textInputProps
        && this.props.textInputProps.onChangeText;

        if (onChangeText) {
            onChangeText(text);
        }
    }

    _getRowLoader() {
        return (
            <ActivityIndicator
            animating={true}
            size="small"
            />
        );
    }

    // Render each row data for matching results
    _renderRowData = (rowData) => {
        if (this.props.renderRow) {
            if (__DEV__) { console.log('this.prop.renderRow'); console.log(rowData) }
            return this.props.renderRow(rowData);
        }

        if (__DEV__) { console.log('_renderRowData'); console.log(rowData) }
        return (
            <Text style={[{flex: 1}, this.props.suppressDefaultStyles ? {} : defaultStyles.description, this.props.styles.description, rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
            numberOfLines={1}
            >
            {this._renderDescription(rowData)}
            </Text>
        );
    }

    _renderDescription = (rowData) => {
        if (this.props.renderDescription) {
            return this.props.renderDescription(rowData);
        }

        return rowData.description || rowData.formatted_address || rowData.name;
    }

    _renderPostalCode = (details, types) => {
        if (__DEV__) {
            console.log(details, types);
            console.log(details.address_components);
            console.log(details.address_components.length);
        }
        for (let i = 0; i < details.address_components.length; i++) {
            let found = false;
            if (__DEV__) {
                console.log(types.length);
                console.log(details.address_components[i]);
            }
            for (let j = 0; j < types.length; j++) {
                if (details.address_components[i].types.indexOf(types[j]) !== -1) {
                    found = true;
                    break;
                }
            }

            if (found === true) {
                return details.address_components[i].long_name;
            }
        }

        return null;
    }

    _renderLoader = (rowData) => {
        if (rowData.isLoading === true) {
            return (
                <View style={[this.props.suppressDefaultStyles ? {} : defaultStyles.loader, this.props.styles.loader]}>
                {this._getRowLoader()}
                </View>
            );
        }

        return null;
    }

    _renderRow = (rowData = {}, sectionID, rowID) => {
        return (
            <ScrollView
                style={{ flex: 1 }}
                scrollEnabled={this.props.isRowScrollable}
                keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <TouchableHighlight
                    style={{ width: WINDOW.width }}
                    onPress={() => this._onPress(rowData)}
                    underlayColor={this.props.listUnderlayColor || "#c8c7cc"}
                >
                    <View style={[this.props.suppressDefaultStyles ? {} : defaultStyles.row, this.props.styles.row, rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}]}>
                        {this._renderRowData(rowData)}
                        {this._renderLoader(rowData)}
                    </View>
                </TouchableHighlight>
            </ScrollView>
        );
    }

    _renderSeparator = (sectionID, rowID) => {
        if (rowID == this.state.dataSource.length - 1) {
            return null
        }

        return (
            <View
            key={ `${sectionID}-${rowID}` }
            style={[this.props.suppressDefaultStyles ? {} : defaultStyles.separator, this.props.styles.separator]} />
        );
    }

    _onBlur = () => {
        this.triggerBlur();

        this.setState({
            listViewDisplayed: false
        });
    }

    _onFocus = () => this.setState({ listViewDisplayed: true })

    _renderPoweredLogo = () => {
        if (!this._shouldShowPoweredLogo()) {
            return null
        }

        return (
            <View
                style={[this.props.suppressDefaultStyles ? {} : defaultStyles.row, defaultStyles.poweredContainer, this.props.styles.poweredContainer]}
            >
                <Image
                    style={[this.props.suppressDefaultStyles ? {} : defaultStyles.powered, this.props.styles.powered]}
                    resizeMode={Image.resizeMode.contain}
                    source={require('../../assets/powered_by_google_on_white.png')}
                />
            </View>
        );
    }

    _shouldShowPoweredLogo = () => {
        if (!this.props.enablePoweredByContainer || this.state.dataSource.length == 0) {
            return false
        }

        for (let i = 0; i < this.state.dataSource.length; i++) {
            let row = this.state.dataSource[i];

            if (!row.hasOwnProperty('isCurrentLocation') && !row.hasOwnProperty('isPredefinedPlace')) {
                return true
            }
        }

        return false
    }

    _renderLeftButton = () => {
        if (this.props.renderLeftButton) {
            return this.props.renderLeftButton()
        } else if (!this.props.hideBack) {
            return (
                <TouchableOpacity
                    accessible={true}
                    accessibilityComponentType="button"
                    onPress={this.props.onBack || this.hide}>
                    <Icon
                        name="arrow-back"
                        size={this.props.backCloseSize}
                        style={{
                            color: this.props.iconColor,
                            marginTop: this.props.heightAdjust / 2 + 10,
                            marginBottom: this.props.heightAdjust / 2 + 10,
                            marginLeft: this.props.heightAdjust / 2 + 10,
                            marginRight: this.props.heightAdjust / 2 + 5
                        }}
                    />
                </TouchableOpacity>
            );
        }
    }

    _useLocation = async () => {

        try {
            const {zipCode, latitude, longitude}  = await getLocation();
            if (__DEV__) { console.log(zipCode, latitude, longitude); }
            await this._requestNearby(zipCode, latitude, longitude, true);
            this.triggerFocus();
        }
        catch (error) {
            if (__DEV__) { console.log(error); }
            let nl = Platform.OS === 'ios' ? '\n' : '';
            showMessage(nl + error.message + '\nPlease go to Settings and turn on location', {duration: 3000});
        }
    }

    _renderLocationButton = () => {
         if (!this.props.hideLocation) {
            return (
                <TouchableOpacity onPress={this._useLocation} style={defaultStyles.icon_wrapper}>
                 <Icon style={this.props.hideBack ? {marginTop: this.props.heightAdjust / 2 + 10,
                                                    marginBottom: this.props.heightAdjust / 2 + 10,
                                                    marginLeft: this.props.heightAdjust / 2 + 10,
                                                    marginRight: this.props.heightAdjust / 2 + 10
                                                } : {marginTop: this.props.heightAdjust / 2 + 10,
                                                    marginBottom: this.props.heightAdjust / 2 + 10,
                                                    marginLeft: this.props.heightAdjust / 2 + 5,
                                                    marginRight: this.props.heightAdjust / 2 + 10
                                                }}
                        name="location-searching" size={20} color="rgba(0, 0, 0, 0.6)" />
                </TouchableOpacity>
            );
        }
    }

    _renderRightButton = () => {
        if (this.props.renderRightButton) {
            return this.props.renderRightButton()
        }
    }

    _getFlatList = () => {
        const keyGenerator = () => (
            Math.random().toString(36).substr(2, 10)
        );

        if ((this.state.text !== '' || this.props.predefinedPlaces.length
        || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
            if (__DEV__) { console.log('render FlatList'); console.log(this.state.dataSource); }
            return (
                <FlatList
                style={[this.props.suppressDefaultStyles ? {} : defaultStyles.listView, this.props.styles.listView]}
                data={this.state.dataSource}
                keyExtractor={keyGenerator}
                extraData={[this.state.dataSource, this.props]}
                ItemSeparatorComponent={this._renderSeparator}
                renderItem={({ item }) => this._renderRow(item)}
                removeClippedSubviews={false}
                {...this.props}
                />
            );
        }

        return null;
    }

    render() {
        let {
            onFocus,
            ...userProps
        } = this.props.textInputProps;
        return (
            <Animated.View
                style={[this.props.suppressDefaultStyles ? {} : defaultStyles.container, this.props.styles.container, {
                    top: this.state.top
                }]}
                pointerEvents="box-none"
            >
                {this.state.show && !this.props.textInputHide &&
                    <View
                        style={[this.props.suppressDefaultStyles ? {} : defaultStyles.textInputContainer, this.props.styles.textInputContainer]}
                    >
                        {this._renderLeftButton()}
                        {this._renderLocationButton()}
                        <TextInput
                            ref={ref => (this.textInput = ref)}
                            onLayout={() => this.props.focusOnLayout && this.textInput.focus()}
                            style={[this.props.suppressDefaultStyles ? {} : defaultStyles.textInput, this.props.styles.textInput]}
                            value={this.state.text}
                            placeholder={this.props.placeholder}
                            allowFontScaling={false}
                            placeholderTextColor={this.props.placeholderTextColor}
                            clearButtonMode="while-editing"
                            underlineColorAndroid={this.props.underlineColorAndroid}
                            { ...userProps }
                            onChangeText={this._handleChangeText}
                            onSubmitEditing={this._handleSubmitEditing}
                        />
                        {this._renderRightButton()}
                    </View>
                }
                {this.state.show && this._getFlatList()}
                {this.state.show && this.props.children}
            </Animated.View>
        );
    }
}

GooglePlacesAutocomplete.propTypes = {
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    underlineColorAndroid: PropTypes.string,
    returnKeyType: PropTypes.string,
    onHide: PropTypes.func,
    onPress: PropTypes.func,
    onNotFound: PropTypes.func,
    onFail: PropTypes.func,
    minLength: PropTypes.number,
    fetchDetails: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoFillOnNotFound: PropTypes.bool,
    getDefaultValue: PropTypes.func,
    timeout: PropTypes.number,
    onTimeout: PropTypes.func,
    query: PropTypes.object,
    GoogleReverseGeocodingQuery: PropTypes.object,
    GooglePlacesSearchQuery: PropTypes.object,
    styles: PropTypes.object,
    textInputProps: PropTypes.object,
    enablePoweredByContainer: PropTypes.bool,
    predefinedPlaces: PropTypes.array,
    currentLocation: PropTypes.bool,
    currentLocationLabel: PropTypes.string,
    nearbyPlacesAPI: PropTypes.string,
    enableHighAccuracyLocation: PropTypes.bool,
    filterReverseGeocodingByTypes: PropTypes.array,
    predefinedPlacesAlwaysVisible: PropTypes.bool,
    enableEmptySections: PropTypes.bool,
    renderDescription: PropTypes.func,
    renderRow: PropTypes.func,
    renderLeftButton: PropTypes.func,
    renderRightButton: PropTypes.func,
    listUnderlayColor: PropTypes.string,
    debounce: PropTypes.number,
    isRowScrollable: PropTypes.bool,
    text: PropTypes.string,
    textInputHide: PropTypes.bool,
    suppressDefaultStyles: PropTypes.bool,
    animate: PropTypes.bool,
    animationDuration: PropTypes.number,
    hideBack: PropTypes.bool,
    clearOnShow: PropTypes.bool,
    onBack: PropTypes.func,
    backCloseSize: PropTypes.number,
    heightAdjust: PropTypes.number,
    iconColor: PropTypes.string,
    hideLocation: PropTypes.bool,
    returnOnSelect: PropTypes.bool,
    focusOnLayout: PropTypes.bool,
    topLocation: PropTypes.number,
}
GooglePlacesAutocomplete.defaultProps = {
    placeholder: 'Search',
    placeholderTextColor: '#A8A8A8',
    isRowScrollable: true,
    underlineColorAndroid: 'transparent',
    returnKeyType: 'default',
    onPress: () => {},
    onNotFound: () => {},
    onFail: () => {},
    minLength: 0,
    fetchDetails: false,
    autoFocus: false,
    autoFillOnNotFound: false,
    keyboardShouldPersistTaps: 'always',
    getDefaultValue: () => '',
    timeout: 20000,
    onTimeout: () => showMessage('Network issues 10 - google places autocomplete: request timeout', {duration: 2000}),
    query: {
        key: 'missing api key',
        language: 'en',
        types: 'geocode',
    },
    GoogleReverseGeocodingQuery: {},
    GooglePlacesSearchQuery: {
        rankby: 'distance',
        types: 'food',
    },
    styles: {},
    textInputProps: {},
    enablePoweredByContainer: true,
    predefinedPlaces: [],
    currentLocation: false,
    currentLocationLabel: 'Current location',
    nearbyPlacesAPI: 'GoogleReverseGeocoding',
    enableHighAccuracyLocation: true,
    filterReverseGeocodingByTypes: ['postal_code'],    // hope this is just city, state
    predefinedPlacesAlwaysVisible: false,
    enableEmptySections: true,
    listViewDisplayed: 'auto',
    debounce: 0,
    textInputHide: false,
    suppressDefaultStyles: false,
    animate: true,
    animationDuration: 200,
    clearOnShow: true,
    backCloseSize: 24,
    hideBack: false,
    heightAdjust: 0,
    iconColor: 'gray',
    hideLocation: false,
    returnOnSelect: false,
    focusOnLayout: true,
    topLocation: STATUS_BAR_HEIGHT,
}

// this function is still present in the library to be retrocompatible with version < 1.1.0
const create = function create(options = {}) {
    return React.createClass({
        render() {
            return (
                <GooglePlacesAutocomplete
                ref="GooglePlacesAutocomplete"
                {...options}
                />
            );
        },
    });
};

module.exports = {
    GooglePlacesAutocomplete,
    create
};
