import {applySnapshot, flow, types} from "mobx-state-tree";
import {observable} from "mobx";
import {isEmpty} from 'lodash';
import {defNumber, defString, OfferSentList, VehicleList, Doctor, Speciality, DoctorDetails} from './Types';
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
    const _updatePillReminders = (data) => {
      self.pillReminders = data;
    };

    const _updateVehicleList = (data) => {
      self.vehicleList = data.vehicles;
    };

    const _updateOfferSentList = (data) => {
      self.offerSentList = data.offers;
    };

    const _updateDoctors = (data) => {
      let doctors = [];
      for (let doctor of data.doctors) {
        doctor.avatarUrl = Config.appBaseUrl + doctor.avatarUrl;
        doctors.push(doctor);
      }
      self.doctors = doctors;
    };

    const getPillReminders = flow(function* updatePillReminders(
      userToken
    ) {
      self.setProcessing(true);
      try {
        // const response = yield Api.getPillReminders(userToken);
        // const {ok, data} = response;
        // self.lastStatus = response.status;
        // console.log(tag, 'Response from GetPillReminders API', typeof response.status);
        // if (ok) {
        //   _updatePillReminders(data);
        // }

        const alarms = yield ReactNativeAN.getScheduledAlarms();
        let reminders = [];
        alarms.map((alarm, index) => {
          let temp1 = alarm.data.split(';;');
          const parsedTime = parseInt(temp1[3].split('==>')[1]);

          if (parsedTime > new Date().getTime()) {
            let reminder = {
              id: alarm.id.toString(),
              medicineName: temp1[2].split('==>')[1],
              dosage: temp1[0].split('==>')[1],
              frequency: temp1[1].split('==>')[1],
              timeToTake: parsedTime.toString(),
            };
            console.log(tag, `${index} :`, alarm);
            reminders.push(reminder);
          } else {
            ReactNativeAN.deleteAlarm(alarm.id);
          }
        });
        _updatePillReminders(reminders);
      } catch (e) {
      } finally {
        self.setProcessing(false);
      }
    });

    const getVehicleList = flow(function* getVehicleList(
      userToken,
    ) {
      self.setProcessing(true);
      try {
        const response = yield Api.getDriverList(userToken);
        const {ok, data} = response;
        if (ok) {
          // console.log(tag, 'Response from GetNotifications API', data);
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

    const setOfferSent = flow(function* setOfferSent(userToken, vehicleId, offerLocation, offerTime) {
      self.setProcessing(true);
      try {
        const response = yield Api.setOfferSent(userToken, vehicleId, offerLocation, offerTime);
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

    const fetchDoctorsByCategory = flow(function* fetchDoctorsByCategory(
      userToken, category
    ) {
      self.setProcessing(true);

      try {
        const response = yield Api.searchDoctorsByCategory(userToken, category);
        const {ok, data} = response;
        self.lastStatus = response.status;
        if (ok) {
          _updateDoctors(data);
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        }
      } catch (e) {
      } finally {
        self.setProcessing(false);
      }
    });

    const searchDoctors = flow(function* searchDoctors(
      userToken, name, speciality, address
    ) {
      self.setProcessing(true);

      try {
        const response = yield Api.searchDoctors(userToken, name, speciality, address);
        const {ok, data} = response;
        self.lastStatus = response.status;
        console.log(tag, 'Response from SearchDoctors API', data);
        if (ok) {
          _updateDoctors(data);
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        }
      } catch (e) {
      } finally {
        self.setProcessing(false);
      }
    });


    const selectDoctor = (id) => {
      self.selectedDoctorId = id;
    };

    const fetchDoctorById = flow(function* fetchDoctorById(userToken, doctorId) {
      try {
        const response = yield Api.fetchDoctorById(userToken, doctorId);
        const {ok, data} = response;
        self.lastStatus = response.status;
        console.log(tag, 'Response from DoctorByID API', data);
        if (ok) {
          let {doctor} = data;
          doctor.avatarUrl = Config.appBaseUrl + doctor.avatarUrl;
          for (let i = 0; i < doctor.reviews.length; i++) {
            doctor.reviews[i].author.avatarUrl = Config.appBaseUrl + doctor.reviews[i].author.avatarUrl;
          }
          self.selectedDoctor = [doctor];
        }

        if (!data) {
          alert(__('can_not_connect_server'));
        }
      } catch (e) {

      } finally {
        self.setProcessing(false);
      }
    });

    const requestBook = flow(function* requestBook(
      userToken, doctorId, timestamp
    ) {
      try {
        const response = yield Api.requestBook(userToken, doctorId, timestamp);
        const {ok, data} = response;
        self.lastStatus = response.status;
        console.log(tag, 'Response from RequestBook API', data);
        if (ok) {
          // ReactNativeAN.sendNotification({
          //   title: `Booking Success`,
          //   message: `Your booking was successfully requested`,
          //   channel: 'Booking_Request',
          // });
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        }
      } catch (e) {

      } finally {
        self.setProcessing(false);
      }

    });

    const submitReview = flow(function* submitReview(
      userToken, doctorId, rating, description
    ) {
      self.setProcessing(true);
      try {
        const response = yield Api.submitReview(userToken, doctorId, rating, description);
        const {ok, data} = response;
        self.lastStatus = response.status;
        console.log(tag, 'Response from SubmitReview API', data);
        if (ok) {
          _updateDoctors(data);
          selectDoctor(doctorId);
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        }
      } catch (e) {

      } finally {
        self.setProcessing(false);
      }

    });

    const fetchSpecialities = flow(function* fetchSpecialities(
      userToken
    ) {
      self.setProcessing(true);
      try {
        const {data, ok, status} = yield Api.fetchSpecialities(userToken);
        self.lastStatus = status;

        if (ok) {
          let temp = [];
          console.log(tag, 'FETCH_SPECIALITY', data.specialities);
          for (let speciality of data.specialities) {
            temp.push({
              label: speciality.label,
              value: speciality.value,
              id: speciality._id,
              iconUrl: Config.specialityUrlPrefix + speciality.iconName,
            })
          }
          _updateSpecialities(temp);
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        }
      } catch (e) {

      } finally {
        self.setProcessing(false);
      }
    });

    return {
      getPillReminders,
      getVehicleList,
      setOfferSent,
      fetchDoctorsByCategory,
      searchDoctors,
      selectDoctor,
      requestBook,
      submitReview,
      fetchDoctorById,
      fetchSpecialities
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
