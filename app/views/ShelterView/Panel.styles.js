import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
    colors,
    NAV_BAR_HEIGHT,
    STATUS_BAR_HEIGHT,
    TAB_BAR_HEIGHT
} from '../../controllers/app.styles';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const RATING_WIDTH = 90;
const RATING_HEIGHT = 15;

const slideWidth = wp(80);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const itemHeight = (viewportHeight - (NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT + TAB_BAR_HEIGHT)) / 6;

export { sliderWidth, itemWidth, itemHeight, colors };

export default StyleSheet.create({
    infoContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 16,
        backgroundColor: 'white',
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
    listInnerContainer: {
        height: itemHeight,
        width: sliderWidth,
    },
    listItemContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    rating: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rating_image: {
        width: RATING_WIDTH,
        height: RATING_HEIGHT,
    },
});
