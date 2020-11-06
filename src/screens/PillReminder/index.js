import React from 'react';
import {observer} from 'mobx-react';
import {StyleSheet, TouchableHighlight, ScrollView, View, Text, TouchableOpacity, Image} from 'react-native';
import __ from '@/assets/lang';
import BoardWithHeader from '@/components/Panel/BoardWithHeader';
import Space from '@/components/Space';
import Container from '@/components/Container';
import {scale} from '@/styles/Sizes';
import Colors from "@/styles/Colors";
import Images from '@/styles/Images';
import Separator from "@/components/Separator";
import useViewModel from './methods';
import ImageButton from "@/components/Button/ImageButton";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import * as util from '@/utils/String';
import Loading from "@/components/Loading";
import Carousel from 'react-native-snap-carousel'

const PillReminder = (props) => {
    const vm = useViewModel(props);

    return (
        <BoardWithHeader title={__('payment')} onSwipeUp={vm.fetchCard}>
            {vm.data.isProcessing ?
                <Loading/>
                :
                <ScrollView style={styles.container}>
                    {vm.myCard && vm.myCard.length > 0 &&
                    vm.myCard.map((item, index) => {
                        return (
                            <View style={styles.categoryLine} key={index}>
                                <CardButton image={item.image} caption={item.title}
                                            onPress={() => {vm.selectCard(item.id)}}/>
                            </View>
                        )
                    })
                    }
                    <Space height={hp('10%')}/>
                </ScrollView>
            }
        </BoardWithHeader>
    )
};

export const CardButton = ({image, caption, onPress}) => {
    const buttonWidth = wp('90%');
    const cbStyles = StyleSheet.create({
        container: {
            width: buttonWidth,
            // height: wp('80%'),
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            elevation: 2,
            shadowColor: '#ddd',
            shadowRadius: wp('20%'),
            borderRadius: wp('3%'),
            shadowOpacity: 0.4,
            backgroundColor: Colors.white2,
            marginVertical: wp('3%')
        },
        caption: {
            color: '#a89f01',
            fontWeight: 'bold',
            fontSize: hp('2.7%'),
        },
        image: {
            borderRadius: wp('1%'),
            justifyContent: 'center',
            alignItems: 'stretch',
            width: wp('90%'),
        }
    });
    return (
        <TouchableOpacity style={cbStyles.container} onPress={onPress}>
            <Image source={image} style={cbStyles.image} resizeMode={'contain'}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp('90%'),
        flexDirection: 'column',
    },
    note: {
        fontSize: hp('4%'),
        color: '#000000',
        textAlign: 'left',
        fontWeight: 'bold',
        marginVertical: hp('3%'),
    },
    categoryLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('0%'),
    }
});

export default observer(PillReminder);
