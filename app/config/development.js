// var apiBaseUrl= 'https://55d855b5.ngrok.io'
var apiBaseUrl= 'http://ec2-54-190-24-7.us-west-2.compute.amazonaws.com:8088'

module.exports = {
  apiBaseUrl: apiBaseUrl,
  paymentRequestApi: apiBaseUrl + "/mol/molpaymentrequest",
  payemntResultApi: apiBaseUrl + "/mol/molpaymentsuccess?referenceId=",
  getUserCoinsDetails: apiBaseUrl + "/mol/usercoinsdetails?customerId=",
}
