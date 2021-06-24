import React, { useEffect } from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";

const stripeApiKey = process.env.STRIPE_API_KEY;

export default function Checkout(props) {
  const { selectedProduct, history } = props;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!stripeApiKey) return <p>no api key found...</p>;

  return (
    <StripeProvider apiKey={stripeApiKey}>
      <Elements>
        <CheckoutForm selectedProduct={selectedProduct} history={history} />
      </Elements>
    </StripeProvider>
  );
}
