import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {DoctorStackScreens, PillStackScreens, Screens} from '@/constants/Navigation';
import {useStores} from "@/hooks";
import {SPECIALITIES} from '@/constants/MockUpData';
import Config from '@/config/AppConfig';
import __ from '@/assets/lang';

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

function useViewModel(props) {
  const tag = 'Screens::DoctorsByCategory';

  const nav = useNavigation(props);

  const [myInitialRegion, setMyInitialRegion] = useState({
      latitude: 24.774265,
      longitude: 46.738586,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
  });
  const [address] = useState('');
  const {user, data} = useStores();


  const handleSearchByCategory = async (category) => {
    await data.fetchDoctorsByCategory(user.sessionToken, category);
    console.log(tag, 'SELECT_CATEGORY', category);
    if (data.lastStatus === '401') {
      nav.navigate(Screens.logIn);
      user.logOut();
      alert(__('session_expired'));
    } else {
      nav.navigate(DoctorStackScreens.doctors);
    }
  };



  return {
    data,
    myInitialRegion, setMyInitialRegion,
    handleSearchByCategory,
  }
}

export default useViewModel;
