var apiBaseUrl= 'https://4bc947c2.ngrok.io'

module.exports = {
  paymentRequestApi: apiBaseUrl + "/mol/molpaymentrequest",
  payemntResultApi: apiBaseUrl + "/mol/molpaymentsuccess?referenceId=",
  getUserCoinsDetails: apiBaseUrl + "/mol/usercoinsdetails?customerId=",
  env: 'production'
}
