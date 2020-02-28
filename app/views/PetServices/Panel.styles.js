import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
    colors,
    NAV_BAR_HEIGHT,
    STATUS_BAR_HEIGHT,
    TAB_BAR_HEIGHT
} from '../../controllers/app.styles';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const itemHeight = (viewportHeight - (NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT + TAB_BAR_HEIGHT)) / 6;
const sliderWidth = viewportWidth;

export { colors, itemHeight };

const RATING_WIDTH = 90;
const RATING_HEIGHT = 15;

export default StyleSheet.create({
    infoContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    rating: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rating_image: {
        width: RATING_WIDTH,
        height: RATING_HEIGHT,
    },
    listInnerContainer: {
        height: itemHeight,
        width: sliderWidth,
    },
    listItemContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: colors.white
    },
    title: {
        paddingTop: 4,
        fontFamily: 'Arial',
        color: colors.black,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    subtitle: {
        fontFamily: 'Arial',
        color: colors.drkgray,
        fontSize: 12,
    },
    buttonWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
});
