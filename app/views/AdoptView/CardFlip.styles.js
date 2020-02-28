import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../../controllers/app.styles';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export { colors };

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

export const sliderWidth = viewportWidth;
export const itemWidth = wp(80);
export const itemHeight = itemWidth + 30 + 28 + 20; // width + title + subtitle + margin

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: itemHeight
    },
    flipCard: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        width: itemWidth,
        height: itemHeight,
        backgroundColor: "white",
        shadowOpacity: 0.4,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        backfaceVisibility: 'hidden',
    },
    flipCardBack: {
      position: "absolute",
      top: 0,
    },
    flipText: {
      width: 90,
      fontSize: 20,
      fontFamily: 'Arial',
      color: 'white',
      fontWeight: 'bold',
    },
    label: {
        color: colors.primary,
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: 'bold',
    },
    icon: {
        backgroundColor: 'transparent',
        paddingLeft: 10,
    },
    value: {
        fontStyle: 'italic',
        paddingLeft: 4,
        color: colors.grey1,
        fontSize: 14,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Arial',
      marginTop: 15,
      marginBottom: 12,
      color: colors.grey1,
    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
