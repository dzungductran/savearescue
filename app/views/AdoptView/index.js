import R from 'ramda';
import React, { Component } from 'react';
import { View, Text, Platform, Share, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions as PetActions } from '../../data/petSearch';
import {Button, Icon} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './CardFlip.styles';
import CardFlip from './CardFlip';
import styles, { colors } from './styles';
import PetModel, { PetSpeciesModel } from '../../data/models/pet';
import { deleteFavorite, addFavorite } from '../../api/settings';
import { showMessage} from 'react-native-messages';

const getStateFilters = propFilters => ({
    location: propFilters.location,
    sizes: propFilters.sizes || [],
    ages: propFilters.ages || [],
    sexes: propFilters.sexes || [],
    species: propFilters.species || [],
    breed:  propFilters.breed || '',
});

class AdoptView extends Component {
    static propTypes = {
        // eslint-disable-next-line react/no-unused-prop-types
        results: PropTypes.arrayOf(PetModel),
        filters: PropTypes.shape({
            species:  PropTypes.arrayOf(PetSpeciesModel),
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
        globals: PropTypes.shape({
            location: PropTypes.shape({
                zipCode: PropTypes.string,
                latitude: PropTypes.number,
                longitude: PropTypes.numbers
            }),
        }),
        doSearch: PropTypes.func.isRequired,
        favorites: PropTypes.arrayOf(PetModel)
    };

    static defaultProps = {
        results: [],
        favorites: [],
        filters: {},
        globals: {},
    };

    constructor (props) {
        super(props);
        this.state = {
            filters: getStateFilters(this.props.filters),
            error: null,
            fav: false,
            favorites: [],
            results: [],
            favScreen: false,
            firstItem: 0,
            title: 'ADOPT'
        };
        _carousel = null;
    }

    componentWillMount() {
        this.loadInitialResults();
    }

    componentWillReceiveProps(nextProps) {
        if (__DEV__) { console.log(nextProps); }
        const nextFilters = getStateFilters(nextProps.filters);
        if (!R.equals(this.state.filters, nextFilters)) {
            this.setState({ filters: nextFilters });
        }

        if (!R.equals(this.props.favorites, nextProps.favorites)) {
            this.setState({favorites: nextProps.favorites});
            if (!nextProps.favorites.length) {
                this.setState({ fab: false});
            } else if (this._carousel) {
                this.setFav(this.state.results[this._carousel.currentIndex]);
            }
        }

        if (__DEV__) { console.log(nextProps.isLoading); }
        if (!R.equals(this.props.results, nextProps.results)) {
            this.setState({results: nextProps.results, favScreen: false, title: 'ADOPT'});
            if (this._carousel && nextProps.results.length) {
                setTimeout(() => {
                    this._carousel.snapToItem(0, false);
                }, 200)
            }
        }

        if (__DEV__) { console.log(nextProps.results.length) }
        if (!nextProps.isLoading && !nextProps.results.length) {
            let nl = Platform.OS === 'ios' ? '\n' : '';
            showMessage(nl + 'No results; please try new search criteria', {duration: 1000});
        }

        // Is autoplay on or off?
        if (!R.equals(this.props.globals.autoplay, nextProps.globals.autoplay)) {
            if (nextProps.globals.autoplay && this._carousel) {
                this._carousel.startAutoplay();
            } else {
                if (this._carousel) {
                    this._carousel.stopAutoplay();
                }
            }
        }
    }

    setFav = ( pet ) => {
        if (pet) {
            let bFav = (this.state.favorites && this.state.favorites.length
                    && this.state.favorites.find(fav => fav.id === pet.id));
            this.setState({
                fav: bFav,
            });
        }
    }

    loadInitialResults = () => {
        if (!this.props.results.length) {
            // Open the filter page
            //this.props.navigation.navigate("Filters");
            this.props.doSearch({
                location: this.state.filters.location || this.props.globals.location,
                sizes: this.state.filters.sizes,
                ages: this.state.filters.ages,
                sexes: this.state.filters.sexes,
                species: this.state.filters.species,
                breed: this.state.filters.breed,
            });
            //this.props.doSearch(filters);
        }
    }

    handleLoadMore = () => {
        if (__DEV__) { console.log('load more....'); }
    };

    handleItemSlected = (_id) => {
        this.props.navigation.navigate('Profile', {id: _id});
    };

    handleItemSnapped = (_index) => {
        this.setFav(this.state.results[_index]);
        if (__DEV__) { console.log(_index); }
    };

    renderItem = ({item, index}, parallaxProps) => {
        return (
            <CardFlip
                data={item}
                onPressItem={this.handleItemSlected}
            />
        )
    };

    get card () {
        if (this.state.results.length) {
            return (
                <View style={styles.cardContainer}>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.results}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        keyExtractor={item => item.id}
                        firstItem={this.state.firstItem}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.7}
                        enableMomentum={false}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        autoplay={this.props.globals.autoplay}
                        autoplayDelay={500}
                        autoplayInterval={3000}
                        renderItem={this.renderItem}
                        onBeforeSnapToItem={this.handleItemSnapped}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={50}
                        removeClippedSubviews={false}
                    />
                </View>
            );
        } else {
            return (
                <TouchableOpacity
                    style={[styles.startSearch]}
                    onPress={() => this.props.navigation.navigate("PetFilters")}
                >
                    <Image style={styles.searchImage} source={require('../../assets/start_search.png')}/>
                </TouchableOpacity>
            );
        }
    }

