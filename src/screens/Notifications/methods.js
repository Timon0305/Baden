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
  const [isModalVisible, setIsModalVisible] = useState(false)
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

  }

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    fetchData,
    notifications,
    setNotificationAsRead,
    getOffer,
  }
}

export default useViewModel;
