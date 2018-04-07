import PropTypes from 'prop-types';
import React from 'react';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';

import App from '../components/App';
import MolPay from '../components/Payments/molPay'
import PaymentSuccess from '../components/Payments/PaymentSuccess'
import MolPaymentResult from '../components/Payments/PaymentResult'
import DevTools from './DevTools';
import Routes from '../routes'

{/**<Routes />**/}

export default function Root({store, history}) {
    return (
        <Provider store={store}>
            <div>
                <ConnectedRouter history={history}>
                  <Switch>
                    <Route exact path="/" component={App}/>
                    <Route exact path="/payment" component={MolPay} />
                    <Route exact path="/payment_status" component={MolPaymentResult} />
                    <Route exact path="/paymentSuccess" component={PaymentSuccess} />
                  </Switch>
                </ConnectedRouter>
                {/*<DevTools />*/}
            </div>
        </Provider>
    );
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};
