import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Screens, PillStackScreens, TabStackScreens} from '@/constants/Navigation';
import AsyncStorage from '@react-native-community/async-storage'
import {useStores} from "@/hooks";
import __ from '@/assets/lang';

const latitudeDelta = 0.09;
const longitudeDelta = 0.09;

function useViewModel(props) {
  const tag = 'Screens::Notification';

  const nav = useNavigation(props);

  const [myLocation, setMyLocation] = useState({
    latitude: 24.774265,
    longitude: 46.738586,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  })
  const [vehicleList, setVehicleList] = useState();
  const [visible, setVisible] = useState(false);
  const [offerId, setOfferId] = useState();
  const [vehicleId, setVehicleId] = useState('')
  const [offerLocation, setOfferLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [offerGeocoder, setOfferGeocoder] = useState('');
  const [existedOffer, setExistedOffer] = useState('');
  const [spendingTime, setSpendingTime] = useState('');
  const [offerStatus, setOfferStatus] = useState(false);
  const {user, data} = useStores();

  const fetchData = async () => {
    const offerLocation = await AsyncStorage.getItem('offerLocation');
    const vehicleId = await AsyncStorage.getItem('vehicleId');
    const geoCoder = await AsyncStorage.getItem('latlng');
    setMyLocation({
      latitude: parseFloat(geoCoder.split(',')[0]),
      longitude: parseFloat(geoCoder.split(',')[1]),
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    })
    await data.getVehicleList(user.sessionToken, vehicleId, geoCoder);

    if (data.lastStatus === "401") {
      alert(__('session_expired'));
      user.logOut();
      nav.navigate(Screens.logIn);
      return;
    }
    setExistedOffer(data.offerSentList)
    setVehicleList(data.vehicleList);
    setOfferLocation(offerLocation);
    setSpendingTime(await AsyncStorage.getItem('spendingTime'));
    setVisible(await AsyncStorage.getItem('vehicleId'))
    setOfferGeocoder(await AsyncStorage.getItem('latlng'));
    setStartDate(await AsyncStorage.getItem('offerDate') + ' ' + await AsyncStorage.getItem('offerTime'));
    setVehicleId (await AsyncStorage.getItem('vehicleId'));

    for (let item of data.offerSentList) {
      if (item.offerStatus === 'Accept') {
        setOfferStatus(true);
      }
    }

  };

  const getOffer = (id) => {
    setOfferId(id);
    if (!offerLocation || !startDate) {
      alert('Input Location or Date');
      nav.navigate(TabStackScreens.doctorStack)
    }
    setVisible(true);
  }

  const modalCancel = () => {
    setVisible(false)
  }

  const sentOffer = async () => {
    try {
      await data.setOfferSent(user.sessionToken, offerId,  offerLocation, startDate, offerGeocoder, spendingTime);
      setVisible(false);
      console.log('response data=>,', data.offerSentList);
      setExistedOffer(data.offerSentList)
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

  const getAllOffer = async (vehicleId) => {
    await data.getAllOffer(user.sessionToken, vehicleId, offerLocation, startDate, offerGeocoder, spendingTime)
  }

  const handleAccept = async (id) => {
    for (let item of existedOffer) {
      if (item.vehicleId === id) {
        const price = item.offerPrice;
        if (!price) {
          alert("You have to send request")
        }
        if (parseInt(price) > 0) {
          await data.offerAccept(user.sessionToken, id);
          setExistedOffer(data.offerSentList)
        } else {
          alert("You didn't receive response")
        }
      }
    }
  }

  const handleReject = (id) => {
    console.log("rejected => ",id)
  }

  useEffect( () => {
    fetchData();
  }, []);

  return {
    data,
    myLocation, setMyLocation,
    visible, setVisible,
    offerId, setOfferId,
    vehicleId, setVehicleId,
    offerLocation, setOfferLocation,
    startDate, setStartDate,
    offerGeocoder, setOfferGeocoder,
    vehicleList, setVehicleList,
    existedOffer, setExistedOffer,
    spendingTime, setSpendingTime,
    offerStatus, setOfferStatus,
    fetchData,
    getOffer,
    modalCancel,
    sentOffer,
    handleAccept,
    handleReject,
    getAllOffer
  }
}

export default useViewModel;
