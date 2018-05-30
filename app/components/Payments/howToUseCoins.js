import React, {Component} from 'react';
import {Table, Grid, Segment, Button, Loader, Message, Icon} from 'semantic-ui-react';
import _ from 'lodash'
import { withRouter } from 'react-router'
import moment from 'moment'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import config from '../../config/index'

var GetIconsDisplay = ({item, imageUrl}) => {
  console.log('got imageUrl= ', imageUrl);
  switch (item) {
    case "Gift":
      return (<img
        src={imageUrl +"003-present.svg"}   //{config.getImageUrl + "003-present.svg"}
        alt="001-repeat"
        height="87px"
        width="100px"
      />)
      break;
    case "Reveal":
      return (<img
        src= {imageUrl + "002-girl.svg"}
        alt="001-repeat"
        height="87px"
        width="100px"
      />)
      break;
    case "Reconnect":
      return (<img
        src= {imageUrl + "001-repeat.svg"}
        alt="001-repeat"
        height="87px"
        width="100px"
      />)
      break;
    case "CHAT BONUSES":
      return (<img
        src= {imageUrl + "002-talk.svg"}
        alt="001-repeat"
        height="87px"
        width="100px"
      />)
      break;
    case "INVITE YOUR FRIENDS":
      return (<img
        src= {imageUrl + "001-users.svg"}
        alt="001-repeat"
        height="87px"
        width="100px"
      />)
      break;
    default:
      return null
  }
}

class HowToUseCoins extends Component {
  constructor(props) {
    super(props)

    this.state = {
      howToUseCoins: {
        Gift: 'Give Coins to your chatmate as gifts',
        Reveal: 'Reveal your chatmate\'s identity',
        Reconnect: 'Send reconnect request to chatmate'
      },
      howToEarnCoins: {
        'CHAT BONUSES' : 'Get coins when you get high ratings, use NG regularly and chat long!',
        'INVITE YOUR FRIENDS' : 'Share this link to get 2 coins per friend who joins '
      }
    }
    this.redirectToInviteLink = this.redirectToInviteLink.bind(this)
  }

  redirectToInviteLink() {
    window.location = 'https://' + this.props.paymentData.howToInviteFriends
  }

  render() {
    let state = this.state
    let props = this.props
    let imageUrl = window.location.origin + "/images/"
    console.log('imageUrl= ', imageUrl, " ", window.location);
    // let {coinData} = this.props
    console.log("howtouse = ", state, props);
    return (
        <Grid container style={{margin: "30px 0px"}}>
            <Grid.Row >
                <Grid.Column width={16} textAlign="center">
                  <Grid>
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center" >
                        <h2 style={{color: '#199aab'}}><strong>HOW TO USE</strong></h2>
                      </Grid.Column>
                    </Grid.Row>
                    {
                      Object.keys(state.howToUseCoins).map((item, index) => (
                        <Grid.Row key={item}>
                          <Grid.Column width={4} textAlign="right" >
                            {/**<Fontawesome name="gift" size="7x" />**/}
                            {/** <Icon name="gift" size="huge" color="orange" /> **/}

                            <GetIconsDisplay item={item} imageUrl={imageUrl} />
                          </Grid.Column>
                          <Grid.Column width={12} textAlign="left" verticalAlign='middle' >
                            <Grid>
                              <Grid.Row style={{padding: 5}}>
                                <Grid.Column width={16} textAlign="left" >
                                  <h2 style={{color: '#616161'}}>{item.toUpperCase()}</h2>
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row style={{padding: 5}}>
                                <Grid.Column width={16} textAlign="left" >
                                  <p style={{color: '#607d8b'}}>{state.howToUseCoins[item]}</p>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Grid.Column>
                        </Grid.Row>
                      ))
                    }
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center">
                        <h2 style={{color: '#199aab'}}><strong>EARNING COINS</strong></h2>
                      </Grid.Column>
                    </Grid.Row>
                    {
                      Object.keys(state.howToEarnCoins).map((item, index) => (
                        <Grid.Row key={item}>
                          <Grid.Column width={4} textAlign="right" >
                            {/**<Fontawesome name="gift" size="7x" />**/}
                            {/**  <Icon name="chat" size="huge" color="orange" /> **/}
                              <GetIconsDisplay item={item} imageUrl={imageUrl} />
                          </Grid.Column>
                          <Grid.Column width={12} textAlign="left" verticalAlign="middle" >
                            <Grid>
                              <Grid.Row style={{padding: 5}}>
                                <Grid.Column width={16} textAlign="left" >
                                  <h2 style={{color: '#616161', fontSize: 18}}>{item.toUpperCase()}</h2>
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row style={{padding: 5}}>
                                <Grid.Column width={16} textAlign="left" >
                                  <p style={{color: '#607d8b'}}>{state.howToEarnCoins[item]}</p>
                                </Grid.Column>
                                {
                                  item == 'INVITE YOUR FRIENDS' &&
                                  (<Grid.Column width={16} textAlign="left" >
                                    <p style={{color: '#607d8b'}} onClick={this.redirectToInviteLink}><i><a style={{textDecoration: 'none', fontSize: 15, cursor: 'pointer'}} target="_blank">{props.paymentData.howToInviteFriends}</a></i></p>
                                  </Grid.Column>)
                                }
                              </Grid.Row>
                            </Grid>
                          </Grid.Column>
                        </Grid.Row>
                      ))
                    }
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center">
                        <Link to={'/top_up_plans'} replace>
                          <Button size="large" circular style={{backgroundColor: '#e56f65', color: '#ffffff'}}>TOP-UP</Button>
                        </Link>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center">
                        <Link to={'/?channelId=' + props.paymentData.customerId} replace>
                          <Button size="large" circular style={{backgroundColor: '#e56f65', color: '#ffffff'}}>BACK</Button>
                        </Link>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
        </Grid>
    )
  }

}

function mapStateToProps(state) {
  console.log('in index mapStateToProps ', state );
  return {
    paymentData: state.payment
  }
}

export default withRouter(connect(mapStateToProps)(HowToUseCoins));
