import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Screens, VehicleListScreens, TabStackScreens} from '@/constants/Navigation';
import AsyncStorage from '@react-native-community/async-storage'
import {useStores} from "@/hooks";
import __ from '@/assets/lang';


function useViewModel(props) {
    const tag = 'Screens::Notification';

    const nav = useNavigation(props);

    const [vehicleName, setVehicleName] = useState();

    const {user, data} = useStores();

    const fetchData = async () => {
        await data.getVehicleNumber(user.sessionToken);

        if (data.lastStatus === "401") {
            alert(__('session_expired'));
            user.logOut();
            nav.navigate(Screens.logIn);
            return;
        }
        setVehicleName(data.vehicleName)
    };

    const getIndividualData = async (id) => {
        await AsyncStorage.setItem('vehicleId', id);
        nav.navigate(VehicleListScreens.individualItem)
    }

    useEffect( () => {
        fetchData();
    }, []);

    return {
        data,
        vehicleName, setVehicleName,
        fetchData,
        getIndividualData,
    }
}

export default useViewModel;
