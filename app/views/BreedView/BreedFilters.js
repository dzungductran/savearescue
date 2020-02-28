import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import RangeInput from '../../components/InputToggles/RangeInput';
import Button from '../../components/Button';
import { Actions as BreedActions, breedValues } from '../../data/breedSearch';
import styles, { colors, INPUT_HEIGHT } from './BreedFilters.styles';

const getStateFilters = propFilters => (
    propFilters ? {
        columns: propFilters.columns,
        conditions: propFilters.conditions,
        values: propFilters.values
    } : {
        columns: '*',
        conditions: undefined,
        values: breadValues
    }
);

class BreedFilters extends Component {
    static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
        filters: PropTypes.shape({
            columns: PropTypes.string,     // need location
            conditions: PropTypes.string,  // search term
            values: PropTypes.object
        }),
        doSearch: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            filters: getStateFilters(this.props.filters),
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextFilters = getStateFilters(nextProps);
        if (R.equals(this.state.filters, nextFilters)) {
            this.setState({ filters: nextFilters });
        }
    }

    cancel = () => {
        this.props.navigation.goBack();
    }

    close = () => {
        this.props.doSearch({
            columns: this.state.filters.columns,
            conditions: this.state.filters.conditions,
            values: this.state.filters.values
        });
        this.props.navigation.goBack();
    }

    onChangeValue = (label, value) => {
        var values = {...this.state.filters.values};
        values[label] = value;
        this.setState({ filters: { ...this.state.filters, values } });
    }

    renderRowBar = (label, stateValue) => {
        return (
            <View key={label} style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{textAlign:'right'}}>{`${label}`}</Text>
                </View>
                <View style={{ flex: 3, alignItems: 'flex-start'}}>
                <RangeInput
                    key={label}
                    label={label}
                    style={[styles.field, styles.pill]}
                    isReadOnly={true}
                    optionStyle={styles.optionStyle}
                    option={{min:1, max:10}}
                    value={stateValue}
                    onChangeValue={this.onChangeValue}
                />
                </View>
            </View>
        );
    }

    renderAllRowBars = () => {
        if (__DEV__) { console.log(this.state.filters); }
        var options = [];
        for (label of Object.keys(this.state.filters.values)) {
            options.push(this.renderRowBar(label, this.state.filters.values[label]));
        }
        return options;
    }

    renderBars = () => {
        // popularity = hypo-Allergenic
        // watch_dog = good with other pets
        return (
            <View style={{flex:1, alignItems: 'center', marginTop: 10 }}>
                {this.renderAllRowBars()}
            </View>
        );
    }

    render() {
        return (
            <View style={[styles.mainContainer__noNav]}>
                <View style={styles.topBar}>
                    <Icon iconStyle={{margin:10}} name='close' type='iconicon' activeOpacity={0.4} underlayColor='transparent'
                        onPress={this.cancel} size={30} color={colors.primary} />
                    <Text style={[styles.toolbarTitle, {marginRight: 20, color: colors.primary, paddingTop: 0}]}>FILTERS</Text>
                </View>
                {this.renderBars()}
                <View style={styles.splitActions}>
                    <Button onPress={this.close} title="Search" />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    if (__DEV__) { console.log(state); }
    if (__DEV__) { console.log(props); }
    return {
        filters: state.breedSearch.filters,
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        doSearch: filters => dispatch(BreedActions.searchBreedRequest(filters)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BreedFilters);
