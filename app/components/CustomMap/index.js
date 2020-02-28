import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import CustomCallout from './CustomCallout';
import flagImg from '../assets/shelter-small.png';
import styles from './styles';

import ShelterModel from '../../data/models/pet';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

// PropTypes Models
export const RegionPropType = PropTypes.shape({
    region: {
        latitude: PropTypes.decimal,
        longitude: PropTypes.decimal,
        latitudeDelta: PropTypes.decimal,
        longitudeDelta: PropTypes.decimal,
    },
});

class CustomMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCalloutIndex : 0,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markers: [
                {
                    coordinate: {
                        latitude: LATITUDE + SPACE,
                        longitude: LONGITUDE + SPACE,
                    },
                },
                {
                    coordinate: {
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                    },
                },
                {
                    coordinate: {
                        latitude: LATITUDE + SPACE,
                        longitude: LONGITUDE - SPACE,
                    },
                },
            ],
        };
    }

    show() {
        this.marker1.showCallout();
    }

    hide() {
        this.marker1.hideCallout();
    }

    render() {
        const { region, markers, selectedCalloutIndex } = this.state;
        return (
            <MapView
                provider={this.props.provider}
                style={styles.map}
                initialRegion={region}
            >
                <MapView.Marker
                    ref={ref => { this.marker1 = ref; }}
                    coordinate={markers[0].coordinate}
                    title="This is a native view"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing"
                    image={flagImg}
                />
                <MapView.Marker
                    coordinate={markers[1].coordinate}
                    image={flagImg}
                >
                    <MapView.Callout style={styles.plainView}>
                        <Text>This is a custom callout bubble view</Text>
                    </MapView.Callout>
                </MapView.Marker>
                <MapView.Marker
                    coordinate={markers[2].coordinate}
                    calloutOffset={{ x: -8, y: 28 }}
                    calloutAnchor={{ x: 0.5, y: 0.4 }}
                    image={flagImg}
                    >
                    <MapView.Callout tooltip style={styles.customView}>
                        <CustomCallout>
                            <Text>This is a custom callout bubble view</Text>
                        </CustomCallout>
                    </MapView.Callout>
                </MapView.Marker>
            </MapView>
        );
    }
}

CustomMap.propTypes = {
    provider: MapView.ProviderPropType,
    results: PropTypes.arrayOf(ShelterModel),
    region: RegionPropType,
};

module.exports = CustomMap;
