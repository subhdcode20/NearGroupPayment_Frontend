import React, {Component} from 'react';
import {Table, Grid, Segment, Button, Loader, Message} from 'semantic-ui-react';
import _ from 'lodash'
import { withRouter, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import querystring from 'query-string'
import config from '../../config/index'

var textStyle = {
  color: '#37474f',
  margin: '10px 0px'
}

var tabelHeader = {
  verticalAlign: 'middle',
  border: "0.5px solid grey",
  backgroundColor: "#199aab",
  color: '#eceff1',
  padding: 0,
  height: 50
}

class CoinsSummary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        name: "Subham"
      },
      showSummaryOrHistory: 'summary',
      totalCoins: 25,
      accountHistory: [
        {
            "id": "139",
            "description": "NG Joining Bonus",
            "coins": "25",
            "time": "2018-04-08 20:18:23.0",
            "coinsStatus": "1"
        },
        {
            "id": "141",
            "transactionId": "1696922383666376",
            "description": "Gift to chatmate",
            "coins": "10",
            "time": "2018-04-08 20:19:10.0",
            "coinsStatus": "0"
        },
        {
            "id": "142",
            "description": "Reconnect Request",
            "coins": "1",
            "time": "2018-04-08 20:20:12.0",
            "coinsStatus": "0"
        },
        {
            "id": "143",
            "description": "Quick Disconnection",
            "coins": "2",
            "time": "2018-04-08 20:20:37.0",
            "coinsStatus": "0"
        },
      ],
      redirectTo: ''
    }
    this.handleDisplaySummary = this.handleDisplaySummary.bind(this)
    this.handleDisplayTopUpPlans = this.handleDisplayTopUpPlans.bind(this)
    this.handleDisplayHowToUse = this.handleDisplayHowToUse.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps=', nextProps)
    this.setState({accountHistory: nextProps.accountHistory, totalCoins: nextProps.totalCoins, user: nextProps.user})
  }

  handleDisplaySummary(data) {
    this.setState({showSummaryOrHistory: data})
  }
  handleDisplayHowToUse(data) {
    console.log('display how to use page');
    // this.setState({redirectTo: data})
  }
  handleDisplayTopUpPlans(data) {
    console.log('display topup plans page');
    // this.setState({redirectTo: data})
  }

  render() {
    let state = this.state
    let props = this.props
    // let {coinData} = this.props
    console.log("showSummaryOrHistory = ", state, props);
    return (
        <Grid>
            <Grid.Row >
                <Grid.Column width={16} textAlign="center">
                  <Grid>
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center" style={{marginTop: 50}}>
                        <h2 style={{color: '#199aab'}}><strong>{decodeURIComponent(JSON.parse('"' + state.user.name.replace(/\"/g, '\\"') + '"') ) }{/**state.user.name.toUpperCase()**/}&#8217;s NG COINS</strong></h2>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center" >
                        <Button.Group>
                          <Button onClick={e => this.handleDisplaySummary("summary")} size="large"
                            style={state.showSummaryOrHistory == "summary" ?  {backgroundColor: '#e56f65',  color: '#ffffff'} : {backgroundColor: '#ffffff', border: "0.5px solid #e56f65"}}
                          >SUMMARY</Button>
                          <Button onClick={e => this.handleDisplaySummary("history")} size="large"
                            style={state.showSummaryOrHistory == "history" ?  {backgroundColor: '#e56f65',  color: '#ffffff'} : {backgroundColor: '#ffffff', border: "0.5px solid #e56f65"}}
                          >HISTORY</Button>
                        </Button.Group>
                      </Grid.Column>
                    </Grid.Row>
                    {
                      this.state.showSummaryOrHistory == 'summary' &&

                      (<Grid.Row >
                        <Grid.Column width={16} textAlign="center" >
                          <h1 style={{fontSize: 100, color: '#199aab'}}>{state.totalCoins}</h1>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign="center" >
                          <h4 style={{color: '#199aab'}}>coins</h4>
                        </Grid.Column>
                      </Grid.Row>)
                    }
                    {
                      this.state.showSummaryOrHistory == 'history' &&

                      (<Grid.Row >
                        {
                          this.props.loadingCoinHistory ?
                          (<Grid.Column>
                            <Loader style={{marginTop: 50}} active inline='centered' />
                          </Grid.Column>)
                          :
                          (<Grid.Column width={16} textAlign="center" >
                            <Grid>
                              <Grid.Row style={{padding: 0}}>
                                <Grid.Column>
                                  <Grid>
                                    <Grid.Row>
                                      <Grid.Column width={4} style={tabelHeader}>
                                        <p style={{margin: '15px 0px'}}>DATE</p>
                                      </Grid.Column>
                                      <Grid.Column width={8} style={tabelHeader}>
                                        <p style={{margin: '15px 0px'}}>TRANSACTION</p>
                                      </Grid.Column>
                                      <Grid.Column width={4} style={tabelHeader}>
                                        <p style={{margin: '15px 0px'}}>COINS</p>
                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>
                                </Grid.Column>
                              </Grid.Row>

                              {
                                state.accountHistory.map((item, index) => (
                                  <Grid.Row key={index} style={{padding: 0, minHeight: 55, verticalAlign: 'middle'}}>
                                    <Grid.Column width={4} textAlign="center" style={{border: "0.5px solid grey"}}>
                                      <p style={textStyle}>{moment(item.time).format("D MMM")}</p>
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign="center" style={{border: "0.5px solid grey"}}>
                                      <p style={textStyle}>{decodeURIComponent(JSON.parse('"' + item.description.replace(/\"/g, '\\"') + '"') ) }</p>
                                    </Grid.Column>
                                    <Grid.Column width={4} textAlign="center" style={{border: "0.5px solid grey"}}>
                                      <p style={textStyle}>{item.coinsStatus.toString() == '0' && <span>-</span> }{item.coinsStatus.toString() == '1' && <span>+</span> }{item.coins} coins</p>
                                    </Grid.Column>
                                  </Grid.Row>))
                                }
                              </Grid>
                        </Grid.Column>)
                      }
                      </Grid.Row>)
                    }
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center" >
                          <Link to={'/top_up_plans'} replace><Button onClick={e => this.handleDisplayHowToUse("summary")} size="large" circular
                            style={{backgroundColor: '#e56f65',  color: '#ffffff'}}
                          >TOP-UP</Button></Link>
                      </Grid.Column>
                    </Grid.Row >
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center" >
                          <Link to={'/how_to_use_coins'} replace><Button onClick={e => this.handleDisplayTopUpPlans("history")} size="large" circular
                            style={{backgroundColor: '#e56f65', color: '#ffffff'}}
                          >HOW TO USE</Button></Link>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>

              </Grid.Row>
        </Grid>
    )
  }

}

export default withRouter(CoinsSummary);
