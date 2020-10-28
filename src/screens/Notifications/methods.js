import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Screens, PillStackScreens, TabStackScreens} from '@/constants/Navigation';
import AsyncStorage from '@react-native-community/async-storage'
import {useStores} from "@/hooks";
import __ from '@/assets/lang';


function useViewModel(props) {
  const tag = 'Screens::Notification';

  const nav = useNavigation(props);

  const [vehicleList, setVehicleList] = useState();
  const [visible, setVisible] = useState(false);
  const [vehicleId, setVehicleId] = useState()
  const [offerLocation, setOfferLocation] = useState('');
  const [offerTime, setOfferTime] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const {user, data} = useStores();

  const fetchData = async () => {
    await data.getVehicleList(user.sessionToken);
    setOfferLocation(await AsyncStorage.getItem('offerLocation'));
    setOfferTime(await AsyncStorage.getItem('offerDate') + ' ' + await AsyncStorage.getItem('offerTime'))
    if (data.lastStatus === "401") {
      alert(__('session_expired'));
      user.logOut();
      nav.navigate(Screens.logIn);
      return;
    }
    setVehicleList(data.vehicleList)
  };

  const getOffer = (id) => {
    setVehicleId(id);
    if (!offerLocation || !offerTime) {
      alert('Input Location or Date');
      nav.navigate(TabStackScreens.doctorStack)
    }
    setVisible(true);
  }

  const modalCancel = () => {
    setVisible(false)
  }

  const sentOffer = async () => {
    if (!offerPrice) {
      alert('Input Offer Price');
      return;
    }
    try {
      console.log('Offer Successfully Sent', vehicleId, user.fullName, offerLocation, offerTime, offerPrice)
    } catch (e) {
      Alert.alert(
          "Exception",
          e.message,
          [
            {
              text: 'OK',
              onPress: () => console.log(tag, 'onPressAdd', 'OK pressed')
            }
          ],
          {cancelable: false}
      );
    }
  }

  useEffect( () => {
    fetchData();
  }, []);

  return {
    data,
    visible, setVisible,
    vehicleId, setVehicleId,
    offerLocation, setOfferLocation,
    offerTime, setOfferTime,
    offerPrice, setOfferPrice,
    vehicleList, setVehicleList,
    fetchData,
    getOffer,
    modalCancel,
    sentOffer
  }
}

export default useViewModel;
