import React, {Component} from 'react';
import {Grid, Button} from 'semantic-ui-react';
import _ from 'lodash'
import axios from 'axios'
import md5 from 'md5'
import {Redirect} from 'react-router'
import request from 'request'
import WalletTopUpPlans from './WalletTopUpPlans'
import {connect} from 'react-redux'
import config from '../../config/index'

console.log('config in molPay= ', config);

var pageBodyStyle = {
  maxWidth: 500,
  margin: 'auto'
}

class MolPay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      molUrl : "https://sandbox-api.mol.com/payout/payments",
      molUrlJava: "https://d0677600.ngrok.io/NG/molPaymentSend",
      molUrlLocal: config.paymentRequestApi,  //"https://f07932ef.ngrok.io/mol/molpaymentrequest",
      applicationName: 'NearGroup_api',
      applicationCode: '0xvon0HvIZlmyc2P0WY5QTmH5gncMqPu',
      Secret_Key: 'xcaLKxZafwIJd1zmxtv5nqJZ5GK1gNmR',
      referenceId: "TRX",
      version: 'v1',
      amount: '',
      currencyCode: '',
      returnUrl: 'https://53fe5173.ngrok.io'+"paymentSuccess?referenceId=",
      description: 'NearGroup payment test',
      customerId: 'a67eddb1eda142b899a0198074d5bfc9',
      channelId: '1353613228059636',
      signature: '',
      paymentUrl: '',
      otherOptionsLoading: false,
      carrierBillingLoading: false,
    }

    this.initiateMolPayment = this.initiateMolPayment.bind(this)
    this.getRandomInt = this.getRandomInt.bind(this)
    this.getAmountCurrency = this.getAmountCurrency.bind(this)
  }

  componentWillMount(){

  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));

  }

  initiateMolPayment(e, type) {
    console.log('in initiateMolPayment', );
    let state = this.state
    let {returnUrl, referenceId,  signature,  amount, currencyCode} = state

    //for live build get channelId and customerId from store.
    //only carrier billing configured for testing.
    let {customerId, channelId} = this.props.paymentData
    console.log('got customerId and channelId for mol from store=', customerId, channelId);

    let body = {}
    switch (type) {
      case "CARRIER_BILLING":
        console.log('in carrier billing', type);
         body = {
          chid: channelId,
          chauth: customerId,
          paymentType: type
        }
        this.setState({carrierBillingLoading: true})
        break;
      case "OTHER_OPTIONS":
        console.log('in other options');
        body = {
          val: "1f9978080c8188e9bcc9111b2888d164",
          ht: "USD 2",
          chid: channelId,
          chauth: customerId,
          paymentType: type,
          amount: amount,
          currencyCode: currencyCode
        }
        this.setState({otherOptionsLoading: true})
        break;
      default:

    }

    // referenceId = state.referenceId + state.channelId + Math.floor(Date.now())
    // console.log('referenceId raw=', referenceId);
    // returnUrl = state.returnUrl + '' + referenceId
    // console.log('returnUrl raw=', returnUrl);
    // signature = state.amount  +  state.applicationCode  +  state.currencyCode  +  state.customerId  +  state.description
    // + referenceId  + returnUrl  + state.version  + state.Secret_Key
    // console.log('signature raw=', signature);
    // signature = md5(signature)
    // console.log('signature md5=', signature);
    // this.setState({referenceId, returnUrl, signature}, () => {
    //   console.log('new state set', this.state);
    // })

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
        window.location = url
      } else {
        console.log('mol response error');
      }
    })
    .catch(e => {
      console.log('mol payment request error ', e);
      throw Error(e)
    })

  }

  getAmountCurrency(data) {
    this.setState({amount: data.amount, currencyCode: data.currencyCode})
  }

  componentWillReceiveProps(nextProps) {
    console.log('will receive props ', nextProps);
    this.setState({customerId: nextProps.customerId, channelId: nextProps.channelId})
  }

  render() {
    console.log('molPay render', this.state, this.props);
    let state = this.state
    let showOtherOptionsButton = state.amount != 0 && state.currencyCode != ''

    return (
      <div style={pageBodyStyle}>
        <Grid container style={{marginTop: 50}}>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center" verticalAlign="middle" style={{marginTop: 50}}>
              <h3 style={{fontWeight: 500}}>Select your payment method:</h3>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            {/*
              <Grid.Column width={8} textAlign="center" verticalAlign="middle" >
              <h3>TopUp via Carrier Billing:</h3>
            </Grid.Column>
            **/}
            <Grid.Column width={16} textAlign="center" verticalAlign="middle">
              <Button size="big" content="Carrier Billing" basic color="red"
              loading={this.state.carrierBillingLoading}  onClick={e => this.initiateMolPayment(e, "CARRIER_BILLING")} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center" verticalAlign="middle">
              <h3 style={{fontWeight: 500}}>Or</h3>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
              <WalletTopUpPlans getAmount={this.getAmountCurrency} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
            {
              showOtherOptionsButton &&

              (<Button size="big" content="zGold points/Paypal/Prepaid Cards etc" basic color="red"
              loading={this.state.otherOptionsLoading} onClick={e => this.initiateMolPayment(e, 'OTHER_OPTIONS')} />)
            }
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={16} textAlign="left">
              {state.paymentUrl != '' && <Redirect to={state.paymentUrl} />}
            </Grid.Column>
          </Grid.Row>
          {/**
            <Grid.Row>
            <Grid.Column width={16} textAlign="left">
              You have {state.totalCoins} Coins in your Wallet
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}  textAlign="center">
              <strong>Account History</strong>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}  textAlign="center">
              <Grid>
                {
                  !_.isEmpty(state.accountHistory) &&
                    state.accountHistory.map((item, index) =>
                      (
                        <Grid.Row key={index}>
                          <Grid.Column width={4} textAlign="left">
                            <h3>{item.date}</h3>
                          </Grid.Column>
                          <Grid.Column width={8} textAlign="left">
                            <h3>{item.description}</h3>
                          </Grid.Column>
                          <Grid.Column width={4} textAlign="left">
                            <h3>{item.coinCount}</h3>
                          </Grid.Column>
                        </Grid.Row>
                      )
                    )
              }
              </Grid>
            </Grid.Column>
          </Grid.Row>
        **/}
        </Grid>
      </div>
    )
  }

}

function mapStateToProps(state) {
  console.log('in index mapStateToProps ', state );
  return {
    paymentData: state.payment
  }
}


export default connect(mapStateToProps)(MolPay);
