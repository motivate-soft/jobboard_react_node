import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "./../../service/axiosInstance";
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
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          open={open}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Elements>
  );
}
