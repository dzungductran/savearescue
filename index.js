import { AppRegistry, Text } from 'react-native';
import App from './app/controllers/app';

// Turn off Font assesbility
let originalGetDefaultProps = Text.defaultProps;
Text.defaultProps = function()
{
    return { ...originalGetDefaultProps, allowFontScaling: false, };
};

AppRegistry.registerComponent('savearescue', () => App);
