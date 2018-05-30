var apiBaseUrl= 'https://1c9c8bc2.ngrok.io'
var apiBaseUrlJava= 'https://test.neargroup.me/ng' //'https://web.neargroup.me/ng'  //'https://pay.neargroup.me'  //'https://3d30641b.ngrok.io'
// var apiBaseUrlJavaLive = 'https://pay.neargroup.me'
var reactClientBaseUrl = 'https://test.neargroup.me'  //'http://pay.neargroup.me'

module.exports = {
  paymentRequestApi: apiBaseUrlJava + "/molPaymentSend",
  payemntResultApi: apiBaseUrlJava + '/molPaymentSuccess',  //apiBaseUrl + "/mol/molpaymentsuccess?referenceId=",
  getUserCoinsDetails: apiBaseUrlJava + "/getCoinHistory?channelId=",    //apiBaseUrl + "/mol/usercoinsdetails?customerId=",
  getUserCoins: apiBaseUrlJava + '/getUserCoins?channelId=',
  getTransactionHistory: apiBaseUrlJava + '/getTransactionHistory?channelId=',
  MolReturnUrl: reactClientBaseUrl + '/?referenceId=',  //'/?channelId=', //'/?get_payment_status=true&referenceId=',
  MyCoinsUrl: reactClientBaseUrl + '/?channelId=',
  getImageUrl: "http://pay.neargroup.me/PaymentPageImages/",
  env: 'production'
}
