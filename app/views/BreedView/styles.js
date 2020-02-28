import { StyleSheet } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT,
    colors
} from '../../../app/controllers/app.styles';

export { colors };

const styles = StyleSheet.create({
    ...applicationStyles,

    rowContainer: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
    },
    rowText: {
        flex:1,
        fontFamily: 'Arial',
        color: colors.black,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginLeft: 12,
        fontSize: 16,
    },
    subText: {
        fontSize: 12,
    },
    rowPhoto: {
        height: 40,
        width: 40,
        borderRadius: 1,
    },
    sectionContainer: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    sectionText: {
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
    },
    listContainer: {
        flex: 1,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    text: {
        fontFamily: 'Arial',
        fontSize: 16,
        padding: 4,
        color: colors.black,
        backgroundColor: colors.background,
    },
    header: {
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: colors.white,
        color: colors.primary,
        padding: 4
    },
});

export default styles;
