import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ScrollView,
    Text
} from 'react-native';
import styles, { colors } from './Profile.styles';
import PetModel, { PetSpeciesModel } from '../../data/models/pet';
import { sendEmail, phoneCall } from '../../api/communications';
import Button from '../../components/Button';
import BackgroundImage from '../../components/BackgroundImage';
import Description from './Description';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Profile extends Component {
    static propTypes = {
        /* eslint-enable react/no-unused-prop-types */
        profile: PetModel.isRequired,
        visible: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            desc: null
        };
    }

    displayDescription = () => {
        const description = this.props.profile.description;
        if (description && description != "undefined") {
            this.state.desc.openModal(description);
        }
    }

    linkPhone = () => {
        if (!this.state.visible) return;
        const phone = this.props.profile.contact.phone.replace(/\D+/g, '');
        phoneCall(phone, true);
    }

    // Sending email
    linkEmail = () => {
        if (!this.state.visible) return;
        const { name, description, contact } = this.props.profile;

        sendEmail(contact.email.split(), undefined, undefined,
                  "Request information for " + name,
                  "I am interested adopting the pet with the description: " + description);
    }

    componentWillReceiveProps(newProps) {
        this.setState({visible: newProps.visible});
    }

    renderGallery() {
        if (!this.props.profile.photos) return null;

        const { photos, ...profile } = this.props.profile;

        return (
            <View style={styles.gallery}>
                {photos.length == 1 && photos[0].small ? (
                    <BackgroundImage style={styles.gallery_image} source={{ uri: photos[0].small }}/>
                ) : undefined}
                {photos.length > 1 && photos[1].small ? (
                    <BackgroundImage style={styles.gallery_image} source={{ uri: photos[1].small }}/>
                ) : undefined}
                {photos.length > 2 && photos[2].small ? (
                    <BackgroundImage style={styles.gallery_image} source={{ uri: photos[2].small }}/>
                ) : undefined}
            </View>
        );
    }

    renderData() {
        const { size, age, gender, breeds, ...profile } = this.props.profile;

        return (
            <View style={[styles.textContainer, styles.galleryOffset]}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.label}>{'Size: '}</Text>
                        <Text style={styles.value}>{size}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.label}>{'Age: '}</Text>
                        <Text style={styles.value}>{age}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.label}>{'Gender: '}</Text>
                        <Text style={styles.value}>{gender}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.label}>{breeds.length > 1 ? 'Breeds: ' : 'Breed: '}</Text>
                    <Text style={styles.value}>{breeds.join(', ')}</Text>
                </View>
            </View>
        );
    }

    render() {
        const { title, contact, description, ...profile } = this.props.profile;
        return (
            <View style={styles.profileContainer}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.cardTitle} onPress={this.displayDescription}>{this.props.profile.name}</Text>
                    {(description != null && description != "undefined")
                    ?  <Icon style={styles.icon} name="speaker-notes" size={30}
                        color={colors.black} onPress={this.displayDescription}/> : null}
                </View>
                {this.renderGallery()}
                {this.renderData()}
                <View style={styles.textContainer}>
                    <Text style={styles.subtitle}>{`${title}`}</Text>
                </View>
                <View style={styles.buttonWrapper}>
                    { contact.phone ? (<Button style={{flex:1}} onPress={this.linkPhone} title="Call" />) : undefined}
                    { contact.email ? (<Button style={{flex:1}} onPress={this.linkEmail} title="Email" />) : undefined}
                </View>
                <Description
                    ref={(c) => { if (!this.state.desc) { this.setState({ desc: c }); } }}
                >
                </Description>
            </View>
        );
    }
}
