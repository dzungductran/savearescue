import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import InputToggles from '../../components/InputToggles';
import Button from '../../components/Button';
import GooglePlacesInput from '../../components/GooglePlacesAutocomplete/GooglePlacesInput';
import DismissKeyboard from '../../components/GooglePlacesAutocomplete/DismissKeyboard';
import { PetSpeciesModel } from '../../data/models/pet';
import { Actions as PetActions } from '../../data/petSearch';
import styles, { colors, STATUS_BAR_HEIGHT, NAV_BAR_HEIGHT } from './PetFilters.styles';
import { breeds_list } from '../../data/breeds_list';
import IconText from '../../components/IconText';
import ModalSelector from 'react-native-modal-selector';

const getStateFilters = propFilters => ({
    location: propFilters.location || '',
    sizes: propFilters.sizes || [],
    ages: propFilters.ages || [],
    sexes: propFilters.sexes || [],
    species: propFilters.species || [],
    breed: propFilters.breed || '',
});

class PetFilters extends Component {
    static propTypes = {
        filters: PropTypes.shape({
            species: PropTypes.arrayOf(PetSpeciesModel),
            location: PropTypes.shape({
                zipCode: PropTypes.string,
                latitude: PropTypes.number,
                longitude: PropTypes.numbers
            }),
            sizes: PropTypes.arrayOf(PropTypes.oneOf([
                'Small', 'Medium', 'Large', 'Extra Large',
            ])),
            ages: PropTypes.arrayOf(PropTypes.oneOf([
                'Baby', 'Young', 'Adult', 'Senior',
            ])),
            sexes: PropTypes.arrayOf(PropTypes.oneOf([
                'Male', 'Female',
            ])),
            breed: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            filters: getStateFilters(this.props.filters),
            breeds: breeds_list[this.props.filters.species],
            breed: 'ALL',
        };

        this.searchBarRef = null;
    }

    componentDidMount() {
        this.searchBarRef.show();
    }

    componentWillReceiveProps(nextProps) {
        const nextFilters = getStateFilters(nextProps);
        if (R.equals(this.state.filters, nextFilters)) {
            this.setState({
                filters: nextFilters,
                breed: nextFilters.species,
                breeds: breeds_list[nextFilters.species]
            });
        }
    }

    onPressSearch = (rowData, zip) => {
        if (__DEV__) { console.log(zip); }
        if (zip && zip.length && this.state.filters.location
                && zip !== this.state.filters.location.zipCode) {
            const lonlat = this.searchBarRef.getLocation();
            this.setState({ filters: { ...this.state.filters,
                location: {
                    zipCode: zip,
                    latitude: lonlat.lat,
                    longitude: lonlat.lng
                }
            }});
        }
    }

    onChangeSize = sizes => this.setState({ filters: { ...this.state.filters, sizes } });
    onChangeAge = ages => this.setState({ filters: { ...this.state.filters, ages } });
    onChangeSex = sexes => this.setState({ filters: { ...this.state.filters, sexes } });
    onChangeSpecies = species => this.setState({ breed: this.state.filters.breed,
                                                 filters: { ...this.state.filters,
                                                            species: species,
                                                            breed: this.state.breed },
                                                 breeds: breeds_list[species]});
    close = () => {
        // Maybe the search is not press
        const lonlat = this.searchBarRef.getLocation();
        const zip = this.searchBarRef.getZipCode();
        let loc = (zip && zip.length)
                ? {
                    zipCode: zip,
                    latitude: lonlat.lat,
                    longitude: lonlat.lng
                } : {
                    zipCode: this.searchBarRef.getAddressText(),
                    latitude: 0,
                    longitude: 0
                };
        this.props.onChange({
            location: loc,
            sizes: this.state.filters.sizes,
            ages: this.state.filters.ages,
            sexes: this.state.filters.sexes,
            species: this.state.filters.species,
            breed: this.state.filters.breed,
        });
        this.props.navigation.goBack();
    }

    cancel = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={[styles.mainContainer__noNav, styles.flushBottom]}>
                <View style={styles.topBar}>
                    <Icon iconStyle={{margin:10}} name='close' type='iconicon' activeOpacity={0.4} underlayColor='transparent'
                        onPress={this.cancel} size={30} color={colors.primary} />
                    <Text style={[styles.toolbarTitle, {marginRight: 20, color: colors.primary, paddingTop: 0}]}>FILTERS</Text>
                </View>
                <GooglePlacesInput ref={(ref) => this.searchBarRef = ref}
                    hideBack={true}
                    animate={false}
                    getDefaultValue={() => this.state.filters.location ? this.state.filters.location.zipCode : ''}
                    topLocation={STATUS_BAR_HEIGHT + NAV_BAR_HEIGHT}
                    onPress={this.onPressSearch}/>
                <Text style={[styles.label,
                    {marginTop: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT,
                     alignItems: 'center',justifyContent: 'center'}]}>SPECIES</Text>
                <InputToggles
                    style={[styles.field, styles.pill]}
                    multiSelect={false}
                    options={['Dog', 'Cat']}
                    value={this.state.filters.species}
                    onChangeValue={this.onChangeSpecies}
                />
                <Text style={styles.label}>BREED</Text>
                <ModalSelector
                    data={this.state.breeds}
                    keyExtractor={(item) => item}
                    labelExtractor={(item) => item}
                    componentExtractor={(item) => null}
                    selectedKey={this.state.filters.breed}
                    selectedItemTextStyle={{fontSize: 20, fontWeight: 'bold'}}
                    cancelStyle={{backgroundColor: 'rgba(255,255,255,1.0)'}}
                    optionContainerStyle={{backgroundColor: 'rgba(255,255,255,1.0)'}}
                    onChange={option => this.setState({ filters: { ...this.state.filters, breed: option } }) }>
                    <IconText style={styles.picker}
                        value={this.state.filters.breed} icon="triangle-down"/>
                </ModalSelector>
                <Text style={styles.label}>SIZE</Text>
                <InputToggles
                    style={[styles.field, styles.pill]}
                    options={['S', 'M', 'L', 'XL']}
                    multiSelect={true}
                    values={['Small', 'Medium', 'Large', 'Extra Large']}
                    value={this.state.filters.sizes}
                    onChangeValue={this.onChangeSize}
                />
                <Text style={styles.label}>AGE</Text>
                <InputToggles
                    style={[styles.field, styles.pill]}
                    options={['Baby', 'Young', 'Adult', 'Senior']}
                    multiSelect={true}
                    value={this.state.filters.ages}
                    onChangeValue={this.onChangeAge}
                />
                <Text style={styles.label}>GENDER</Text>
                <InputToggles
                    style={[styles.field, styles.pill]}
                    options={['Male', 'Female']}
                    multiSelect={true}
                    value={this.state.filters.sexes}
                    onChangeValue={this.onChangeSex}
                />
                <View style={styles.splitActions}>
                    <Button onPress={this.close} title="Search" />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        filters: state.petSearch.filters,
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        onChange: filters => dispatch(PetActions.searchPetRequest(filters)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PetFilters);
