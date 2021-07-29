import PropTypes from "prop-types";
import React, { Fragment, useState, useMemo } from "react";
import { XIcon } from "@heroicons/react/outline";
import useResponsiveFontSize from "../../lib/useResponsiveFontSize";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Nunito, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};

export default function StripeCardForm(props) {
  const { showPromo, loading, open, setOpen, amount, onSubmit } = props;
  const [promoCode, setPromoCode] = useState(null);

  const options = useOptions();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    if (elements == null) {
      return;
    }

    onSubmit(elements.getElement(CardNumberElement), promoCode);
  };

  return (
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
      <div className="leading-loose">
        <form onSubmit={handleSubmit}>
          <div>
            <p className="mt-4 text-gray-800 font-medium">
              Payment information
            </p>
            <div className="border border-gray-300 rounded-t-md p-2">
              <CardNumberElement
                options={options}
                onReady={() => {
                  console.log("CardNumberElement [ready]");
                }}
                onChange={(event) => {
                  console.log("CardNumberElement [change]", event);
                }}
                onBlur={() => {
                  console.log("CardNumberElement [blur]");
                }}
                onFocus={() => {
                  console.log("CardNumberElement [focus]");
                }}
              />
            </div>
            <div className="p-2 grid grid-cols-2 border border-gray-300 rounded-b-md">
              <div>
                <CardExpiryElement
                  options={options}
                  onReady={() => {
                    console.log("CardNumberElement [ready]");
                  }}
                  onChange={(event) => {
                    console.log("CardNumberElement [change]", event);
                  }}
                  onBlur={() => {
                    console.log("CardNumberElement [blur]");
                  }}
                  onFocus={() => {
                    console.log("CardNumberElement [focus]");
                  }}
                />
              </div>
              <div>
                <CardCvcElement
                  options={options}
                  onReady={() => {
                    console.log("CardNumberElement [ready]");
                  }}
                  onChange={(event) => {
                    console.log("CardNumberElement [change]", event);
                  }}
                  onBlur={() => {
                    console.log("CardNumberElement [blur]");
                  }}
                  onFocus={() => {
                    console.log("CardNumberElement [focus]");
                  }}
                />
              </div>
            </div>
          </div>
          {showPromo && (
            <div>
              <p className="mt-4 text-gray-800 font-medium">
                Promotion code(optinal)
              </p>
              <div className="flex p-2 border border-gray-300 rounded">
                <input
                  name="promoCode"
                  className="block w-full input-indigo hover:border-0"
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex">
            <button
              className="btn-indigo py-4 px-8 mx-auto"
              type="submit"
              disabled={!stripe || !elements || loading}
            >
              Confirm payment
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

StripeCardForm.propTypes = {
  amount: PropTypes.number,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  showPromo: PropTypes.bool,
};

StripeCardForm.defaultProps = {
  showPromo: false,
};
