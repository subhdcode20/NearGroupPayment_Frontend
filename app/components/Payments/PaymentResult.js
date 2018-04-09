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

  }

  componentWillMount() {
    console.log('payment result will mount props=', this.props);
    let queryParams = querystring.parse(this.props.location.search)
    let db_id = queryParams.referenceId
    this.setState({db_id: db_id})
    let getStatusUrl = config.payemntResultApi + db_id  // "https://4bc947c2.ngrok.io/mol/molpaymentsuccess?referenceId=" + db_id
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
