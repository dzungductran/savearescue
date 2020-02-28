import React, { Component, PureComponent } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Profile from './Profile';
import PropTypes from 'prop-types';
import styles, { colors, itemWidth } from './CardFlip.styles';
import BackgroundImage from '../../components/BackgroundImage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class CardFlip extends PureComponent {

    static propTypes = {
        data: PropTypes.object.isRequired,
        onPressItem: PropTypes.func
    };

    static defaultProps = {
        data: {},
    }

    constructor (props) {
        super(props);
        this.state = {
            backFace: false,
        };
    }

    displayDescription = () => {
        const description = this.props.profile.description;
        if (description && description != "undefined") {
            this.state.desc.openModal(description);
        }
    }

    componentWillMount() {
        this.animatedValue = new Animated.Value(0);
        this.value = 0;
        this.animatedValue.addListener(({ value }) => {
            this.value = value;
        })
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        })
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        })
    }

    flipCard() {
        if (this.value >= 90) {
            this.setState({ backFace: false });
            Animated.spring(this.animatedValue,{
                toValue: 0,
                friction: 8,
                tension: 10
            }).start();
        } else {
            this.setState({ backFace: true });
            Animated.spring(this.animatedValue,{
                toValue: 180,
                friction: 8,
                tension: 10
            }).start();
        }

    }

    renderSubTitle() {
        const { data:
            { size, age, gender }
        } = this.props;
        return (
            <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 10, justifyContent: 'space-between', flexDirection: 'row'}}>
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
        );
    }

    renderImageWithName() {
        const { data:
            { name, description, photos }
        } = this.props;
        return (
            <View style={{alignItems: 'center'}}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.cardTitle}>{name}</Text>
                    {(description && description != "undefined")
                    ?  <Icon style={styles.icon} name="speaker-notes" size={30}
                        color={colors.black}/> : null}
                </View>
                <BackgroundImage style={{width: itemWidth-8, height: itemWidth-1}}
                    source={(photos && photos.length && photos[0].large !== undefined)
                    ? { uri: photos[0].large }
                    : (photos && photos.length > 1 && photos[1].large !== undefined)
                    ? { uri: photos[1].large }
                    : (photos && photos.length > 2 && photos[2].large !== undefined)
                    ? { uri: photos[2].large }
                    : (photos && photos.length && photos[0].small !== undefined)
                    ? { uri: photos[0].small }
                    : (photos && photos.length > 1 && photos[1].small !== undefined)
                    ? { uri: photos[1].small }
                    : (photos && photos.length > 2 && photos[2].small !== undefined)
                    ? { uri: photos[2].small }
                    : require('../../assets/not_pictured.png')}/>
            </View>
        );
    }

    render () {
        const frontAnimatedStyle = {
          transform: [
            { rotateY: this.frontInterpolate}
          ]
        }
        const backAnimatedStyle = {
          transform: [
            { rotateY: this.backInterpolate }
          ]
        }

        return (
            <TouchableOpacity activeOpacity={1}
                style={styles.slideInnerContainer}
                onPress={() => this.flipCard()}
            >
                <View>
                    <Animated.View style={[styles.flipCard, frontAnimatedStyle,
                        {opacity: this.state.backFace ? 0 : 1}]}>
                        {this.renderImageWithName()}
                        {this.renderSubTitle()}
                    </Animated.View>
                    <Animated.View style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack,
                        {opacity: this.state.backFace ? 1 : 0}]}>
                        <Profile profile={this.props.data} visible={this.state.backFace}></Profile>
                    </Animated.View>
                </View>
             </TouchableOpacity>
        );
    }
}
