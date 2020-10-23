import React from 'react';
import {TouchableOpacity, ImageBackground, Text, Button, StyleSheet, View} from 'react-native';
import Images from '@/styles/Images';
import {scale} from '@/styles/Sizes';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

const SimpleButton = ({caption, onPress}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View
                style={styles.imageContainer}
                resizeMode={'cover'}
            >
                <Text style={styles.caption}>
                    {caption}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: hp('1%'),
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        backgroundColor: 'white',
    },
    image: {
        borderRadius: wp('1.5%')
    },
    caption: {
        color: '#841584',
        fontSize: hp('2%'),
        textAlign: 'center',
        textAlignVertical: 'center',
    }
});

export default SimpleButton;
