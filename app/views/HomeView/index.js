import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    Image,
    TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../components/Button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Actions as GlobalActions } from '../../data/globals';
import { phoneCall } from '../../api/communications';
import styles, { PHONE_NUMBER, colors } from './styles';
import Progress from './progress';
import { downloadFile, isFileExists, checkSize, readMetaData} from '../../api/downloader';

// See more information on how to create the database and info file 
// in the scripts directory
const dbURL = "https://www.yoursite.com/database_file_for_petservices.db";
const dbInfoURL = "https://www.yoursite.com/database_file_for_petservice_info.csv";
const dbFILE_SIZE = 39149568;

class HomeView extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'Home',
        drawerIcon: (<Ionicons name="ios-home" size={24} color={colors.primary} />)
    };

    static propTypes = {
        globals: PropTypes.shape({
            location: PropTypes.shape({
                zipCode: PropTypes.string,
                latitude: PropTypes.number,
                longitude: PropTypes.numbers
            }),
            database: PropTypes.shape({
                fileName: PropTypes.string,
                isLoaded: PropTypes.bool,
            }),
        }),
        isButton: PropTypes.bool,
        initRequest: PropTypes.func.isRequired,
    };

    static defaultProps = {
        globals: {},
        isButton: true,
    };

    progressFn = per => {
        if (__DEV__) {
            const text = `Progress ${per}%`;
            console.log(text);
        }
        this.setState({percentage: per});
    };

    beginDownload = async() => {
        var { res, database } = await isFileExists(dbURL);
        if (__DEV__) {
            console.log(res);
            console.log(database);
        }

        // Download metadata info file
        var reDownload = false;
        var version = '';
        var size = 0;
        var metaDataFile = database.fileName.slice(0, -2) + "csv"; // remove the "db" extension and add json
        if (__DEV__) { console.log("metaDataFile " + metaDataFile); }
        if (database.isLoaded) {
            // read in the file on disk
            var content = await readMetaData(metaDataFile);
            if (content && content.length && content.indexOf(',') !== -1) {
                let metaDataStrs = content.split(',');
                version = metaDataStrs[0];
                size = parseInt(metaDataStrs[1]);
            } else {
                reDownload = true;   // metadata is not available, so download
            }
            if (__DEV__) {
                console.log(content);
                console.log("version " + version + " size " + size);
            }
        }

        // Download new metadata file
        var { res, database: metaFile } = await downloadFile(true, dbInfoURL, metaDataFile);
        if (metaFile.isLoaded && !reDownload) {
            if (__DEV__) { console.log(metaFile); }

            // read the newly downloaded metafiel
            content = await readMetaData(metaDataFile);
            if (content && content.length && content.indexOf(',') !== -1) {
                let metaDataStrs = content.split(',');
                let newVersion = metaDataStrs[0];
                let newSize = parseInt(metaDataStrs[1]);

                if (__DEV__) {
                    console.log(content);
                    console.log("new version " + newVersion + " new size " + newSize);
                }
                if (newVersion !== version) {
                    reDownload = true;
                } else {
                    reDownload = await checkSize(database.fileName, size);
                }
            } else {
                reDownload = await checkSize(database.fileName, size);
            }
        }

        if (__DEV__) { console.log("redownload " + reDownload)}

        if (!database.isLoaded || reDownload) {
            this.displayProgress(true);
            var { res, database } = await downloadFile(true, dbURL, database.fileName, this.progressFn);
        }
        this.props.setDatabase( database, res );
        this.displayProgress(false);
    }

    componentDidMount() {
        this.props.initRequest();
        this.beginDownload();
    }

    constructor (props) {
        super(props);
        this.state = {
            progress: null,
            percentage: 0
        };
    }

    // ios-settings-outline
    //
    getPanel = (title, routeName) => {
        return (
            <TouchableHighlight
                style={styles.itemContainer}
                onPress={() => {
                    if (routeName === PHONE_NUMBER) {
                        phoneCall(routeName, true);
                    }
                    else {
                        this.props.navigation.navigate(routeName);
                    }
                }}
                underlayColor='transparent'>
                <Text style={styles.title}>{`${title}`}</Text>
            </TouchableHighlight>
        );
    }

    displayProgress = (isDisplay) => {
        if (this.state.progress) {
            if (isDisplay) {
                this.state.progress.openModal();
            } else {
                this.state.progress.closeModal();
            }
        }
    }

    get buttons() {
        return (
            <View style={{flex: 1, justifyContent:'center'}}>
                <Progress ref={(c) => { if (!this.state.progress) { this.setState({ progress: c }); } }}
                    percentage={this.state.percentage}>
                </Progress>
                <Image style={styles.image} source={require('../../assets/banner.png')}/>
                <View style={{flexDirection:'column'}}>
                    <Button style={styles.button} onPress={() => { phoneCall(PHONE_NUMBER, true); }} title="EMERGENCY HOTLINE" icon="ambulance"/>
                    <Button style={styles.button} onPress={() => { this.props.navigation.navigate('AdoptView'); }} title="ADOPTABLES" icon="heart" />
                    <Button style={styles.button} onPress={() => { this.props.navigation.navigate('ShelterView'); }} title="RESCUES & SHELTERS" icon="home"/>
                    <Button style={styles.button} onPress={() => { this.props.navigation.navigate('PetServices'); }} title="PET SERVICES" icon="handshake-o"/>
                    <Button style={styles.button} onPress={() => { this.props.navigation.navigate('BreedView'); }} title="BREEDS A-Z" icon="paw" />
                    <Button style={styles.button} onPress={() => { this.props.navigation.navigate('CompanyView'); }} title="COMPANY INFO" icon="navicon"/>
                </View>
            </View>
        );
    }

    get pannels() {
        return (
            <View>
                <View style={styles.rowContainer}>
                    {this.getPanel('CALL US', PHONE_NUMBER)}
                    {this.getPanel('ADOPTABLES', 'AdoptView')}
                </View>
                <View style={styles.rowContainer}>
                    {this.getPanel('SHELTERS', 'ShelterView')}
                    {this.getPanel('PET SERVICES', 'PetServices')}
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.mainContainer__full}>
                {this.props.isButton ? this.buttons : this.pannels}
            </View>
        );
    }
}

function mapStateToProps(state, props) {
    if (__DEV__) { console.log(state); }
    return {
        globals: state.globals,
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        // Search will pickup filters from redux store
        initRequest: () => dispatch(GlobalActions.initRequest()),
        setDatabase: (database, res) => dispatch(GlobalActions.setDatabase(database, res))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
