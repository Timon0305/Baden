import {applySnapshot, flow, types} from "mobx-state-tree";
import {observable} from "mobx";
import {isEmpty} from 'lodash';
import {defNumber, defString, OfferSentList, VehicleList, VehicleName, Speciality, DoctorDetails} from './Types';
import 'mobx-react-lite/batchingForReactDom';
import * as Api from '@/Services/Api';
import {Alert} from "react-native";
import Config from '@/config/AppConfig';
import ReactNativeAN from "react-native-alarm-notification";
import __ from '@/assets/lang';
import {getDriverList} from '@/Services/Api';

const tag = 'MST.Data';
let statusCode = 0;
const Data = types
  .model('Data', {
    vehicleName: types.array(VehicleName),
    vehicleList: types.array(VehicleList),
    offerSentList: types.array(OfferSentList),
    specialities: types.array(Speciality),
    lastStatus: defNumber,
    selectedDoctorId: defString,
    selectedDoctor: types.array(DoctorDetails),
  })
  .views((self) => ({

   get getVehicle() {
     return self.vehicleList
   },

    get getPills() {
      return self.pillReminders;
    },
    get getDoctors() {
      return self.doctors;
    },
    get getSelectedDoctor() {
      if (self.selectedDoctor && self.selectedDoctor.length > 0)
        return self.selectedDoctor[0];
      return null;
    }
  }))
  .actions((self) => {

    const _updateVehicleName = (data) => {
        self.vehicleName = data.vehicles;
    }

    const _updateVehicleList = (data) => {
      self.vehicleList = data.vehicles;
    };

    const _updateOfferSentList = (data) => {
      self.offerSentList = data.offers;
    };

    const getVehicleNumber = flow(function*  getVehicleNumber(
        userToken
    ) {
      self.setProcessing(true);
      try {
          const response = yield Api.getVehicleName(userToken);
          const {ok, data} = response;
          if (ok) {

              for (let i = 0; i < data.vehicles.length; i++) {
                  data.vehicles[i].carUrl = Config.appBaseUrl + data.vehicles[i].carUrl
              }
              console.log('Get Vehicle Name from Server =>>>>>>>>.', data);
            _updateVehicleName(data);
          }
          if (!ok) {
            alert(__('can_not_connect_server'));
          }
      } catch (e) {
         console.log(e.message);
      } finally {
        self.setProcessing(false)
      }
    })

    const getVehicleList = flow(function* getVehicleList(
      userToken, vehicleId, geoCoder
    ) {
      self.setProcessing(true);
      try {
        const response = yield Api.getDriverList(userToken, vehicleId, geoCoder);
        const {ok, data} = response;
        if (ok) {
          for (let i = 0; i < data.vehicles.length; i++) {
             data.vehicles[i].carUrl = Config.appBaseUrl + data.vehicles[i].carUrl
          }
          _updateVehicleList(data);
          _updateOfferSentList(data)
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        }
      } catch (e) {
      } finally {
        self.setProcessing(false);
      }
    });

    const setOfferSent = flow(function* setOfferSent(userToken, vehicleId, offerLocation, offerTime, offerGeocoder, spendingTime) {
      self.setProcessing(true);
      try {
        const response = yield Api.setOfferSent(userToken, vehicleId, offerLocation, offerTime, offerGeocoder, spendingTime);
        const {ok, data} = response;
        if (!data) {
          alert(__('can_not_connect_server'));
        }
        if (ok) {
          console.log('offer response => +++++++', data);
          _updateOfferSentList(data)
        }
      } catch (e) {

      } finally {
        self.setProcessing(false);
      }
    });

    const offerAccept = flow(function* offerAccept(userToken, vehicleId) {
        self.setProcessing(true);
        try {
            const response = yield Api.offerAccept(userToken, vehicleId);
            const {ok, data} = response;
            if (!data) {
                alert(__('can_not_connect_server'));
            }
            if (ok) {
                console.log('offer accept  response => +++++++', data);
                _updateOfferSentList(data)
            }
        } catch (e) {
            console.log('offer accept exception =>',e.message)
        } finally {
            self.setProcessing(false)
        }
    });

    const getAllOffer = flow(function* getAllOffer(userToken, vehicleId, offerLocation, offerTime, offerGeocoder, spendingTime) {
        self.setProcessing(true);
        try {
            const response = yield Api.getAllOffer(userToken, vehicleId, offerLocation, offerTime, offerGeocoder, spendingTime);
            const {ok, data} = response;
            if (!data) {
                alert(__('can_not_connect_server'));
            }
            if (ok) {
                console.log('offer all get response => +++++++', data);
                _updateOfferSentList(data)
            }
        } catch (e) {
            console.log('Get All Offer Exception =>', e.message)
        } finally {
            self.setProcessing(false);
        }
    })

    return {
      getVehicleNumber,
      getVehicleList,
      setOfferSent,
      offerAccept,
      getAllOffer,
    }
  })
  .extend((self) => {
    const localState = observable.box(false);
    return {
      views: {
        get isProcessing() {
          return localState.get();
        },
      },
      actions: {
        setProcessing(value) {
          localState.set(value)
        },
      },
    };
  });

export default Data;
