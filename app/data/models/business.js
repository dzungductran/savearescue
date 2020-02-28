import PropTypes from 'prop-types';

// PropTypes Models
const BusinessModel = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    fax: PropTypes.string,
    email: PropTypes.string,
    state: PropTypes.string,
    city: PropTypes.string,
    zip: PropTypes.string,
    address: PropTypes.string,
    address2: PropTypes.string,
    coordinate: PropTypes.shape({
        longitude: PropTypes.decimal,
        latitude: PropTypes.decimal,
    }),
    is_open_now: PropTypes.bool,
    is_24_hours: PropTypes.bool,
    rating: PropTypes.decimal,
    review_count: PropTypes.decimal,
    title: PropTypes.string, // for displaying only
});
export default BusinessModel;
