import React, { Fragment } from "react";
import { XIcon } from "@heroicons/react/outline";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  CardNumberElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.STRIPE_API_KEY ||
    "pk_test_51IZJknHhTqm9kBDPwaxtL2RqAagMTuZXHAOIp7IjRp4BuOqSR1NIETfwwqy5Jbde92AsJATdHDClpXRBct2sUPhi00ShhuWvDX"
);

const CheckoutForm = (props) => {
  const { onCreatePaymentMethodSuccess, onCreatePaymentMethodFailure } = props;
  const stripe = useStripe();
  const elements = useElements();

  const elementsStyles = {
    base: {
      color: "#004ABB",
      iconColor: "#004ABB",
      fontFamily: "'Mukta', Helvetica, sans-serif",
      fontWeight: "600",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#6099EE",
        textTransform: "uppercase",
      },
    },
    invalid: {
      color: "#ff5252",
      iconColor: "#ff5252",
    },
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (elements == null) {
      return;
    }

    try {
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      onCreatePaymentMethodSuccess(paymentMethod);
      console.log("CheckoutForm->CreatePaymentMethod->success", paymentMethod);

      // await axiosInstance.post("api/job/subscription", {
      //   paymentMethodId: paymentMethod.id,
      //   company: {
      //     name: "amazingCo.ltd",
      //     email: "amazing@co.com",
      //     invoiceAddress: "boston",
      //   },
      //   job: {
      //     showLogo: true,
      //     blastEmail: true,
      //     highlightColor: true,
      //     stickyMonth: true,
      //   },
      // });
    } catch (error) {
      console.log("CheckoutForm->CreatePaymentMethod->error", error);
      onCreatePaymentMethodFailure(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <CardElement className="mb-4" style={elementsStyles} />
      <button
        type="submit"
        disabled={!stripe || !elements}
        className="btn-indigo block py-4"
      >
        Pay
      </button>
    </form>
  );
};

export default function PaymentForm(props) {
  const {
    open,
    setOpen,
    onCreatePaymentMethodSuccess,
    onCreatePaymentMethodFailure,
  } = props;

  return (
    <Elements stripe={stripePromise}>
      <Fragment>
        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 pt-8">
          <CheckoutForm
            onCreatePaymentMethodSuccess={onCreatePaymentMethodSuccess}
            onCreatePaymentMethodFailure={onCreatePaymentMethodFailure}
          />
        </div>
      </Fragment>
    </Elements>
  );
}
