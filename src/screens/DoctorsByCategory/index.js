import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Button,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import __ from '@/assets/lang';
import BoardWithHeader from '@/components/Panel/BoardWithHeader';
import Space from '@/components/Space';
import {scale} from '@/styles/Sizes';
import Colors from '@/styles/Colors';
import useViewModel from './methods';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loading from '@/components/Loading';
import MapView, {PROVIDER_GOOGLE,Marker} from 'react-native-maps';
import GreyInput from '@/components/Input/GreyInput';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleButton from '@/components/Button/SimpleButton';
import * as datetime from 'node-datetime';
import DropDownPicker from "react-native-dropdown-picker";

const tag = 'Screens::Search Location';
const latitudeDelta = 0.09;
const longitudeDelta = 0.09;

const DoctorsByCategory = (props) => {
    const vm = useViewModel(props);

    return (
        <BoardWithHeader title={__('driver_search')}>
            {vm.data.isProcessing ?
                <Loading/>
                :
                <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
                    <View style={styles.calendarContainer}>
                        <TextInput style={{color: '#841584'}} value={vm.address}/>
                    </View>
                    <View style={styles.calendarContainer}>
                        <View style={{width: wp('50')}}>
                            <SimpleButton onPress={vm.showDatepicker} caption='Pick Date' >
                            </SimpleButton>
                        </View>
                        <View style={{width: wp('50')}}>
                            {!vm.bookDate ? (
                                <TextInput value={new Date().toDateString()}/>
                            ) : (
                                <TextInput value={vm.bookDate}/>
                            )}
                        </View>
                    </View>
                    <View style={styles.calendarContainer}>
                        <View style={{width: wp('50')}}>
                            <SimpleButton onPress={vm.showTimepicker} caption='Pick Time'  />
                        </View>
                        <View style={{width: wp('50')}}>
                            {!vm.bookTime ? (
                                <TextInput value={new Date().toTimeString()}/>
                            ) : (
                                <TextInput value={vm.bookTime} />
                            )}
                        </View>
                    </View>
                    <Space height={wp('1%')}/>
                    <View style={styles.calendarContainer}>
                        <View style={{width: wp('50')}}>
                            <SimpleButton caption='Spending Time'  />
                        </View>
                        <View style={{width: wp('50'), paddingRight: wp('5%')}}>
                            <TextInput placeholder='Spending Time' value={vm.spendingTime} onChangeText={vm.setSpendingTime}/>
                        </View>
                    </View>
                    <Space height={wp('1%')}/>
                    <View style={styles.container}>
                        <Button color='#841584' onPress={vm.getBook} title='book'/>
                    </View>
                    <MapView
                        style={styles.locationPicker}
                        initialRegion={vm.myInitialRegion}
                        provider={PROVIDER_GOOGLE}
                        zoomEnabled={true}
                        pitchEnabled={true}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        showsCompass={true}
                        showsBuildings={true}
                        showsTraffic={true}
                        showsIndoors={true}
                        onPress={(e) => {
                            vm.setMyInitialRegion({...e.nativeEvent.coordinate, latitudeDelta, longitudeDelta});
                        }}
                    >
                        <Marker
                            coordinate={vm.myInitialRegion}
                            title={vm.address}
                        />
                    </MapView>

                    {vm.show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={vm.date}
                            mode={vm.mode}
                            is24Hour={true}
                            minimumDate={new Date()}
                            display="spinner"
                            onChange={vm.onChange}
                        />
                    )}
                </ScrollView>
            }
        </BoardWithHeader>
    );
};

export const CategoryButton = ({image, caption, onPress}) => {
    const buttonWidth = wp('40%');
    const imageWidth = buttonWidth / 3;

    const cbStyles = StyleSheet.create({
        container: {
            width: buttonWidth,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            elevation: 10,
            shadowColor: '#ddd',
            shadowRadius: wp('1%'),
            shadowOpacity: 0.4,
            backgroundColor: '#fff',
            paddingTop: hp('2%'),
            marginVertical: wp('3%'),
        },
        caption: {
            color: '#777',
            fontWeight: 'bold',
            fontSize: hp('1.7%'),
        },
        image: {
            width: imageWidth,
        },
    });

    return (
        <TouchableOpacity style={cbStyles.container} onPress={onPress}>
            <Image source={image} style={cbStyles.image} resizeMode={'contain'}/>
            <Text style={cbStyles.caption}>
                {caption}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        flexDirection: 'column',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.grey_light,
        borderRadius: wp('1.5%'),
        alignItems: 'center',
        paddingHorizontal: wp('3%'),
        width: '100%',
        top: hp('1%'),
        zIndex: 50,
    },
    searchInput: {
        backgroundColor: 'transparent',
        marginLeft: wp('2%'),
        paddingVertical: hp('1.5%'),
        fontSize: hp('2%'),
    },
    locationPicker: {
        width: wp('100%'),
        height: hp('100%'),
        // borderRadius: hp('4.5%'),
        // backgroundColor: Colors.grey_dark,
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    calendarContainer: {
        // padding: 3 * scale,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
    },
});

export default observer(DoctorsByCategory);
