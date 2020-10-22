import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Geocoder from 'react-native-geocoding';
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
  const [address, setAddress] = useState();
  const {user, data} = useStores();

  useEffect( () => {
      Geocoder.init('AIzaSyD8OJWvqCanCoFm8ZQM8YFOaxIlAHwUIcQ');
      Geocoder.from(myInitialRegion.latitude, myInitialRegion.longitude)
          .then(json => {
              setAddress(json.results[0].formatted_address)
          })
  });
  return {
    user, data,
    address, setAddress,
    myInitialRegion, setMyInitialRegion,
  }
}

export default useViewModel;
