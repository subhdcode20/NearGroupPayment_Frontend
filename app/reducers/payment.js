import * as types from '../actions/types';

var initialState = {
  customerId: '',
  channelId: '',
  howToInviteFriends: "m.me/neargroup?ref=R_",
  showShareLink: false,
  loadingCoinHistory: true,
  showCoinDetails: true,
  user: {
    name: ''
  },
  paymentMethod: ''
}

export default (state=initialState, action) => {
    switch (action.type) {
        case "SET_CUSTOMERID":
            console.log('SET_CUSTOMERID = ', action.payload);
            return {...state, customerId: action.payload};
        case "SET_CHANNELID":
            console.log('SET_CHANNELID = ', action.payload);
            return {...state, channelId: action.payload};
        case "SET_COINS_DETAILS":
            console.log('SET_COINS_DETAILS = ', action.payload);
            let data = action.payload
            let {user} = state
            user.name = data.userName
            return {
              ...state,
              accountHistory: data.coinsDetails,
              totalCoins: data.totalCoins,
              howToInviteFriends: state.howToInviteFriends + data.inviteCode,
              showShareLink: true,
              loadingCoinHistory: false,
              showCoinDetails: true,
              user: user
            };
            break;
          case "SET_PAYMENT_METHOD":
            return {
              ...state,
              paymentMethod: action.payload
            }
        default:
            return state;
    }
};
