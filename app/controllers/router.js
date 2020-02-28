import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, StatusBar, Platform } from 'react-native';
import {
    TabNavigator,
    StackNavigator,
    addNavigationHelpers,
    NavigationActions,
    DrawerNavigator,
    DrawerItems,
} from 'react-navigation';
import styles, {
    TAB_BAR_HEIGHT,
    PHONE_NUMBER,
    colors
} from './app.styles';

import HomeView from '../views/HomeView';
import BreedView from '../views/BreedView';
import ShelterView from '../views/ShelterView';
import AdoptView from '../views/AdoptView';
import PetFilters from '../views/AdoptView/PetFilters';
import PetServices from '../views/PetServices';
import BreedProfile from '../views/BreedView/Profile';
import BreedFilters from '../views/BreedView/BreedFilters';
import SettingsView from '../views/MoreView/settings';
import CompanyView from '../views/MoreView/company';
import VolunteerView from '../views/MoreView/volunteer';
import TermsView from '../views/MoreView/terms';
import PrivacyView from '../views/MoreView/privacy';
import LicensesView from '../views/MoreView/licenses';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { phoneCall } from '../api/communications';
import { customTabBar } from './customTabBar';

const tabRoutes = {
    AdoptView: {
        screen: AdoptView,
        navigationOptions: {
            tabBarLabel: 'ADOPT',
            tabBarIcon: ({ tintColor }) => (<Ionicons name="ios-basket" size={30} color={tintColor} />),
        }
    },
    ShelterView: {
        screen: ShelterView,
        navigationOptions: {
            tabBarLabel: 'SHELTERS',
            tabBarIcon: ({ tintColor }) => (<Ionicons name="ios-home" size={30} color={tintColor} />),
        }
    },
    Hotline: {
        screen: Component,
        navigationOptions: {
            tabBarLabel: () => {},
            tabBarIcon: ({ tintColor }) => (<Ionicons name="ios-medkit" size={TAB_BAR_HEIGHT} color={'white'}/>),
        }
    },
    PetServices: {
        screen: PetServices,
        navigationOptions: {
            tabBarLabel: 'SERVICES',
            tabBarIcon: ({ tintColor }) => (<Ionicons name="ios-hand" size={30} color={tintColor} />),
        }
    },
    BreedView: {
        screen: BreedView,
        navigationOptions: {
            tabBarLabel: 'BREEDS',
            tabBarIcon: ({ tintColor }) => (<Ionicons name="ios-paw" size={30} color={tintColor} />),
        }
    },
};

const tabConfig = {
    tabBarComponent: customTabBar,
    headerMode: 'none',        // I don't want a NavBar at top
    tabBarPosition: 'bottom',  // So your Android tabs go bottom
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
        allowFontScaling: false,
        activeTintColor: colors.white,  // Color of tab when pressed
        inactiveTintColor: '#b5b5b5', // Color of tab when not pressed
        showIcon: true, // Shows an icon for both iOS and Android
        showLabel: true, // (Platform.OS !== 'android'), //No label for Android
        labelStyle: {
            fontSize: 10,
            fontWeight: '900',
        },
        style: {
            backgroundColor: colors.primary, // Makes Android tab bar white instead of standard blue
            height: TAB_BAR_HEIGHT, // I didn't use this in my app, so the numbers may be off.
        },
        iconStyle: {
            width: TAB_BAR_HEIGHT,
            paddingBottom: 0
        },
    },
    navigationOptions: ({ navigation }) => ({
        tabBarOnPress: ({scene, jumpToIndex, previousScene}) => {
            if (__DEV__) { console.log('onPress:', scene.route); }
            if (scene.route.routeName !== 'Hotline') {
                jumpToIndex(scene.index);
            } else {
                phoneCall(PHONE_NUMBER, true);
            }
        },
    })
};

const Tabs = TabNavigator(tabRoutes, tabConfig);

const customAnimationFunc = () => ({
  screenInterpolator: sceneProps => {
    return CardStackStyleInterpolator.forVertical(sceneProps);
  },
});

const stackRoutes = {
    Home: { screen: HomeView },
    Tabs: {
        screen: Tabs,
        navigationOptions:({navigation}) => ({
            header: null,
        })
    },
    PetFilters: {
        screen: PetFilters,
        navigationOptions:({navigation}) => ({
            header: null,
        })
    },
    CompanyView: { screen: CompanyView },
    SettingsView: { screen: SettingsView },
    VolunteerView: {screen: VolunteerView },
    TermsView: { screen: TermsView },
    PrivacyView: { screen: PrivacyView },
    BreedProfile: {
        screen: BreedProfile,
        navigationOptions:({navigation}) => ({
            header: null,
        })
    },
    LicensesView: { screen: LicensesView},
    BreedFilters: {
        screen: BreedFilters,
        navigationOptions:({navigation}) => ({
            header: null,
        })
    }
};

const stackConfig = {
    // https://stackoverflow.com/questions/46624633/from-left-to-right-window-animation-with-react-navigation
    transitionConfig: customAnimationFunc,
};

export const AppNavigator = StackNavigator(stackRoutes, stackConfig);

const CustomDrawerContentComponent = (props) => (
    <View>
    <View style={styles.drawerHeader}>
        <Image style={styles.drawerImage}
            source={require('../assets/paws1024_1024.png')} />
        <Text style={[styles.drawerText, {paddingLeft: 30, color: colors.primary}]}>{'Save'}
            <Text style={[styles.drawerText, {color: colors.black}]}>{'a'}
                <Text style={[styles.drawerText, {color: colors.primary}]}>{'Rescue'}
                    <Text style={[styles.drawerText, {color: colors.black}]}>{'.org'}</Text>
                </Text>
            </Text>
        </Text>
    </View>
    <View>
        <DrawerItems {...props} />
    </View>
    </View>
);

export const TabsInDrawer = DrawerNavigator({
    Home: { screen: AppNavigator },
    CompanyView: { screen: CompanyView },
    SettingsView: { screen: SettingsView },
    TermsView: { screen: TermsView },
    PrivacyView: { screen: PrivacyView },
    LicensesView: { screen: LicensesView },
    VolunteerView: { screen: VolunteerView }
}, {
    initialRouteName: 'Home',
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerBackgroundColor : colors.white,
    contentOptions: {
        activeBackgroundColor: colors.white,
        activeTintColor: colors.black,
        style: {
            flex: 1,
            paddingTop: 15,
        }
    }
});

const defaultGetStateForAction = TabsInDrawer.router.getStateForAction;

TabsInDrawer.router.getStateForAction = (action, state) => {
    if(state && action.type === 'Navigation/NAVIGATE'
        && action.routeName === 'DrawerClose' && Platform.OS === 'ios') {
        StatusBar.setHidden(false);
    }

    if(state && action.type === 'Navigation/NAVIGATE'
        && action.routeName === 'DrawerOpen' && Platform.OS === 'ios') {
        StatusBar.setHidden(true);
    }


    return defaultGetStateForAction(action, state);
};