    get buttons () {
        if (this.state.results.length) {
            return (
                <View style={styles.buttonWrapper}>
                    <Icon containerStyle={styles.button}
                        raised
                        activeOpacity={0.5}
                        name={this.state.fav ? 'star' : 'star-o'}
                        type='font-awesome'
                        color={colors.primary}
                        onPress={() => this.handleFavorite()} />
                    <Icon containerStyle={styles.button}
                        raised
                        activeOpacity={0.5}
                        name='share-square-o'
                        type='font-awesome'
                        color={colors.primary}
                        onPress={() => this.handleShare()}/>
                </View>
            );
        }
    }

    async handleFavorite () {
        const index = this._carousel.currentIndex;
        const pet = this.state.results[index];
        const bFav = (this.state.favorites && this.state.favorites.length
                && this.state.favorites.find(fav => fav.id === pet.id));
        if (bFav) {
            // delete item from database
            const { res: results, err: err } = deleteFavorite(pet.id);
            if (this.state.favorites) {
                var newFavs = [];
                for (let f of this.state.favorites) {
                    if (f.id !== pet.id) {
                        newFavs.push(f);
                    }
                }
                this.setState({ favorites: newFavs });
                if (this.state.favScreen) {
                    if (!newFavs.length) {  // empty list, then switch back to main screen
                        this.favoriteScreen();
                    } else {
                        this.setState({results: newFavs});
                    }
                }
            }
        } else {
            // insert item into database
            const { res: results, err: err } = addFavorite(pet.id, pet.species);
            const newFavs = [...this.state.favorites, pet];
            this.setState({ favorites: newFavs });
            if (this.state.favScreen) {
                this.setState({results: newFavs});
            }
        }
        this.setState({
            fav: !bFav,
        });
    }

    favoriteScreen = () => {
        if (__DEV__) { console.log('Setting up Favorite screen'); }
        if (this.props.globals.autoplay && this._carousel) {
            this._carousel.stopAutoplay();
        }
        if (this.state.favScreen) {
            this.setState({results: this.props.results, favScreen: false, title: 'ADOPT', firstItem: 0 });
        } else {
            this.setState({results: this.state.favorites, favScreen: true, title: 'FAVORITES', firstItem: 0 });
        }

        if (this._carousel) {
            // Hack for the list to settle down before snapto 0
            setTimeout(() => {
                this.handleItemSnapped(0);
                this._carousel.snapToItem(0, false);
                if (this.props.globals.autoplay && this._carousel) {
                    this._carousel.startAutoplay();
                }
            }, 200)
        }
    }

    handleShare () {
        this._carousel.stopAutoplay();
        const index = this._carousel.currentIndex;
        const pet = this.state.results[index];
        var msg = pet.description
        + '\nPlease contact '
        + pet.contact.phone + ' '
        + pet.email;
        var title = pet.name + ' ' + pet.size + ' ' + pet.age + ' ' + pet.sex;
        Share.share({
            message: msg,
            url: undefined,
            title: title,
        }, {
            // Android only:
            dialogTitle: title,
        });
    }

    // If we want Drawer then navigate to "DrawerOpen", instead of "More" which is our
    // modal screen for More stuff
    render () {
        return (
            <View style={styles.mainContainer__full}>
                <View style={styles.toolbar}>
                    <Icon iconStyle={styles.toolbarButton} name='menu' type='iconicon' activeOpacity={0.4}
                        underlayColor='transparent' color={colors.white} onPress={() => this.props.navigation.navigate("DrawerOpen")} />
                    <Text style={styles.toolbarTitle}>{this.state.title}</Text>
                    {(this.state.favorites && this.state.favorites.length) ? <Icon iconStyle={styles.toolbarButton}
                        activeOpacity={0.5}
                        name={this.state.favScreen ? 'ios-images' : 'star'}
                        type={this.state.favScreen ? 'ionicon' : 'font-awesome'}
                        underlayColor='transparent'
                        color={colors.white}
                        onPress={() => this.favoriteScreen()}/> : null}
                    <Icon iconStyle={styles.toolbarButton} name='search' type='iconicon' activeOpacity={0.4}
                        underlayColor='transparent' color={colors.white} onPress={() => this.props.navigation.navigate("PetFilters")} />
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    { this.card }
                    { this.buttons }
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    if (__DEV__) { console.log(state); }
    return {
        results: state.petSearch.results,
        filters: state.petSearch.filters,
        favorites: state.petSearch.favorites,
        globals: state.globals,
        isLoading: state.petSearch.isLoading
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        // Search will pickup filters from redux store
        doSearch: filters => dispatch(PetActions.searchPetRequest(filters)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdoptView);
