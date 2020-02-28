import { StyleSheet } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT,
    TAB_BAR_HEIGHT,
    colors,
} from '../../../app/controllers/app.styles';

export { colors };

const styles =  StyleSheet.create({
    ...applicationStyles,

    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    cardContainer: {
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 25
    },
    sliderContentContainer: {
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    },
    button: {
        marginBottom:TAB_BAR_HEIGHT,
    },
    buttonWrapper: {
        justifyContent: 'center',
        flexDirection: 'row'
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
