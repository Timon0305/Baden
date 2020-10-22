import React from 'react';
import {observer} from 'mobx-react';
import {StyleSheet, Input, Button,TouchableHighlight,KeyboardAvoidingView, View, ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import __ from '@/assets/lang';
import BoardWithHeader from '@/components/Panel/BoardWithHeader';
import Space from '@/components/Space';
import Modal from 'react-native-modal';
import {scale} from '@/styles/Sizes';
import Colors from "@/styles/Colors";
import Images from '@/styles/Images';
import Separator from "@/components/Separator";
import useViewModel from './methods';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import Loading from "@/components/Loading";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Dialog, { DialogContent, SlideAnimation, DialogButton } from 'react-native-popup-dialog';
import {mockUser} from '@/constants/MockUpData';
import {DialogFooter} from 'react-native-popup-dialog/src';
import GreyInput from '@/components/Input/GreyInput';

const Notifications = (props) => {
  const vm = useViewModel(props);

  return (
      <BoardWithHeader title={__('driver_list')} onSwipeUp={vm.fetchData}>
        {vm.data.isProcessing ?
            <Loading/>
            :
            <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
              <Space height={hp('1%')}/>
              {vm.notifications && vm.notifications.length ? vm.notifications.map((item, index) => {
                    return (
                        <View key={index} style={{alignSelf: 'stretch', flex: 1}}>
                          <NotificationCard
                              notification={item}
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
              <Dialog
                visible={vm.visible}
                width={0.8}
                overlayOpacity={0.5}
                onTouchOutside={() => vm.setVisible(false)}
                dialogAnimation={new SlideAnimation({
                  slideFrom: 'bottom'
                })}
                footer={
                  <DialogFooter>
                    <DialogButton
                        text="CANCEL"
                        onPress={() => {
                          vm.modalCancel()
                        }}
                    />
                    <DialogButton
                        text="OK"
                        onPress={() => {vm.sentOffer}}
                    />
                  </DialogFooter>
                }
              >
                <DialogContent>
                  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View>
                      <Text style={{textAlign: 'center', fontSize: wp('5.8%'), marginTop: hp('2%')}}>Get Offer</Text>
                    </View>
                    <Space height={hp('2%')}/>
                    <View>
                      <Text>Driver Name</Text>
                      <GreyInput  placeholder='dirver name' value={vm.userName} onChangeText={(val) => vm.setUserName(val)} />
                    </View>
                    <View>
                      <Text>Offer Location</Text>
                      <GreyInput placeholder='The Learning Zone' value={vm.offerLocation} onChangeText={(val) => vm.setOfferLocation(val)} />
                    </View>
                    <View>
                      <Text>Offer Price</Text>
                      <GreyInput placeholder='SAR 100' value={vm.offerPrice} onChangeText={(val) => vm.setOfferPrice(val)} />
                    </View>
                  </KeyboardAvoidingView>
                </DialogContent>
              </Dialog>
            </ScrollView>
        }

      </BoardWithHeader>

  )
};

export const NotificationCard = ({notification, onPress}) => {
  const renderContent = () => {
    return (
        <View style={styles.vehicleDesc} >
          <Text style={styles.vehicleName} numberOfLines={1}>{notification.vehicleName}</Text>
          <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <Text>{notification.date}</Text>
            <TouchableOpacity onPress={onPress}>
              <Text>Get Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  return (
      <View>
        <View style={styles.notificationContainer}>
          <Image source={notification.image} style={styles.notificationAvatar}/>
          {renderContent()}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
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
});

export default observer(Notifications);
