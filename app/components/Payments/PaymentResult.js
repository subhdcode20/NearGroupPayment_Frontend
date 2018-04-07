import React, {Component} from 'react';
import {Grid, Button, Segment} from 'semantic-ui-react';
import _ from 'lodash'
import axios from 'axios'
import md5 from 'md5'
import {Redirect} from 'react-router'
import request from 'request'
import querystring from 'query-string'
import WalletTopUpPlans from './WalletTopUpPlans'
import { withRouter } from 'react-router'
import Fa from 'react-fontawesome'
import moment from 'moment'
import {connect} from 'react-redux'
import config from '../../config/index'

class MolPaymentResult extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      loadError: false,
      paymentResult: {},
      db_id: ''
    }

    this.getPaymentStatus = this.getPaymentStatus.bind(this)
    this.getRandomInt = this.getRandomInt.bind(this)
    this.getAmountCurrency = this.getAmountCurrency.bind(this)
  }

  componentWillMount() {
    console.log('payment result will mount props=', this.props);
    let queryParams = querystring.parse(this.props.location.search)
    let db_id = queryParams.referenceId
    this.setState({db_id: db_id})
    let getStatusUrl = config.payemntResultApi  // "https://4bc947c2.ngrok.io/mol/molpaymentsuccess?referenceId=" + db_id
    console.log('getStatusUrl = ', getStatusUrl);
    let that = this
    axios.get(getStatusUrl)
    .then((response) => {
      that.setState({loading: false}, () => {
        console.log('loading removed ', this.state);
      })
      console.log('mol payemnt result response = ', response);
      if(response.status == 200) {
        console.log('mol response success');
        that.setState({paymentResult: response.data}, () => {
          console.log('result state set', this.state);
        })
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

  getPaymentStatus(e, type) {
    console.log('in getPaymentStatus', );
    // let state = this.state
    // let {returnUrl, referenceId, customerId, signature, channelId, amount, currencyCode} = state
    //
    // let body = {}
    // switch (type) {
    //   case "CARRIER_BILLING":
    //     console.log('in carrier billing', type);
    //      body = {
    //       chid: customerId,
    //       chauth: channelId,
    //       paymentType: type
    //     }
    //     this.setState({carrierBillingLoading: true})
    //     break;
    //   case "OTHER_OPTIONS":
    //     console.log('in other options');
    //     body = {
    //       chid: customerId,
    //       val: "1f9978080c8188e9bcc9111b2888d164",
    //       ht: "USD 2",
    //       chauth: channelId,
    //       paymentType: type,
    //       amount: amount,
    //       currencyCode: currencyCode
    //     }
    //     this.setState({otherOptionsLoading: true})
    //     break;
    //   default:
    //
    // }
    //
    //
    //
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
    // // let body = {
    // //   chid: customerId,
    // //   val: "1f9978080c8188e9bcc9111b2888d164",
    // //   ht: "USD 2",
    // //   chauth: channelId
    // //   // applicationCode: state.applicationCode,
    // //   // referenceId,
    // //   // version: state.version,
    // //   // amount: state.amount,
    // //   // currencyCode: state.currencyCode,
    // //   // returnUrl: returnUrl,
    // //   // description: state.description,
    // //   // customerId ,
    // //   // signature,
    // // }
    // console.log('body=', body);
    // let that = this
    // axios.post(this.state.molUrlLocal,
    //   body,
    //   {
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // )
    // .then((response) => {
    //   console.log('mol response = ', response);
    //   if(response.status == 200) {
    //     console.log('mol response success');
    //     let {url} = response.data
    //     // that.setState({paymentUrl: url}, () => {
    //     //   console.log('paymentUrl set=', this.state.paymentUrl);
    //     // })
    //     window.location = url
    //   } else {
    //     console.log('mol response error');
    //   }
    // })
    // .catch(e => {
    //   console.log('mol payment request error ', e);
    //   throw Error(e)
    // })

  }

  getAmountCurrency(data) {
    this.setState({amount: data.amount, currencyCode: data.currencyCode})
  }

  PaymentResultdisplay({data}) {
    console.log('in PaymentResultdispla = ', data);
    let elem
    switch (data.paymentStatusCode) {
      case "00":
      console.log('case 00');
        elem =  (
          <Grid container>
            <Grid.Row>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <Fa name="check-circle" size="5x" />
              </Grid.Column>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <h2>Payment Successfull!!</h2>
              </Grid.Column>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <h2>Payment Details:</h2>
              </Grid.Column>
              <Grid.Column textAlign="right" verticalAlign="middle" width={8}>
                <p><strong>PaymentId:</strong></p>
              </Grid.Column>
              <Grid.Column textAlign="left" verticalAlign="middle" width={8}>
                <p>{data.res_json.paymentId}</p>
              </Grid.Column>
              <Grid.Column textAlign="right" verticalAlign="middle" width={8}>
                <p><strong>Amount</strong></p>
              </Grid.Column>
              <Grid.Column textAlign="left" verticalAlign="middle" width={8}>
                <p>{data.res_json.amount} {data.res_json.currencyCode}</p>
              </Grid.Column>
              <Grid.Column textAlign="right" verticalAlign="middle" width={8}>
                <p><strong>Date</strong></p>
              </Grid.Column>
              <Grid.Column textAlign="left" verticalAlign="middle" width={8}>
                <p>{moment(data.res_json.paymentStatusDate).format("D M Y")}</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )
        break;
      case "01":
      console.log('case 01');
        elem = (
          <Grid container>
            <Grid.Row>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <Fa name="exclamation-triangle" size="5x" />
              </Grid.Column>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <h2>Payment Incomplete!!</h2>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )
        break;
      case "02":
      console.log('case 02');
        elem = (
          <Grid container>
            <Grid.Row>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <Fa name="times-circle" size="5x" />
              </Grid.Column>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <h2>Payment Failed as expired!!</h2>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )
        break;
      case "99":
      console.log('case 99');
        elem = (
          <Grid container>
            <Grid.Row>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <Fa name="times-circle" size="5x" />
              </Grid.Column>
              <Grid.Column textAlign="center" verticalAlign="middle" width={16}>
                <h2>Payment Failed!!</h2>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )
        break;
      default:

    }
    return elem
  }

  render() {
    console.log('molPay render', this.state, this.props);
    let state = this.state

    return (
      <div>
        <Grid container style={{marginTop: 50}}>
        {
          state.loading
          ?
          (<Grid.Row>
            <Grid.Column width={16} textAlign="center" verticalAlign="middle" style={{marginTop: 50}}>
              <h3 style={{fontWeight: 500}}>Fetching result..</h3>
            </Grid.Column>
          </Grid.Row>)
          :
          (<Grid.Row>
            <Grid.Column width={16} textAlign="center" verticalAlign="middle" style={{marginTop: 50}}>
              <Segment>
              { !_.isEmpty(state.paymentResult) && <this.PaymentResultdisplay data={state.paymentResult} />}
              </Segment>
            </Grid.Column>
          </Grid.Row>)
        }
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


export default withRouter(connect(mapStateToProps)(MolPaymentResult));
