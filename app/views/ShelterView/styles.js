import { StyleSheet, Dimensions } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT,
    colors,
    STATUS_BAR_HEIGHT
} from '../../../app/controllers/app.styles';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export { colors, CARD_HEIGHT, CARD_WIDTH };

const styles = StyleSheet.create({
    ...applicationStyles,

    container: {
        flex: 1,
    },
    scrollView: {
        position: "absolute",
        top: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT,
        left: 0,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
    startSearch: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    searchImage: {
        alignSelf: 'flex-end',
        marginRight: 10,
    },
});

export default styles;
