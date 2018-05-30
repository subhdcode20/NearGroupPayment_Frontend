import React, {Component} from 'react';
import {Grid, Segment, Button, Loader, Message} from 'semantic-ui-react';
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
import querystring from 'query-string'
import { withRouter } from 'react-router'
import {Redirect} from 'react-router'
import CoinSummary from './coinSummary'
import {connect} from 'react-redux'
import {setCustomerId, setChannelId, setCoinsDetails} from '../../actions/payment'
import config from '../../config/index'
import RaisedButton from 'material-ui/RaisedButton';
import MolPaymentResult from './PaymentResult'

let storage = window.localStorage
console.log("LOCALSTORAGE = ", storage.getItem("userName"));


var segmentStyle={
  paddingBottom: 20,
  width: '100%'
}

var pageBodyStyle = {
  maxWidth: 500,
  margin: 'auto'
}

var textStyle = {
  fontSize: 12
}

class PaymentsIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      getCoinsDetailsLocalUrl: config.getUserCoinsDetails,  //"http://localhost:4040/mol/usercoinsdetails?customerId=",
      getUserCoins: config.getUserCoins,
      getTransactionHistory: config.getTransactionHistory,
      user: {
        name: ''
      },
      totalCoins: 0,
      accountHistory: [],
      howToUseCoins: {
        Gift: 'Give Coins to your chatmate as gifts',
        Reveal: 'Reveal your chatmate\'s identity',
        Reconnect: 'Send reconnect request to chatmate'
      },
      howToEarnCoins: [
        'Joining bonus: 25 coin',
        'Invite Friends to NG: 2 coins (per friend)',
        'Get 4 or 5 Star from chatmate: 1 coin',
        'Quick Disconnection: -1 Coin',
        '2-day consecutive usage: 5 coins',
        '4-day consecutive usage: 10 coins',
        '1st long chat: 5 coin',
        '5th long chat: 10 coins',
        '10th long chat: 25 coins',
        '20th long chat: 50 coins',
        '50th long chat: 100 coins',
        '100th long chat: 250 coins'
      ],
      howToLoseCoins: [
        // 'Quick Disconnection: 1 Coin',
        // 'Get 1 or 2 Star from chatmate: 1 Coin'
      ],
      howToInviteFriends: "m.me/neargroup?ref=R_",
      purchaseRate: [
        {coins: 50, amount: 2},
        {coins: 300, amount: 10},
        {coins: 750, amount: 20},
      ],
      purchaseOption: 'Purchase Option here',
      redirectToPayment: false,
      showShareLink: false,
      loadingCoinHistory: true,
      showCoinDetails: true,
      showPaymentResult: false,
      referenceId: ''
    }
    this.handleTopUpPage = this.handleTopUpPage.bind(this)
    this.testJavaCors = this.testJavaCors.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
  }

  handleTopUpPage() {
    this.setState({redirectToPayment: true})
  }

  componentWillMount() {
    let queryParams = querystring.parse(this.props.location.search)
    console.log('queryParams in  will mount = ', queryParams, this.props);

    let userName = storage.getItem("userName")
    let totalCoins = storage.getItem("totalCoins")
    let inviteCode = storage.getItem("inviteCode")

    if(userName != undefined && totalCoins != undefined && inviteCode != undefined) {
      console.log('using localStorage data---');
      let {user} = this.state
      user["name"] = userName
      this.setState({user, totalCoins: totalCoins, inviteCode: inviteCode , loadingCoinHistory: false})
    }

    if(queryParams.referenceId && queryParams.referenceId != "") {
      console.log('got get_payment_status =', queryParams);
      this.setState({showPaymentResult: true, referenceId: queryParams.referenceId}, ()=>{
        console.log('showPaymentResult state set', this.state);
      })
    } else {
      console.log('got channelId-', queryParams);

    let channelId = queryParams.channelId
    let {getCoinsDetailsLocalUrl, getUserCoins, getTransactionHistory} = this.state
    let that = this
    // let getCoinsDetailsUrl =  "https://06489a03.ngrok.io/NG/getCoinHistory?channelId=" + channelId   //d65ac649d9f54ed1853c1bd3ddd0e693
    getCoinsDetailsLocalUrl += channelId
    getUserCoins += channelId
    getTransactionHistory += channelId
    this.props.dispatch(setCustomerId(channelId))
    console.log('getCoinsDetailsLocalUrl= ', getCoinsDetailsLocalUrl);
    console.log('getUserCoins= ', getUserCoins);
    console.log('getTransactionHistory= ', getTransactionHistory);
// getCoinsDetailsLocalUrl
    axios.get(getUserCoins)
    .then((response) => {
      console.log('mol get coin details response = ', response);

      if(response.data['Grant Access']) {
        console.log('mol response success');
        let {user} = that.state
        user.name = decodeURI(response.data.userName)
        storage.setItem("userName" , response.data.userName)
        storage.setItem("totalCoins" , response.data.totalCoins)
        storage.setItem("inviteCode" , response.data.inviteCode)
        console.log('storage= ', window.localStorage);
        // let coinsDetails = JSON.parse(response.data.data)
        // console.log('coinsDetails= ', coinsDetails)
        // response.data['coinsDetails'] = coinsDetails
        console.log('decoded name=', decodeURI(response.data.userName));
        // accountHistory: coinsDetails,
        that.setState({
          totalCoins: response.data.totalCoins,
          howToInviteFriends: that.state.howToInviteFriends + response.data.inviteCode,
          showShareLink: true,
          loadingCoinHistory: false,
          showCoinDetails: true,
          user: user
        }, () => {
          console.log('result state set', this.state);
        })
        // this.props.dispacth(setCustomerId(channelId))
        that.props.dispatch(setChannelId(response.data.channelId))
        that.props.dispatch(setCoinsDetails(response.data))
      } else {
        console.log('mol payment result response error');
        that.setState({loadingCoinHistory: false, showCoinDetails: false})
      }
    })
    .catch(e => {
      console.log('mol get coins details error ', e);
      that.setState({loadingCoinHistory: false, showCoinDetails: false})
    })

    this.getTransactions(getTransactionHistory)

  }
  }

  getTransactions(url) {
    console.log('getTransactions= ', url);
    let that = this

    axios.get(url)
    .then((response) => {
      console.log('mol get transaction details response = ', response);

      if(response.data['Grant Access']) {
        console.log('get transaction success= ', response.data);
        // let {user} = that.state
        // user.name = decodeURI(response.data.userName)
        let coinsDetails = JSON.parse(response.data.data)
        console.log('coinsDetails= ', coinsDetails)
        // response.data['coinsDetails'] = coinsDetails
        // console.log('decoded name=', decodeURI(response.data.userName));
        that.setState({
          accountHistory: coinsDetails,
          // totalCoins: response.data.totalCoins,
          // howToInviteFriends: that.state.howToInviteFriends + response.data.inviteCode,
          // showShareLink: true,
          // loadingCoinHistory: false,
          // showCoinDetails: true,
          // user: user
        }, () => {
          console.log('result transaction state set', this.state);
        })
        // this.props.dispacth(setCustomerId(channelId))
        that.props.dispatch(setChannelId(response.data.channelId))
        // that.props.dispatch(setCoinsDetails(response.data))
      } else {
        console.log('mol transaction result response error');
        that.setState({loadingCoinHistory: false, showCoinDetails: false})
      }
    })
    .catch(e => {
      console.log('mol get transaction details error ', e);
      that.setState({loadingCoinHistory: false, showCoinDetails: false})
    })

  }

  testJavaCors(e) {
    console.log('in testJavaCors');
    axios.get("https://9ce00ced.ngrok.io/NG/molPaymentSuccess?referenceId=TRX1523434930105")
    .then(response => {
      console.log('test cors response= ', response);
    })
    .catch(e => {
      console.log('test cors e= ', e);
    })
  }

  // {
  //   state.showPaymentResult ?
  //   (<MolPaymentResult referenceId={state.referenceId}/>)
  //   :
