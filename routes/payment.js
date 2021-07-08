const router = require('express').Router();
const stripe = require('../controllers/stripe');
const stripePhone = require('../controllers/stripePhone');

router.post('/create-checkout-session', stripe.checkout);
router.post('/confirm-booking-online', stripe.confirmRideOnline);
router.post('/create-payment-intent', stripePhone.createPaymentIntent);

module.exports = {
  router: router,
  basePath: '/api'
};
