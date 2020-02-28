import React, { Component } from 'react';
import { AppNavigator, TabsInDrawer,  }from './router';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import store from '../data/store';
import SplashScreen from 'react-native-splash-screen';
import { MessageBar } from 'react-native-messages'

// Use TabsInDrawer if we want a Drawer from the left, otherwise just Tabs at
// the bottom
class App extends Component {
    componentDidMount() {
        setTimeout(() => {
            SplashScreen.hide()
        }, 2000)
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Provider store={store}>
                    <TabsInDrawer />
                </Provider>
                <MessageBar/>
            </View>
        );
    }
}

export default App;
