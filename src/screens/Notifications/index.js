import React from 'react';
import {observer} from 'mobx-react';
import {StyleSheet, TextInput, Modal, Button,TouchableHighlight,KeyboardAvoidingView, View, ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import __ from '@/assets/lang';
import BoardWithHeader from '@/components/Panel/BoardWithHeader';
import Space from '@/components/Space';
import {scale} from '@/styles/Sizes';
import Colors from "@/styles/Colors";
import Images from '@/styles/Images';
import Separator from "@/components/Separator";
import useViewModel from './methods';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import Loading from "@/components/Loading";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Dialog, { DialogContent, SlideAnimation, DialogButton } from 'react-native-popup-dialog';
import {DialogFooter} from 'react-native-popup-dialog/src';
import GreyInput from '@/components/Input/GreyInput';
import * as datetime from 'node-datetime';
import BlueButton from '@/components/Button/BlueButton';

const Notifications = (props) => {
  const vm = useViewModel(props);

  return (
      <BoardWithHeader title={__('driver_list')} onSwipeUp={vm.fetchData}>
        {vm.data.isProcessing ?
            <Loading/>
            :
            <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
              <Space height={hp('1%')}/>
              {vm.vehicleList && vm.vehicleList.length ? vm.vehicleList.map((item, index) => {
                    return (
                        <View key={index} style={{alignSelf: 'stretch', flex: 1}}>
                          <NotificationCard
                              vehicle={item}
                              data={vm.existedOffer}
                              key={index}
                              onPress = {() => vm.getOffer(item.id)}
                          />
                          <Separator color={Colors.grey} width={2}/>
                        </View>
                    )
                  })
                  :
                  <Text style={styles.listSubTitle}>
                    {'0 ' + __('results_found')}
                  </Text>
              }
              <Space height={hp('3%')}/>
              <View style={styles.container1}>
                <Modal
                    animationType = {"slide"}
                    transparent={false}
                    visible={vm.visible}
                    onRequestClose={() => {
                      vm.modalCancel()
                    }}>
                  {vm.vehicleList && vm.vehicleList.length ? vm.vehicleList.map((item, index) => {
                    if (item.id === vm.vehicleId) {
                      return (
                          <View key={index}>
                            <Image source={{uri: item.carUrl}} style={{width: wp('100%'), height: hp('30%')}}/>
                            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={{padding: wp('5%')}}>
                              <View style={styles.calendarContainer}>
                                <View style={styles.leftText}>
                                  <Text>Driver Name :</Text>
                                </View>
                                <View style={styles.rightText}>
                                  <Text style={{fontSize: hp('2.5%')}}>{item.fullName}</Text>
                                </View>
                              </View>
                              <View style={styles.calendarContainer}>
                                <View style={styles.leftText}>
                                  <Text>Vehicle Name :</Text>
                                </View>
                                <View style={styles.rightText}>
                                  <Text style={{fontSize: hp('2.5%')}}>{item.carName}</Text>
                                </View>
                              </View>
                              <View style={styles.calendarContainer}>
                                <View style={styles.leftText}>
                                  <Text>Created Date :</Text>
                                </View>
                                <View style={styles.rightText}>
                                  <Text style={{fontSize: hp('2.5%')}}>{datetime.create(item.date).format('f d Y')}</Text>
                                </View>
                              </View>
                              <Separator color={Colors.grey} width={2}/>
                              <Space height={hp('2%')}/>
                              <View>
                                <Text style={{fontSize: hp('2.4%')}}>Offer Location</Text>
                                <Space height={hp('1%')}/>
                                <Text>{vm.offerLocation}</Text>
                              </View>
                              <Space height={hp('3%')}/>
                              <View>
                                <Text style={{fontSize: hp('2.4%')}}>Offer DateTime</Text>
                                <Space height={hp('1%')}/>
                                <Text>{vm.offerTime}</Text>
                              </View>
                              <Space height={hp('3%')}/>
                              <Separator color={Colors.grey} width={2}/>
                              <View>
                                <TouchableHighlight style={styles.whiteButton} onPress={vm.sentOffer} underlayColor={Colors.blue1}>
                                  <Text style={{textAlign: 'center'}}>
                                    Sent Offer
                                  </Text>
                                </TouchableHighlight>
                                <Space height={hp('3%')}/>
                                <Text
                                    style={{textAlign: 'center'}}
                                    onPress={() => {
                                      vm.modalCancel()}}>Close</Text>
                              </View>
                            </KeyboardAvoidingView>
                          </View>
                      )}
                     }) : <Text/>
                  }

                </Modal>
              </View>
            </ScrollView>
        }

      </BoardWithHeader>

  )
};

export const NotificationCard = ({vehicle, onPress, data}) => {
  const renderContent = () => {
    let offered = false;
    let offeredItem = null;
    for (let item of data) {
      if (item.vehicleId === vehicle.id) {
        offered = true;
        offeredItem = item;
        break;
      }
    }
      return (
        <View style={styles.vehicleDesc} >
            <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.vehicleName} numberOfLines={1}>{vehicle.carName}</Text>
            </View>

          <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                  {offeredItem == null ?
                      <Text>{datetime.create(vehicle.date).format('f d Y')}</Text>
                      :
                      <Text>{datetime.create(offeredItem.offerTime).format('f d Y')}</Text>
                  }
                    {offeredItem == null ?
                        <TouchableOpacity onPress={onPress}>
                            <Text>Get Offer</Text>
                        </TouchableOpacity>
                        :
                    <Text>
                        <Text style={{color: 'red'}}>{'\u2B24'}</Text>
                        {' ' + offeredItem.offerStatus}
                    </Text>
                    }
          </View>
        </View>
    );
  }


  return (
      <View>
        <View style={styles.notificationContainer}>
          <Image source={{uri: vehicle.carUrl}} style={styles.notificationAvatar}/>
          {renderContent()}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    padding: 5 * scale,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftText : {
    width: wp('30%')
  },
  rightText : {
    width : wp('60%'),
  },
  sar: {
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    alignSelf: 'stretch'
    // backgroundColor: '#666',
  },
  notificationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  notificationAvatar: {
    width: hp('8%'),
    height: hp('8%'),
    borderRadius: hp('0% '),
  },
  vehicleDesc: {
    marginLeft: wp('4%'),
    flex: 1
  },
  vehicleName: {
    fontWeight: 'bold',
    fontSize: hp('2.6%'),
  },
  notificationDescText: {
    fontSize: hp('1.7%'),
    lineHeight: hp('2.8%'),
  },
  listSubTitle: {
    fontWeight: 'bold',
    fontSize: wp('5%')
  },
  container1: {
    padding: wp('5%'),
    width:  wp('80%'),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  whiteButton: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: hp('1.8%'),
    borderRadius: hp('0.5%'),
    borderWidth: 1,
    borderColor: Colors.blue1,
    alignContent: 'center',
  },
});

export default observer(Notifications);
