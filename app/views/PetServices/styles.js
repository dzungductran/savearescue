import { StyleSheet, Dimensions } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT,
    STATUS_BAR_HEIGHT,
    TITLE_FONT_SIZE,
    colors
} from '../../../app/controllers/app.styles';

const iconSize = NAV_BAR_HEIGHT*0.6;
export { colors, iconSize };

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    ...applicationStyles,

    container: {
        flex: 1,
    },
    baseText: {
        position: 'absolute',
        top:  NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT + NAV_BAR_HEIGHT,
        fontFamily: 'Cochin',
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
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
    picker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    content: {
        paddingTop: STATUS_BAR_HEIGHT,
        width: viewportWidth-NAV_BAR_HEIGHT-NAV_BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerText: {
        fontSize: TITLE_FONT_SIZE,
        color: colors.white,
    },
    icon: {
        marginRight: 10,
        marginLeft: 10,
    }
});

export default styles;
