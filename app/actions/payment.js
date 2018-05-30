export const setCustomerId = (data) => {
    return {
        type: "SET_CUSTOMERID",
        payload: data
    };
}

export const setChannelId = (data) => {
    return {
        type: "SET_CHANNELID",
        payload: data
    };
}

export const setCoinsDetails = (data) => {
    return {
        type: "SET_COINS_DETAILS",
        payload: data
    };
}

export const setPaymentMethod = (data) => {
    return {
        type: "SET_PAYMENT_METHOD",
        payload: data
    };
}
