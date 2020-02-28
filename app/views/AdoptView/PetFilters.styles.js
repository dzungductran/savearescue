import { StyleSheet, Dimensions } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT,
    INPUT_HEIGHT,
    STATUS_BAR_HEIGHT,
    TITLE_FONT_SIZE,
    INPUT_FONT_SIZE,
    colors
} from '../../../app/controllers/app.styles';
const WINDOW = Dimensions.get('window');

export { colors, NAV_BAR_HEIGHT, STATUS_BAR_HEIGHT };

const styles =  StyleSheet.create({
    ...applicationStyles,

    flushBottom: {
        justifyContent: 'space-between'
    },
    icon: {
        backgroundColor: 'transparent',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        alignSelf: 'center',
    },
    field: {
        marginBottom: 10,
        alignSelf: 'stretch',
    },
    pill: {
        alignSelf: 'center',
    },
    picker: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        height: INPUT_HEIGHT-4,
        backgroundColor: colors.background2,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 4
    }
});

export default styles;
