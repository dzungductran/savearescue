import { StyleSheet, Dimensions } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT,
    TAB_BAR_HEIGHT,
    STATUS_BAR_HEIGHT,
    colors
} from '../../../app/controllers/app.styles';

export { colors };

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage, total) {
    const value = (percentage * total) / 100;
    return Math.round(value);
}

const itemWidth = wp(80, viewportWidth);
const itemHeight = viewportHeight - ((2*NAV_BAR_HEIGHT) + TAB_BAR_HEIGHT + STATUS_BAR_HEIGHT);

export default StyleSheet.create({
    ...applicationStyles,

    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    innerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT,
        width: itemWidth,
        maxHeight: itemHeight,
        backgroundColor:'white',
        borderRadius: 4
    },
    icon: {
        backgroundColor: 'transparent',
    },
    value: {
        flex: 1,
        alignSelf: 'center',
        fontFamily: 'Arial',
        padding: 10,
        color: colors.grey1,
        fontSize: 14,
    },
});
