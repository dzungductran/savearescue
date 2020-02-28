import { StyleSheet } from 'react-native';
import applicationStyles, { INPUT_HEIGHT, colors } from '../../controllers/app.styles';

export { INPUT_HEIGHT };

const styles = StyleSheet.create({
    ...applicationStyles,

    root: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        height: INPUT_HEIGHT,
        borderRadius: 4,
        shadowOpacity: 0.4,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    content: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    text: {
        fontSize: INPUT_HEIGHT / 3,
        color: colors.white,
    },
    icon: {
        color: colors.white,
        marginRight: INPUT_HEIGHT/2
    },
    textButton: {
      fontSize: 14,
      alignSelf: 'center',
      color: 'white'
    },
});

export default styles;
