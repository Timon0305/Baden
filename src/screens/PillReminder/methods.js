import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import { PillStackScreens} from '@/constants/Navigation';
import {useStores} from "@/hooks";
import ReactNativeAN from 'react-native-alarm-notification';
import __ from '@/assets/lang';
import {mockCards} from '@/constants/MockUpData';

function useViewModel(props) {
  const tag = 'Screens::PillReminder';

  const nav = useNavigation(props);

  const [myCard, setMyCard] = useState();
  const {user, data} = useStores();

  const fetchCard = async () => {
    setMyCard(mockCards)
  }

  const selectCard = (id) => {
    if (id === 1) {
      nav.navigate(PillStackScreens.visaPay)
    } else if (id === 3) {
      nav.navigate(PillStackScreens.masterPay)
    } else {
      nav.navigate(PillStackScreens.madaPay)
    }

  }

  useEffect(() => {
    fetchCard()
  }, [])

  return {
    myCard, setMyCard,
    user, data,
    fetchCard,
    selectCard
  }
}

export default useViewModel;
