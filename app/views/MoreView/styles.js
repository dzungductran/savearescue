import { StyleSheet } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT,
    INPUT_HEIGHT,
    colors,
    PHONE_NUMBER
} from '../../../app/controllers/app.styles';

export { colors, INPUT_HEIGHT, PHONE_NUMBER };

const styles = StyleSheet.create({
    ...applicationStyles,

    modalWrapper: {
        flex: 1,
    },
    title: {
        padding: 4,
        marginLeft: 10,
        color: colors.grey0,
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    space: {
        padding: 8
    },
    button: {
        margin: 20
    },
    line: {
        borderBottomColor: colors.grey3,
        borderBottomWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        padding: 4,
    },
    label: {
        marginLeft: 28,
        fontSize: 16,
        color: colors.grey2,
    },
    switchLabel: {
        marginLeft: 20,
        fontSize: 16,
        color: colors.grey2,
    },
    blockText: {
        marginLeft: 20,
        marginRight: 10,
        fontSize: 16,
        color: colors.grey2,
        textAlign: 'justify'
    },
    picker: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 4,
        alignItems: 'center'
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    scrollWrapper: {
        paddingTop: 2,
    },
});

export default styles;
