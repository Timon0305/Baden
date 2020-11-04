import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage'
import Geocoder from 'react-native-geocoding';
import {
    DoctorStackScreens,
    PillStackScreens,
    Screens,
    TabStackScreens,
    VehicleListScreens,
} from '@/constants/Navigation';
import {useStores} from '@/hooks';
import {SPECIALITIES} from '@/constants/MockUpData';
import Config from '@/config/AppConfig';
import __ from '@/assets/lang';

const latitudeDelta = 0.09;
const longitudeDelta = 0.09;

function useViewModel(props) {
    const tag = 'Screens::DoctorsByCategory';
    const nav = useNavigation(props);
    const MODE = {DATE: 'DATE', TIME: 'TIME'};

    const [myInitialRegion, setMyInitialRegion] = useState({
        latitude: 24.774265,
        longitude: 46.738586,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
    });

    const [address, setAddress] = useState();
    const [bookDate, setBookDate] = useState('');
    const [bookTime, setBookTime] = useState('');
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState(MODE.DATE);
    const [spendingTime, setSpendingTime] = useState();
    const [show, setShow] = useState(false);
    const {user, data} = useStores();

    let carTypes = [];

    useEffect(() => {
        Geocoder.init('AIzaSyD8OJWvqCanCoFm8ZQM8YFOaxIlAHwUIcQ');
        Geocoder.from(myInitialRegion.latitude, myInitialRegion.longitude)
            .then(json => {
                setAddress(json.results[0].formatted_address);
            });
    } );

    const onChange = async (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'os');
        setDate(currentDate);
        if (mode === 'date') {
            setBookDate(currentDate.toDateString());
            await AsyncStorage.setItem('offerDate', currentDate.toDateString())
        } else {
            setBookTime(currentDate.toTimeString())
            await AsyncStorage.setItem('offerTime', currentDate.toTimeString().split(' ')[0])
        }
    }

    const showDatepicker = () => {
        showMode('date');
    }

    const showTimepicker = () => {
        showMode('time');
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }

    const getBook = async () => {
        if (!spendingTime) {
            alert('Input your spending time');
            return false
        }
        await AsyncStorage.setItem('spendingTime', spendingTime);
        await AsyncStorage.setItem('offerLocation', address);
        await AsyncStorage.setItem('latlng', myInitialRegion.latitude + ',' + myInitialRegion.longitude)
        nav.navigate(TabStackScreens.vehicleLists)
    }

    return {
        user, data,
        address, setAddress,
        date, setDate,
        mode, setMode,
        show, setShow,
        bookDate, setBookDate,
        bookTime, setBookTime,
        MODE,
        spendingTime, setSpendingTime,
        myInitialRegion, setMyInitialRegion,
        showDatepicker,
        showTimepicker,
        showMode,
        onChange,
        getBook,
        carTypes
    };
}

export default useViewModel;
