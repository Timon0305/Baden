import React from 'react';
import {observer} from 'mobx-react';
import {
    StyleSheet,
    TextInput,
    Modal,
    Button,
    TouchableHighlight,
    KeyboardAvoidingView,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import __ from '@/assets/lang';
import BoardWithHeader from '@/components/Panel/BoardWithHeader';
import Space from '@/components/Space';
import {scale} from '@/styles/Sizes';
import Colors from '@/styles/Colors';
import Images from '@/styles/Images';
import Separator from '@/components/Separator';
import useViewModel from './methods';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loading from '@/components/Loading';
import Swipeable from 'react-native-swipeable';
import Dialog, {DialogContent, SlideAnimation, DialogButton} from 'react-native-popup-dialog';
import {DialogFooter} from 'react-native-popup-dialog/src';
import GreyInput from '@/components/Input/GreyInput';
import * as datetime from 'node-datetime';
import BlueButton from '@/components/Button/BlueButton';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const latitudeDelta = 0.09;
const longitudeDelta = 0.09;

const Notifications = (props) => {
    const vm = useViewModel(props);

    return (
        <BoardWithHeader title={__('driver_list')} onSwipeUp={vm.fetchData}>
            {vm.data.isProcessing ?
                <Loading/>
                :
                <View style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
                    <MapView
                        style={styles.locationPicker}
                        region={vm.myLocation}
                        provider={PROVIDER_GOOGLE}
                        zoomEnabled={true}
                        pitchEnabled={true}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        showsCompass={true}
                        showsBuildings={true}
                        minZoomLevel={2}
                        maxZoomLevel={15}
                        showsTraffic={true}
                        showsIndoors={true}
                    >
                        <Marker
                            coordinate={vm.myLocation}
                            title={vm.offerLocation}
                        />
                        {vm.vehicleList && vm.vehicleList.length ? vm.vehicleList.map((item, index) => {
                            const latitude = parseFloat(item.location.split(',')[0]);
                            const longitude = parseFloat(item.location.split(',')[1]);
                            return (
                                <Marker
                                    key={index}
                                    coordinate={{latitude:latitude, longitude: longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta}}
                                    title={item.address}
                                    pinColor={'purple'}
                                />
                            )
                        }):  <Marker
                            coordinate={vm.myLocation}
                            title={vm.offerLocation}
                            pinColor={'red'}
                        />}
                    </MapView>
                    <ScrollView>
                    {vm.vehicleList && vm.vehicleList.length ? vm.vehicleList.map((item, index) => {
                            return (
                                <View key={index} style={{alignSelf: 'stretch', flex: 1, paddingLeft: wp('5%'), paddingRight: wp('5%')}}>
                                    <NotificationCard
                                        vehicle={item}
                                        data={vm.existedOffer}
                                        key={index}
                                        onPress={() => vm.getOffer(item.id)}
                                        handleDelete={() => vm.handleDelete(item.id)}
                                    />
                                    <Separator color={Colors.grey} width={2}/>
                                </View>
                            );
                        })
                        :
                        <Text style={styles.listSubTitle}>
                            {'0 ' + __('results_found')}
                        </Text>
                    }
                    </ScrollView>
                    <Space height={hp('3%')}/>
                    <View style={styles.container1}>
                        <Modal
                            animationType={'slide'}
                            transparent={false}
                            visible={vm.visible}
                            onRequestClose={() => {
                                vm.modalCancel();
                            }}>
                            {vm.vehicleList && vm.vehicleList.length ? vm.vehicleList.map((item, index) => {
                                if (item.id === vm.offerId) {
                                    return (
                                        <View key={index}>
                                            <Image source={{uri: item.carUrl}}
                                                   style={{width: wp('100%'), height: hp('30%')}}/>
                                            <KeyboardAvoidingView
                                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                                style={{padding: wp('5%')}}>
                                                <View style={styles.calendarContainer}>
                                                    <View style={styles.leftText}>
                                                        <Text>Driver Name :</Text>
                                                    </View>
                                                    <View style={styles.rightText}>
                                                        <Text style={{fontSize: hp('2%')}}>{item.name}</Text>
                                                    </View>
                                                </View>
                                                <Space height={hp('2%')}/>
                                                <View style={styles.calendarContainer}>
                                                    <View style={styles.leftText}>
                                                        <Text>Vehicle Name :</Text>
                                                    </View>
                                                    <View style={styles.rightText}>
                                                        <Text style={{fontSize: hp('2%')}}>{item.vehicleName}</Text>
                                                    </View>
                                                </View>
                                                <Separator color={Colors.grey} width={2}/>
                                                <Space height={hp('1%')}/>
                                                <View style={styles.calendarContainer}>
                                                    <View style={styles.leftText}>
                                                        <Text>Driver Location :</Text>
                                                    </View>
                                                    <View style={styles.rightText}>
                                                        <Text style={{fontSize: hp('2%')}}>{item.address}</Text>
                                                    </View>
                                                </View>
                                                <Space height={hp('1%')}/>
                                                <View style={styles.calendarContainer}>
                                                    <View style={styles.leftText}>
                                                        <Text>Offer Location :</Text>
                                                    </View>
                                                    <View style={styles.rightText}>
                                                        <Text style={{fontSize: hp('2%')}}>{vm.offerLocation}</Text>
                                                    </View>
                                                </View>
                                                <Space height={hp('1%')}/>
                                                <View style={styles.calendarContainer}>
                                                    <View style={styles.leftText}>
                                                        <Text>Distance :</Text>
                                                    </View>
                                                    <View style={styles.rightText}>
                                                        <Text>{item.distance / 1000 + 'km'}</Text>
                                                    </View>
                                                </View>
                                                <Space height={hp('2%')}/>
                                                <View style={styles.calendarContainer}>
                                                    <View style={styles.leftText}>
                                                        <Text>Duration :</Text>
                                                    </View>
                                                    <View style={styles.rightText}>
                                                        <Text>{item.duration}</Text>
                                                    </View>
                                                </View>
                                                <Space height={hp('1%')}/>
                                                <View style={styles.calendarContainer}>
                                                    <View style={styles.leftText}>
                                                        <Text>Spending Time :</Text>
                                                    </View>
                                                    <View style={styles.rightText}>
                                                        <Text>{vm.spendingTime + ' hours'}</Text>
                                                    </View>
                                                </View>
                                                <Space height={hp('1%')}/>
                                                <View style={styles.calendarContainer}>
                                                    <View style={styles.leftText}>
                                                        <Text>Offer DateTime :</Text>
                                                    </View>
                                                    <View style={styles.rightText}>
                                                        <Text>{vm.startDate}</Text>
                                                    </View>
                                                </View>
                                                <Space height={hp('1%')}/>

                                                <Separator color={Colors.grey} width={2}/>
                                                <View>
                                                    <TouchableHighlight style={styles.whiteButton}
                                                                        onPress={vm.sentOffer}
                                                                        underlayColor={Colors.blue1}>
                                                        <Text style={{textAlign: 'center'}}>
                                                            Sent Offer
                                                        </Text>
                                                    </TouchableHighlight>
                                                    <Space height={hp('2%')}/>
                                                    <TouchableHighlight style={styles.whiteButton}
                                                                        onPress={vm.modalCancel}
                                                                        underlayColor={Colors.blue1}
                                                    >
                                                        <Text style={{textAlign: 'center'}}
                                                            >Close</Text>
                                                    </TouchableHighlight>
                                                </View>
                                            </KeyboardAvoidingView>
                                        </View>
                                    );
                                }
                            }) : <Text/>
                            }

                        </Modal>
                    </View>
                </View>
            }

        </BoardWithHeader>

    );
};

export const NotificationCard = ({vehicle, onPress, data, handleDelete}) => {
    const renderContent = () => {
        let offered = false;
        let offeredItem = null;
        for (let item of data) {
            if (item.vehicleId === vehicle.id) {
                offered = true;
                offeredItem = item;
                break;
            }
        }
        return (
            <View style={styles.vehicleDesc}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.vehicleName} numberOfLines={1}>{vehicle.vehicleName}</Text>
                    {offeredItem == null ?
                        <Text/>
                        :
                        <Text>{'SAR ' +  offeredItem.offerPrice}</Text>
                    }
                </View>

                <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text>{vehicle.duration}</Text>
                    <Text>{parseInt(vehicle.distance) / 1000 + 'km'}</Text>
                    {offeredItem == null ?
                        <TouchableOpacity onPress={onPress}>
                            <Text>Get Offer</Text>
                        </TouchableOpacity>
                        :
                        <Text>
                            {offeredItem.offerStatus === 'Request' ?
                                <Text style={{color: 'red'}}>{'\u2B24'}</Text> :
                                <Text style={{color: 'blue'}}>{'\u2B24'}</Text>
                            }
                            {' ' + offeredItem.offerStatus}
                        </Text>
                    }
                </View>
            </View>
        );
    };
    const leftContent = <Text>Pull to activate</Text>;
    const rightButtons = [
        <TouchableHighlight
            style={{
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: wp('30%')
            }}
            onPress={handleDelete}
        >
        </TouchableHighlight>
    ];

    return (
        <View>
            <View style={styles.notificationContainer}>
                <Image source={{uri: vehicle.carUrl}} style={styles.notificationAvatar}/>
                {renderContent()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    calendarContainer: {
        padding: 5 * scale,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftText: {
        width: wp('30%'),
    },
    rightText: {
        width: wp('60%'),
    },
    sar: {
        position: 'absolute',
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: wp('100%'),
        // alignSelf: 'stretch',
        // backgroundColor: '#666',
    },
    notificationContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp('1.5%'),
    },
    notificationAvatar: {
        width: hp('8%'),
        height: hp('8%'),
        borderRadius: hp('0% '),
    },
    vehicleDesc: {
        marginLeft: wp('4%'),
        flex: 1,
    },
    vehicleName: {
        fontWeight: 'bold',
        fontSize: hp('2.6%'),
    },
    notificationDescText: {
        fontSize: hp('1.7%'),
        lineHeight: hp('2.8%'),
    },
    listSubTitle: {
        fontWeight: 'bold',
        fontSize: wp('5%'),
        padding: wp('5%')
    },
    container1: {
        padding: wp('5%'),
        width: wp('80%'),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    whiteButton: {
        backgroundColor: '#FFF',
        width: '100%',
        padding: hp('1.8%'),
        borderRadius: hp('0.5%'),
        borderWidth: 1,
        borderColor: Colors.grey,
        alignContent: 'center',
    },
    locationPicker: {
        width: wp('100%'),
        height: hp('50%'),
    },
});

export default observer(Notifications);
