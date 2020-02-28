import { Dimensions, StyleSheet, Platform } from 'react-native';
import applicationStyles, {
    NAV_BAR_HEIGHT, colors
} from '../../../app/controllers/app.styles';

const DIMS = Dimensions.get('window');
const AVATAR_SIZE = 150;

export { colors };

export default StyleSheet.create({
    ...applicationStyles,

    profileContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        shadowOpacity: 0.4,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    textContainer: {
        marginVertical: 2,
        marginHorizontal: 4,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        shadowOpacity: 0.4,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    name: {
        fontFamily: 'Arial',
        fontSize: 14,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    cardTitle: {
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 15,
      marginBottom: 12,
      color: colors.grey1,
    },
    label: {
        fontFamily: 'Arial',
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    value: {
        fontFamily: 'Arial',
        fontStyle: 'italic',
        paddingLeft: 4,
        color: colors.grey1,
        fontSize: 14,
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
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        backgroundColor: 'transparent',
        paddingLeft: 10,
    },
    galleryOffset : {
    },
    gallery: {
        flex: 1,
        height: AVATAR_SIZE,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    gallery_image: {
        height: AVATAR_SIZE-2,
        width: AVATAR_SIZE-4,
        marginHorizontal: 2,
    }
});
