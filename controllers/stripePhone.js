// This is a sample test API key. Sign in to see examples pre-filled with your key.
const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");
const Slot = require("../models/Slot");

const calculateOrderAmount = async(id) => {
    try {
        const slot = await Slot.findById(id);
        console.log(slot);
        return Number(slot.price)*100;
    } catch (e) {
        console.log(e)
    }
};

exports.createPaymentIntent = async (req,res) => {
    try {
        const items  = req.query.id;
        // Create a PaymentIntent with the order amount and currency
        const amount = await calculateOrderAmount(items);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd"
        });
        res.send({
          clientSecret: paymentIntent.client_secret
        });
    } catch (e) {
        console.log(e)
    }
}
