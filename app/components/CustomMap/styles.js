import { StyleSheet } from 'react-native';
import { INPUT_HEIGHT, INPUT_FONT_SIZE } from '../../controllers/app.styles';

const styles = StyleSheet.create({
    customView: {
        width: 140,
        height: 100,
    },
    plainView: {
        width: 60,
    },
    map: {
        flex: 1,
    },
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
});

export default styles;
