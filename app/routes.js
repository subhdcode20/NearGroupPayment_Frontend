import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FilterableTable from './containers/FilterableTable';
import About from './components/About';
import PaymentSuccess from './components/Payments/PaymentSuccess'
import MolPay from './components/Payments/molPay'
import PaymentIndex from './components/Payments/index'
import MolPaymentResult from './components/Payments/PaymentResult'

export default (
	<Switch>
		<Route exact path="/" component={PaymentIndex} />
		<Route exact path="/NGpaymentSuccess" component={PaymentSuccess} />
		<Route exact path="/payment" component={MolPay} />
		<Route exact path="/about" component={About} />
		<Route exact path="/result" component={MolPaymentResult} />
	</Switch>
);
