import { Platform, PixelRatio } from 'react-native';

export const NAV_BAR_HEIGHT = 44;
export const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 0 });
export const TAB_BAR_HEIGHT = 48;
export const INPUT_HEIGHT = 50;
export const INPUT_FONT_SIZE = 14;
export const TITLE_FONT_SIZE = 20;
// This is the hotline phone number
export const PHONE_NUMBER = '+1,555-222-1234';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    drkgray: '#666666',
    background: '#ffeded',
    toolbar: '#f9f9f9',
    background2: '#ffefef',
    primary: '#b30000',
    secondary: '#d60000',
    grey0: '#393e42',
    grey1: '#43484d',
    grey2: '#5e6977',
    grey3: '#86939e',
    grey4: '#bdc6cf',
    grey5: '#e1e8ee',
    green: 'rgba(6, 102, 18, 1.0)',
    greyOutline: '#bbb',
    searchBg: '#303337',
    error: '#ff190c',
    white: '#ffffff',
    call: '#228B22',
    email: '#FFA500',
    map: '#e74c3c'
};

export default {
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT,
        backgroundColor: colors.background2,
    },
    mainContainer__noNav: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: STATUS_BAR_HEIGHT,
        backgroundColor: colors.background2,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    },
    mainContainer__full: {
        paddingTop: 0,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.background2,
    },
    toolbar:{
        backgroundColor: colors.primary,
        height: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection:'row',    //Step 1
        borderBottomColor: '#b5b5b5',
        borderBottomWidth: 1 / PixelRatio.get(),
    },
    toolbarButton:{
        paddingTop: STATUS_BAR_HEIGHT,
        margin: 10
    },
    toolbarTitle:{
        paddingTop: STATUS_BAR_HEIGHT,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: colors.white,
        fontSize: TITLE_FONT_SIZE,
        textAlign:'center',
        flex:1                //Step 3
    },
    modalWrapper: {
        flex: 1,
    },
    scrollWrapper: {
        flex: 1,
    },
    scrollContent: {
        justifyContent: 'space-between',
        alignItems: 'center'
        //flexGrow: 1,
    },
    splitContent: {
        alignItems: 'center',
        //flexGrow: 1,
    },
    splitActions: {
        padding: 10,
        paddingBottom: 20,
    },
    topBar: {
        alignSelf: 'stretch',
        height: NAV_BAR_HEIGHT,
//        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: '#fff'
    },
    drawerImage: {
        position: 'absolute',
        left: 0,
        top: STATUS_BAR_HEIGHT,
        height: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT,
        width: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT
    },
    drawerText: {
        paddingTop: STATUS_BAR_HEIGHT,
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold'
    },
    drawerHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: colors.primary,
        height: NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT + STATUS_BAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    }
};
