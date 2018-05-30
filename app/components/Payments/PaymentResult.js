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
      referenceId: '',
      customerId: '',
      MyCoinsUrl: ''
    }
    this.handleBackToHome = this.handleBackToHome.bind(this)
  }

  componentWillMount() {
    console.log('payment result will mount props=', this.props);
    let queryParams = querystring.parse(this.props.location.search)
    let referenceId = this.props.referenceId  //queryParams.referenceId
    this.setState({referenceId: referenceId})
    let getStatusUrl = config.payemntResultApi //+ referenceId  // "https://4bc947c2.ngrok.io/mol/molpaymentsuccess?referenceId=" + referenceId
    console.log('getStatusUrl = ', getStatusUrl);
    let body = {
      referenceId: referenceId
    }
    let that = this
    axios.post(getStatusUrl, body, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      that.setState({loading: false}, () => {
        console.log('loading removed ', this.state);
      })
      console.log('mol payemnt result response = ', response);
      if(response.status == 200) {
        console.log('mol response success');
        that.setState({paymentResult: response.data, customerId: response.data.res_json.customerId}, () => {
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
                <h2 style={{color: '#199aab'}}><strong>Payment Successful!</strong></h2>
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
                <p>{Number(data.res_json.amount)/100} {data.res_json.currencyCode}</p>
              </Grid.Column>
              <Grid.Column textAlign="right" verticalAlign="middle" width={8}>
                <p><strong>Date</strong></p>
              </Grid.Column>
              <Grid.Column textAlign="left" verticalAlign="middle" width={8}>
                <p>{moment(data.res_json.paymentStatusDate).format("D MMM Y")}</p>
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
                <h2 style={{color: '#199aab'}}><strong>Payment Incomplete!</strong></h2>
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
                <h2 style={{color: '#199aab'}}><strong>Payment Expired!</strong></h2>
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
                <h2 style={{color: '#199aab'}}><strong>Payment Failed!!</strong></h2>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )
        break;
      default:
        return null
    }
    return elem
  }

  handleBackToHome() {
    var MyCoinsUrl= window.location.origin
    console.log("in handleBackToHome, ");
    window.location = MyCoinsUrl + '/?channelId=' + this.state.customerId
    console.log("MyCoinsUrl = ", MyCoinsUrl + '/?channelId=' + this.state.customerId)
  }

  render() {
    console.log('molPay render', this.state, this.props);
    let state = this.state

    return (
      <div>
        <Grid container>
        {
          state.loading
          ?
          (<Grid.Row>
            <Grid.Column width={16} textAlign="center" verticalAlign="middle" style={{marginTop: 50}}>
              <h2 style={{color: '#199aab'}}><strong>Fetching result..</strong></h2>
            </Grid.Column>
          </Grid.Row>)
          :
          (<Grid.Row>
            <Grid.Column width={16} textAlign="center" verticalAlign="middle" style={{marginTop: 50}}>
              { !_.isEmpty(state.paymentResult) && <this.PaymentResultdisplay data={state.paymentResult} />}
            </Grid.Column>
          </Grid.Row>)
        }
        <Grid.Row>
          <Grid.Column width={16} textAlign="center" verticalAlign="middle">
            <Button content="Back to Coin History" onClick={this.handleBackToHome} size="large" circular
              style={{backgroundColor: '#e56f65',  color: '#ffffff'}}
            />
          </Grid.Column>
        </Grid.Row>
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
