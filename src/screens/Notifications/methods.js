import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Screens, PillStackScreens} from '@/constants/Navigation';
import {mockVehicle} from '@/constants/MockUpData';
import {useStores} from "@/hooks";
import __ from '@/assets/lang';


function useViewModel(props) {
  const tag = 'Screens::Notification';

  const nav = useNavigation(props);

  const [notifications, setNotifications] = useState();
  const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [offerLocation, setOfferLocation] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const {user, data} = useStores();

  const fetchData = async () => {
    setNotifications(mockVehicle)
    // await data.notifications(user.sessionToken);
    // console.log('mockup data', mockNotifications);
    // if (data.lastStatus === "401") {
    //   alert(__('session_expired'));
    //   user.logOut();
    //   nav.navigate(Screens.logIn);
    //   return;
    // }
    // setNotifications(data.notifications.slice())
  };

  const setNotificationAsRead = async (notificationId) => {
    console.log(tag, 'get Offer');
    // nav.navigate(MoreStackScreens.editProfile)
  };

  const getOffer = (id) => {
    console.log('get Offer', id);
    setVisible(true);
  }

  const modalCancel = () => {
    setVisible(false)
  }

  const sentOffer = async () => {
    if (!userName || !offerLocation || !offerPrice) {
      alert('Input Valid Values');
      return;
    }
    try {
      console.log('Offer Successfully Sent')
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

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    visible, setVisible,
    userName, setUserName,
    offerLocation, setOfferLocation,
    offerPrice, setOfferPrice,
    notifications,setNotifications,
    fetchData,
    setNotificationAsRead,
    getOffer,
    modalCancel,
    sentOffer
  }
}

export default useViewModel;
