import React from 'react';
import Container from '@/components/Container';
import {View, StyleSheet, Image, Text, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import {observer} from 'mobx-react';
import Space from '@/components/Space';
import GreyInput from '@/components/Input/GreyInput';
import __ from "@/assets/lang";
import ScrollBoardWithHeaderLBButton from "@/components/Panel/ScrollBoardWithHeaderLRButton";
import DropDownPicker from 'react-native-dropdown-picker';
import Colors from "@/styles/Colors";
import Images from '@/styles/Images';
import useViewModel from './methods';
import SimpleButton from "@/components/Button/SimpleButton";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import dateFormat from 'node-datetime';

const MadaPay = (props) => {
    const vm = useViewModel(props);

    return (
        <Container>
            <ScrollBoardWithHeaderLBButton lButtonCaption={__('back')} rButtonCaption={__('')}
                                           onPressLeftButton={vm.onPressBack}
                                           onPressRightButton={vm.onPressBack}>
                <Text style={styles.note}>{__('pay_with_mada')} </Text>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Image source={require('@/assets/cards/mada.png')} style={styles.image} resizeMode={"contain"} />
                    <Text style={styles.textColor}>Card Number</Text>
                    <GreyInput placeholder='1111 2222 3333 4444' value={vm.name} onChangeText={(val) => vm.setName(val)}/>
                    <Text style={styles.textColor}>Card Holder Name</Text>
                    <GreyInput placeholder={__('dosage')} value={vm.dosage}
                               onChangeText={(val) => vm.setDosage(val)}/>
                    <View style={{flex: 1, flexDirection: 'row'}} resizeMode={'contain'}>
                        <View style={{width: '60%'}}>
                            <Text style={styles.textColor}>Expire Date</Text>
                            <GreyInput placeholder={__('frequency')} value={vm.frequency}
                                       onChangeText={(val) => vm.setFrequency(val)}/>
                        </View>
                        <View style={{width: '10%'}}/>
                        <View style={{width: '30%'}}>
                            <Text style={styles.textColor}>CVV</Text>
                            <GreyInput placeholder='1234' value={vm.frequency}
                                       onChangeText={(val) => vm.setFrequency(val)}/>
                        </View>
                    </View>
                    <Space height={hp('2%')}/>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: wp('5%')}}>TOTAL</Text>
                        <Text style={{textAlign: 'right', fontSize: wp('4%')}}>SAR 123 </Text>
                    </View>
                    <SimpleButton onPress={vm.onPressAdd} caption='Confirm Payment'/>

                    <Space height={hp('20%')}/>
                </KeyboardAvoidingView>


            </ScrollBoardWithHeaderLBButton>
        </Container>
    );
};

const styles = StyleSheet.create({
    dropDownContainer: {
        height: hp('6%'),
        marginVertical: hp('1%')
    },
    dropDownItem: {
        justifyContent: 'flex-start',
    },
    dropDownItemImage: {
        width: hp('4%'),
        height: hp('4%'),
    },
    dropDown: {
        backgroundColor: Colors.grey_light,
        borderWidth: 0,
    },
    dropDownBack: {
        borderWidth: 0,
        backgroundColor: Colors.grey_light,
    },
    dropDownLabel: {
        backgroundColor: Colors.grey_light,
        color: Colors.grey_dark,
        fontSize: hp('1.8%'),
    },
    note: {
        fontSize: hp('2.8%'),
        fontWeight: 'bold',
        textAlign: 'left',
        lineHeight: hp('2%'),
        paddingVertical: hp('1%'),
    },
    image: {
        borderRadius: wp('1%'),
        justifyContent: 'center',
        alignItems: 'stretch',
        width: wp('90%'),
    },
    textColor : {
        fontSize: wp('4.2%'),
        color: Colors.blue1
    }
});

export default observer(MadaPay);
