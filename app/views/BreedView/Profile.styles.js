import { Dimensions, StyleSheet, Platform } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT, colors, STATUS_BAR_HEIGHT
} from '../../../app/controllers/app.styles';

const DIMS = Dimensions.get('window');
const AVATAR_SIZE = DIMS.width/2;
const label_width = DIMS.width/3;

export { NAV_BAR_HEIGHT, colors, STATUS_BAR_HEIGHT, label_width };

export default StyleSheet.create({
    ...applicationStyles,

    label: {
        fontFamily: 'Arial',
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    value: {
        paddingLeft: 4,
        color: colors.grey1,
        backgroundColor: colors.background2,
    },
    subtitle: {
        fontFamily: 'Arial',
        color: colors.drkgray,
        fontSize: 12,
        paddingBottom: 4,
    },
    buttonWrapper: {
        flexDirection: 'row',
        margin: 2,
    },
    gallery: {
        height: AVATAR_SIZE,
        flexDirection: 'row',
        alignItems: 'center',
    },
    gallery_image: {
        height: AVATAR_SIZE-2,
        width: AVATAR_SIZE-4,
        marginHorizontal: 2,
    },
    icon: {
        backgroundColor: 'transparent',
    },
    label: {
        fontWeight: 'bold',
    },
    field: {
        alignSelf: 'center',
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    innerContainer: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: colors.background2,
    }
});
