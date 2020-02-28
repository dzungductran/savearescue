import { StyleSheet } from 'react-native';
import applicationStyles, { INPUT_HEIGHT, TITLE_FONT_SIZE, colors } from '../../controllers/app.styles';

export { INPUT_HEIGHT, colors };

const styles = StyleSheet.create({
    ...applicationStyles,

    root: {
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    text: {
        flex: 1,
        marginLeft: 10,
        textAlign: 'center',
        fontSize: TITLE_FONT_SIZE,
        color: colors.primary,
    },
    title: {
        marginLeft: 20,
        fontSize: 16,
        color: colors.grey2,
    },
    value: {
        fontSize: 16,
        color: colors.grey2,
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    icon: {
        color: colors.primary,
        marginRight: 10,
        marginLeft: 10
    }
});

export default styles;
