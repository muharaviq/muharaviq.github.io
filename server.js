import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';

//load variable
dotenv.config();

//start server
const app = express();

app.use(express.static("public"));
app.use(express.json());

//Home route
app.get("/", (req, res) => {
    res.sendFile("index.html", {root: "public"});
});

//Success
app.get("/success.html", (req, res) => {
    res.sendFile("success.html", {root: "/public"});
});

//Cancell
app.get("/cancel.html", (req, res) => {
    res.sendFile("cancel.html", {root: "public"});
});

//Stripe
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async (req,res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price * 100);
        console.log("item-price", item.price);
        console.log("unitAmount:", unitAmount);
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.image]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });
    console.log("lineItems:", lineItems);

// Create Checkout Sesion
const session = await stripeGateway.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${DOMAIN}/success.html`,
    cancel_url: `${DOMAIN}/cancel.html`,
    line_items: lineItems,
    //Asking Adress
    billing_address_collection: "required"
});
    res.json(session.url);
});

app.listen(3000, () =>{
    console.log("listening on port 3000;");
});