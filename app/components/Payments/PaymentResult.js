import React, {Component} from 'react';
import {Grid, Button} from 'semantic-ui-react';
import _ from 'lodash'
import axios from 'axios'
import md5 from 'md5'
import {Redirect} from 'react-router'
import request from 'request'
import WalletTopUpPlans from './WalletTopUpPlans'

class MolPaymentResult extends Component {
  constructor(props) {
    super(props)
    this.state = {
      molUrl : "https://sandbox-api.mol.com/payout/payments",
      molUrlJava: "https://d0677600.ngrok.io/NG/molPaymentSend",
      molUrlLocal: "http://localhost:4040/mol/molpaymentrequest",
      applicationName: 'NearGroup_api',
      applicationCode: '0xvon0HvIZlmyc2P0WY5QTmH5gncMqPu',
      Secret_Key: 'xcaLKxZafwIJd1zmxtv5nqJZ5GK1gNmR',
      referenceId: "TRX",
      version: 'v1',
      amount: 0,
      currencyCode: '',
      returnUrl: 'https://db9368ac.ngrok.io/'+"paymentSuccess?referenceId=",
      description: 'NearGroup payment test',
      customerId: 'ac5d27e764d645edb3f9a90e5e3fb51b',
      channelId: ''+this.getRandomInt(999),
      signature: '',
      paymentUrl: '',
      otherOptionsLoading: false,
      carrierBillingLoading: false,
    }

    this.initiateMolPayment = this.initiateMolPayment.bind(this)
    this.getRandomInt = this.getRandomInt.bind(this)
    this.getAmountCurrency = this.getAmountCurrency.bind(this)
  }

  componentWillMount() {
    console.log('in will mount');
    axios.get("https://53fe5173.ngrok.io/NG/molPaymentSuccess")
    .then((response) => {
      console.log('mol payemnt result response = ', response);
      if(response.status == 200) {
        console.log('mol response success');
        // let {url} = response.data

        // window.location = url
      } else {
        console.log('mol payment result response error');
      }
    })
    .catch(e => {
      console.log('mol payment request error ', e);
      throw Error(e)
    })
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));

  }

  initiateMolPayment(e, type) {
    console.log('in initiateMolPayment', );
    let state = this.state
    let {returnUrl, referenceId, customerId, signature, channelId, amount, currencyCode} = state



    let body = {}
    switch (type) {
      case "CARRIER_BILLING":
        console.log('in carrier billing', type);
         body = {
          chid: customerId,
          chauth: channelId,
          paymentType: type
        }
        this.setState({carrierBillingLoading: true})
        break;
      case "OTHER_OPTIONS":
        console.log('in other options');
        body = {
          chid: customerId,
          val: "1f9978080c8188e9bcc9111b2888d164",
          ht: "USD 2",
          chauth: channelId,
          paymentType: type,
          amount: amount,
          currencyCode: currencyCode
        }
        this.setState({otherOptionsLoading: true})
        break;
      default:

    }



    referenceId = state.referenceId + state.channelId + Math.floor(Date.now())
    console.log('referenceId raw=', referenceId);
    returnUrl = state.returnUrl + '' + referenceId
    console.log('returnUrl raw=', returnUrl);
    signature = state.amount  +  state.applicationCode  +  state.currencyCode  +  state.customerId  +  state.description
    + referenceId  + returnUrl  + state.version  + state.Secret_Key
    console.log('signature raw=', signature);
    signature = md5(signature)
    console.log('signature md5=', signature);
    this.setState({referenceId, returnUrl, signature}, () => {
      console.log('new state set', this.state);
    })
    // let body = {
    //   chid: customerId,
    //   val: "1f9978080c8188e9bcc9111b2888d164",
    //   ht: "USD 2",
    //   chauth: channelId
    //   // applicationCode: state.applicationCode,
    //   // referenceId,
    //   // version: state.version,
    //   // amount: state.amount,
    //   // currencyCode: state.currencyCode,
    //   // returnUrl: returnUrl,
    //   // description: state.description,
    //   // customerId ,
    //   // signature,
    // }
    console.log('body=', body);
    let that = this
    axios.post(this.state.molUrlLocal,
      body,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      console.log('mol response = ', response);
      if(response.status == 200) {
        console.log('mol response success');
        let {url} = response.data
        // that.setState({paymentUrl: url}, () => {
        //   console.log('paymentUrl set=', this.state.paymentUrl);
        // })
        window.location = url
      } else {
        console.log('mol response error');
      }
    })
    .catch(e => {
      console.log('mol payment request error ', e);
      throw Error(e)
    })


// var options = { method: 'POST',
//   url: 'https://sandbox-api.mol.com/payout/payments',
//   headers:
//    {
//      'Cache-Control': 'no-cache',
//      'Access-Control-Allow-Origin': '*',
//      'Content-Type': 'application/x-www-form-urlencoded' },
//   form:
//    { applicationCode: '0xvon0HvIZlmyc2P0WY5QTmH5gncMqPu',
//      referenceId: 'TRX3401522329027278',
//      version: 'v1',
//      amount: '100',
//      currencyCode: 'usd',
//      returnUrl: 'https://b0453680.ngrok.io/NGpaymentSuccess?referenceId=TRX3401522329027278',
//      description: 'NearGroup payment test',
//      customerId: 'ac5d27e764d645edb3f9a90e5e3fb51b',
//      signature: 'c4dc94b74d26d97cd4a846b9903793ec' } };
//
// request(options, function (error, response, body) {
//   if (error) {
//     console.log("error", error);
//     throw new Error(error);}
//
//   console.log("api sucess-=",body);
// });


    // request.post({url: 'https://cors.io/?'+this.state.molUrl, form: body, function(err, response, body) {
    //   if(err) {
    //     console.log('request err=', err);
    //   }
    //   console.log('request form post response=', response);
    // }})

  }

  getAmountCurrency(data) {
    this.setState({amount: data.amount, currencyCode: data.currencyCode})
  }

  render() {
    console.log('molPay render', this.state);
    let state = this.state
    let showOtherOptionsButton = state.amount != 0 && state.currencyCode != ''

    return (
      <div>
        <Grid container style={{marginTop: 50}}>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center" verticalAlign="middle" style={{marginTop: 50}}>
              <h3 style={{fontWeight: 500}}>Fetching result:</h3>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    )
  }

}



export default MolPaymentResult;
