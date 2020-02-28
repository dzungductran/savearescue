import PropTypes from 'prop-types';

const RegionModel = PropTypes.shape({
    latitude: PropTypes.decimal,
    longitude: PropTypes.decimal,
    latitudeDelta: PropTypes.decimal,
    longitudeDelta: PropTypes.decimal,
});
export default RegionModel;
