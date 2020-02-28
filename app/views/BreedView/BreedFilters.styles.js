import { StyleSheet, Dimensions } from 'react-native';
import applicationStyles, {
    INPUT_HEIGHT,
    colors
} from '../../../app/controllers/app.styles';
const DIMS = Dimensions.get('window');
const label_width = DIMS.width/3;
const row_width = DIMS.width - label_width;
const cell_width = (2 * label_width)/10;

export { colors, INPUT_HEIGHT };

const styles =  StyleSheet.create({
    ...applicationStyles,

    icon: {
        backgroundColor: 'transparent',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    field: {
        marginBottom: 10,
        alignSelf: 'stretch',
    },
    pill: {
        alignSelf: 'center',
    },
    optionStyle: {
        paddingHorizontal: 8,
        minWidth: cell_width
    }
});

export default styles;
