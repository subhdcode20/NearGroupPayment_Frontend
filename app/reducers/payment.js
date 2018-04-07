import * as types from '../actions/types';

export default (state = {
  customerId: '',
  channelId: ''
}, action) => {
    switch (action.type) {
        case "SET_CUSTOMERID":
            return {...state, customerId: action.payload};
        case "SET_CHANNELID":
            return {...state, channelId: action.payload};
        default:
            return state;
    }
};
