import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {PillStackScreens, Screens} from '@/constants/Navigation';
import {useStores} from "@/hooks";
import ReactNativeAN from 'react-native-alarm-notification';
import __ from '@/assets/lang';
import {mockCards} from '@/constants/MockUpData';

function useViewModel(props) {
  const tag = 'Screens::PillReminder';

  const nav = useNavigation(props);

  const [myCard, setMyCard] = useState();
  const {user, data} = useStores();

  const onPressAdd = () => {
    console.log(tag, 'onPressAdd()');
    nav.navigate(PillStackScreens.addPillReminder);
  };

  const fetchCard = async () => {
    setMyCard(mockCards)
  }

  const selectCard = () => {

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
