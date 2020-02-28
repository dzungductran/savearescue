import React, { Component } from 'react';
import {Text, View, SectionList, TouchableHighlight, Image} from 'react-native';
import { Icon } from 'react-native-elements'
import styles, { colors } from './styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import { Actions as BreedActions } from '../../data/breedSearch';

const getStateFilters = propFilters => (
    propFilters ? {
        columns: propFilters.columns,
        conditions: propFilters.conditions,
        values: propFilters.values
    } : {
        columns: '*',
        conditions: undefined,
        values: {}
    }
);

const getSectionData = (dataBlob, sectionId) => dataBlob[sectionId];
const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];

class BreedView extends Component {
    static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
        // eslint-disable-next-line react/no-unused-prop-types
        results: PropTypes.arrayOf(PropTypes.object),
        filters: PropTypes.shape({
            columns: PropTypes.string,  // need location
            conditions: PropTypes.string,       // search term
            values: PropTypes.object
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
        globals: {},
        results: []
    };

    constructor(props) {
        super(props);

        this.state = {
            filters: getStateFilters(this.props.filters),
        };
    }

    componentWillReceiveProps(nextProps) {
        const nextFilters = getStateFilters(nextProps.filters);
        if (!R.equals(this.state.filters, nextFilters)) {
            this.setState({ filters: nextFilters });
        }
    }

    _loadInitialResults() {
        if (!this.props.results.length) {
            this.props.doSearch(this.state.filters);
        }
    }

    componentWillMount() {
        this._loadInitialResults();
    }

    _selectedRow(rowData) {
        if (__DEV__) { console.log(rowData); }
        this.props.navigation.navigate('BreedProfile', {...rowData});
    }

    _renderItem(rowData) {
        return (
            <TouchableHighlight underlayColor={colors.background2} activeOpacity={0.4}
                onPress={() => { this._selectedRow(rowData) }}>
                <View style={styles.rowContainer}>
                    <Image source={{ uri: rowData.image_url}} style={styles.rowPhoto} />
                    <View style={{flex:1, flexDirection:'column', justifyContent: 'space-between'}}>
                        <Text style={styles.rowText}>{`${rowData.title_id.toUpperCase()}`}</Text>
                        <View style={{flex:1, marginHorizontal:12, flexDirection:'row', justifyContent: 'space-between'}}>
                            <Text style={styles.subText}>W: {`${rowData.weight}`}</Text>
                            <Text style={styles.subText}>H: {`${rowData.height}`}</Text>
                            <Text style={styles.subText}>Y: {`${rowData.life_span}`}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _renderSectionHeader(section) {
        return (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionText}>{section.title}</Text>
            </View>
        );
    }

    _renderSectionSeparator = () => {
       return (
           //Item Separator
           <View style={styles.separator} />
       );
     };

    // If we want Drawer then navigate to "DrawerOpen", instead of "More" which is our
    // modal screen for More stuff
    render() {
        return (
            <View style={styles.mainContainer__full}>
                <View style={styles.toolbar}>
                    <Icon iconStyle={styles.toolbarButton} name='menu' type='iconicon' activeOpacity={0.4}
                        underlayColor='transparent' color={colors.white} onPress={() => this.props.navigation.navigate("DrawerOpen")} />
                    <Text style={styles.toolbarTitle}>BREEDS A-Z</Text>
                    <Icon iconStyle={styles.toolbarButton} name='search' type='iconicon' activeOpacity={0.4}
                        underlayColor='transparent' color={colors.white} onPress={() => this.props.navigation.navigate("BreedFilters")} />
                </View>
                <SectionList
                  style={styles.listContainer}
                  sections={this.props.results}
                  removeClippedSubviews={false}
                  stickySectionHeadersEnabled={true}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item }) => (this._renderItem(item) )}
                  ItemSeparatorComponent={this._renderSectionSeparator}
                  renderSectionHeader={({ section }) => ( this._renderSectionHeader(section) )}
                />
            </View>
        );
    }
}


function mapStateToProps(state, props) {
    if (__DEV__) { console.log(state); }
    return {
        globals: state.globals,
        results: state.breedSearch.breedResults,
        filters: state.breedSearch.filters,
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        // Search will pickup filters from redux store
        doSearch: filters => dispatch(BreedActions.searchBreedRequest(filters)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BreedView);
