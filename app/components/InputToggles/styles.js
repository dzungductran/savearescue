import { StyleSheet } from 'react-native';
import { INPUT_HEIGHT, INPUT_FONT_SIZE, colors } from '../../controllers/app.styles';

export { INPUT_HEIGHT, colors };

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.primary,
    },

    option: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        minWidth: 60,
    },

    option__active: {
        backgroundColor: colors.primary,
    },
    option__first: {
        paddingLeft: 16,
    },
    option__last: {
        paddingRight: 16,
    },

    label: {
        color: colors.primary,
        fontSize: INPUT_FONT_SIZE,
    },

    label__active: {
        color: 'white',
    },

});

export default styles;
