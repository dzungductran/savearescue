import { StyleSheet, Dimensions } from 'react-native';
import applicationStyles, {
    STATUS_BAR_HEIGHT,
    NAV_BAR_HEIGHT,
    PHONE_NUMBER,
    colors
} from '../../../app/controllers/app.styles';

export const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage, total) {
    const value = (percentage * total) / 100;
    return Math.round(value);
}

const progressWidth = wp(80, viewportWidth);

//const slideHeight = viewportHeight * 0.6;
const itemWidth = wp(44, viewportWidth);
const itemHeight = wp(44, viewportHeight - STATUS_BAR_HEIGHT);
const padHorz = wp(4, viewportWidth);
const padVert = wp(4, viewportHeight - STATUS_BAR_HEIGHT);

// hard code for banner.png
const imageWidth = 1212;
const imageHeight = 368;
const imageRatio = viewportWidth / imageWidth;

export { colors, PHONE_NUMBER, progressWidth };

const styles = StyleSheet.create({
    ...applicationStyles,

    innerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        padding: 10,
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
    columnContainer: {
        flexDirection: 'column',
    },
    button: {
        margin: 10
    },
    title: {
        marginTop: 40,
        color: colors.primary,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center'
    },
    image: {
        alignSelf: 'stretch',
        width: viewportWidth,
        height: imageRatio * imageHeight,
        resizeMode: 'contain',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    checkBox: {
        backgroundColor: 'transparent',
        paddingTop: padHorz,
        paddingLeft: padHorz,
    },
    text: {
        fontFamily: 'Arial',
        fontSize: 16,
        color: 'blue',
        paddingBottom: 10
    },
    itemContainer: {
        marginTop: padVert,
        marginLeft: padHorz,
        height: itemHeight,
        width: itemWidth,
        backgroundColor:'white',
        borderRadius:20,
        borderWidth: 1,
        borderColor: '#fff',
        shadowOpacity: 0.4,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
});

export default styles;