// }

  render() {
    let state = this.state
    let props = this.props
    console.log('index render props', state, props);
    let testDecode = "added 12 friend"
    //for testing
    // state.showCoinDetails = true
    // console.log('unescape = ', unescape("\u06CC\u0626\u062F\u0646\u0633\u0633\u0679\u06CC\u0646 \u062A\u0628\u062F\u06CC\u0644\u06CC"), unescape(state.user.name.toString()));
    // {escape(JSON.parse('"\u06CC\u0626\u062F\u0646\u0633\u0633\u0679\u06CC\u0646 \u062A\u0628\u062F\u06CC\u0644\u06CC"'))}
    // <br />
    // {decodeURIComponent(JSON.parse('"' + testDecode.replace(/\"/g, '\\"') + '"') ) }
    // <br />
    // {decodeURIComponent(JSON.parse('"http\\u00253A\\u00252F\\u00252Fexample.com"'))}

    if(state.showPaymentResult) {
      console.log('ppp showPaymentResult');
      return (
        <div style={pageBodyStyle}>
          <MolPaymentResult referenceId={state.referenceId}/>
        </div>)
    } else {

    console.log('ppp show coin history');
    return (
      <div style={pageBodyStyle}>
      {
        state.showPaymentResult ?
        (<MolPaymentResult referenceId={state.referenceId}/>)
        :

        <Grid container>
          {
            state.loadingCoinHistory
            ?
            (<Loader style={{marginTop: 50}} active inline='centered' /> )
            :

            state.showCoinDetails ?
            (<CoinSummary accountHistory={state.accountHistory} totalCoins={state.totalCoins} user={state.user}
              loadingCoinHistory={this.state.loadingCoinHistory}
            />)
            :
            (<Message style={{marginTop: 50, width:"100%"}}>
              <p >
                There seems to a problem. Your coins details could not be fetched.
              </p>
            </Message>)
        }



        {/**
          <Grid.Row>
          <Grid.Column width={16}>
            <Button content="test cors" onClick={this.testJavaCors} />
          </Grid.Column>
        </Grid.Row> **/}

          {/** how to use coins **/}
          {/**
            <Segment style={segmentStyle}>
          <Grid.Row>
            <Grid.Column width={16}>
              <h3><strong>How to use Coins?</strong></h3>
            </Grid.Column>
            <Grid.Column width={16}>
              <Grid style={{marginTop: 5}}>
                {
                  !_.isEmpty(state.howToUseCoins) &&
                    Object.keys(state.howToUseCoins).map((item, index) =>
                      (
                        <Grid.Row key={index} style={{padding: 2}}>

                          <Grid.Column width={16} textAlign="left"
                          style={{paddingTop: 5, marginTop: index == (state.howToUseCoins.length-1) ? 10 : 0 }}>
                            <p style={textStyle}>{_.capitalize(item)}: {state.howToUseCoins[item]}</p>
                          </Grid.Column>

                        </Grid.Row>
                      )
                    )
                }
              </Grid>
            </Grid.Column>
          </Grid.Row>
          </Segment>
          <Segment style={segmentStyle}>
          <Grid.Row>
            <Grid.Column width={16}>
              <h3><strong>How to earn Coins?</strong></h3>
            </Grid.Column>
            <Grid.Column width={16}>
              <Grid style={{marginTop: 5}}>
                {
                  !_.isEmpty(state.howToEarnCoins) &&
                    state.howToEarnCoins.map((item, index) =>
                      (
                        <Grid.Row key={index} style={{padding: 2}}>

                          <Grid.Column width={16} textAlign="left" style={{paddingTop: 5}}>
                            <p style={textStyle}>- {item}</p>
                          </Grid.Column>

                        </Grid.Row>
                      )
                    )
              }
              </Grid>
            </Grid.Column>
          </Grid.Row>
          </Segment>
          {
            state.showShareLink &&
              (<Grid.Row>
              <Grid.Column width={16}>
                <h3><strong>How to Invite Friends</strong>? Share this msg to as many:</h3>
              </Grid.Column>
              <Grid.Column width={16}>
                <p style={textStyle}><i><a href={state.howToInviteFriends} style={{textDecoration: 'none', fontSize: 15, }}>{state.howToInviteFriends}</a></i></p>
              </Grid.Column>
            </Grid.Row>)
          }
          <Grid.Row>
            <Grid.Column width={16}>
              {state.redirectToPayment && <Redirect to="/payment" />}
            </Grid.Column>
          </Grid.Row>
        ***/}
          </Grid>
        }
      </div>
    )
  }
  }

}

function mapStateToProps(state) {
  console.log('in index mapStateToProps ', state );
  return {
    paymentData: state.payment
  }
}

export default withRouter(connect(mapStateToProps)(PaymentsIndex));
