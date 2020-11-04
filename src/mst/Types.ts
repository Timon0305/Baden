import {types} from 'mobx-state-tree';
import {isString} from 'lodash';
// import moment, {Moment} from 'moment';

export const defString = types.optional(types.string, '', [null, undefined]);
export const defNumber = types.optional(types.number, 0, [null, undefined]);
export const defObjString = types.optional(types.string, '{}', [null, undefined]);

export const VehicleName = types.model('VehicleName', {
    id: types.string,
    name: types.string,
    carUrl: types.string,
    number: types.number
})

export const VehicleList = types.model('VehicleList', {
    id: types.string,
    name: types.string,
    vehicleName: types.string,
    carUrl: types.string,
    address: types.string,
    location: types.string,
    distance: types.string,
    duration: types.string,
});

export const OfferSentList = types.model('OfferSentList', {
    clientId: defString,
    vehicleId: defString,
    offerLocation: defString,
    offerGeocoder: defString,
    offerTime: defString,
    offerPrice: defString,
    offerStatus: defString,
});

export const ReviewAuthor = types.model('ReviewAuthor', {
    fullName: defString,
    createdAt: defString,
    avatarUrl: defString,
});

export const Review = types.model('Review', {
    rating: defNumber,
    description: defString,
});

export const ReviewDetails = types.model('Review', {
    author: ReviewAuthor,
    rating: defNumber,
    description: defString,
});
export const Hospital = types.model('Hospital', {
    name: defString,
    location: defString,
    description: defString,
    images: types.array(defString)
});
export const AvailableTime = types.model('AvailableTime', {
    from: defNumber,
    to: defNumber,
});

export const Doctor = types.model('Doctor', {
    id: defString,
    fullName: defString,
    avatarUrl: defString,
    email: defString,
    phoneNumber: defString,
    street: defString,
    city: defString,
    country: defString,
    speciality: defString,
    language: defString,
    reviews: types.array(Review),
    availableTime: AvailableTime,
});

export const Speciality = types.model('Speciality', {
    id: defString,
    value: defString,
    label: defString,
    iconUrl: defString
});

export const DoctorDetails = types.model('DoctorDetails', {
    id: defString,
    fullName: defString,
    avatarUrl: defString,
    email: defString,
    phoneNumber: defString,
    street: defString,
    city: defString,
    country: defString,
    speciality: defString,
    language: defString,
    hospital: Hospital,
    reviews: types.array(ReviewDetails),
    availableTime: AvailableTime,
});

export default {
    defString,
    defNumber,
    defObjString,
    OfferSentList,
    VehicleList,
    Doctor,
};
