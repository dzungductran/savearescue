//YourTabBar.js
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles, {
    TAB_BAR_HEIGHT,
    PHONE_NUMBER,
    colors
} from './app.styles';
import { phoneCall } from '../api/communications';

export class customTabBar extends Component {

    // We will use this function in array's map
    renderTabBarButton(route, idx){
        const {
            activeTintColor,
            inactiveTintColor,
            navigation,
            navigationState,
            getLabel,
            renderIcon,
        } = this.props;

        const color = navigationState.index === idx ? activeTintColor : inactiveTintColor;
        const label = getLabel({ route });
        return (
            <TouchableOpacity
                onPress={() => {
                    if(navigationState.index != idx ){
                        if (route.routeName === 'Hotline') {
                            phoneCall(PHONE_NUMBER, true);
                        } else {
                            navigation.navigate(route.routeName);
                        }
                    }
                }}
                style={{}} // Your style goes here
                key={route.routeName}
            >
                <View style={{
                    flexDirection: 'column',  // we want our tab bar is bar not column
                    alignItems: 'center', // we want our tab in the center of the y-axis
                }}>
                    { renderIcon({ route, tintColor:color }) }
                    { label ? (<Text style={[{ color }, {fontSize: 10,fontWeight: '900'}]}>
                        {label}
                    </Text>) : null}
                </View>
            </TouchableOpacity>
        );
    }

    render() {

        // Just for introduction, you can delete uesless params
        const {
            backgroundColor,
            activeTintColor, // font and icon color that tab is active
            getLabel, // a function that returns label's name, it's param is { route: route object(in navigationState.routes array) }
            inactiveTintColor, // font and icon color that tab is inactive
            renderIcon, // a function return the icon component according to the given condition object (you can set icon in navigationOptions)
            style,  // this style is what you pass in the tabBarOptions' style in TabNavigatorConfig
                    // usually we can set height, ex, 49 default ios bottom bar's height
                    // TabNavigatorConfig is the second param in TabNavigator function
            navigation, // navigation object, we will need it .navigate route between tabs screen
            navigationState, // holds routes array which contains all the route confis
                             // what we pass in RouteConfigs(First param in TabNavigator function)
                             // param is ({ focused, route, tintColor })
        } = this.props;
        const tabBarButtons = navigationState.routes.map(this.renderTabBarButton.bind(this));
        return (
            <View style={{
                flexDirection: 'row',  // we want our tab bar is bar not column
                justifyContent: 'space-around', // distribute them evenly
                alignItems: 'center', // we want our tab in the center of the y-axis
                height: TAB_BAR_HEIGHT,
                backgroundColor: colors.primary,
            }}>
                       { tabBarButtons }
            </View>
        );
    }
}
