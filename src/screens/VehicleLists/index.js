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

const VehicleLists = (props) => {
    const vm = useViewModel(props);

    return (
        <BoardWithHeader title={__('driver_list')} onSwipeUp={vm.fetchData}>
            {vm.data.isProcessing ?
                <Loading/>
                :
                <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
                    <Space height={hp('1%')}/>
                    {vm.vehicleName && vm.vehicleName.length ? vm.vehicleName.map((item, index) => {
                            return (
                                <View key={index} style={{alignSelf: 'stretch', flex: 1}}>
                                    <NotificationCard
                                        vehicle={item}
                                        key={index}
                                        onPress={() => vm.getIndividualData(item.id)}
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
                    <Space height={hp('3%')}/>
                </ScrollView>
            }

        </BoardWithHeader>

    );
};

export const NotificationCard = ({vehicle, onPress}) => {
    const renderContent = () => {
        return (
            <View style={styles.vehicleDesc}>
                <TouchableOpacity onPress={onPress}>
                    <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.vehicleName} numberOfLines={1}>{vehicle.name}</Text>
                        <Text style={{fontSize:wp('4.8%'), paddingRight: wp('3%')}}>{vehicle.number}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

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
        alignSelf: 'stretch',
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
        borderColor: Colors.blue1,
        alignContent: 'center',
    },
});

export default observer(VehicleLists);
