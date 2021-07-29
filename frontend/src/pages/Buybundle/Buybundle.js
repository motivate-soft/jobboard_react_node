import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DragSlider from "../../components/JobPostDesign/DragSlider";
import JobPostDesign from "../../components/JobPostDesign/JobPostDesign";
import JobPostPreview from "../../components/JobPostPreview/JobPostPreview";
import { useJobPost } from "../../contexts/jobContext";
import { toast } from "react-toastify";
import Modal from "../../components/Shared/Modal/Modal";
import paymentApi from "../../service/paymentApi";
import { useStripe } from "@stripe/react-stripe-js";
import StripeCardForm from "../../components/PaymentForm/StripeCardForm";
import PaymentSucess from "../../components/PaymentForm/PaymentSucess";

export default function Buybundle() {
  const { state, dispatch } = useJobPost();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [promoCode, setPromoCode] = useState(null);
  const { size, pricePerPost, discountPercent } = state;
  const [checkoutFormOpen, setCheckoutFormOpen] = useState(false);
  const stripe = useStripe();

  useEffect(() => {
    dispatch({
      type: "RESET_JOB_BUNDLE",
    });
  }, []);

  async function handleBuybundleClick() {
    try {
      let bundle = {
        size: state.size,
      };
      if (state.showLogo) {
        bundle.showLogo = state.showLogo;
      }
      if (state.blastEmail) {
        bundle.blastEmail = state.blastEmail;
      }
      if (state.highlight) {
        bundle.highlight = state.highlight;
      }
      if (state.highlightColor) {
        bundle.highlightColor = state.highlightColor;
      }
      if (state.stickyDuration) {
        bundle.stickyDuration = state.stickyDuration;
      }
      const { data } = await paymentApi.createPaymentIntent(bundle);
      setClientSecret(data.clientSecret);
      setCheckoutFormOpen(true);
    } catch (error) {
      console.log("Buybundle->createPaymentIntent->error", error);
    }
  }

  async function handleSubmit(card) {
    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      },
    });

    if (result.error) {
      console.log("Buybundle->handleSubmit->error", result.error);
      toast.warning(result.error.message || "stripe error");
      setLoading(false);
      return;
    } else {
      if (result.paymentIntent.status === "succeeded") {
        let bundle = {
          size: state.size,
        };
        if (state.showLogo) {
          bundle.showLogo = state.showLogo;
        }
        if (state.blastEmail) {
          bundle.blastEmail = state.blastEmail;
        }
        if (state.highlight) {
          bundle.highlight = state.highlight;
        }
        if (state.highlightColor) {
          bundle.highlightColor = state.highlightColor;
        }
        if (state.stickyDuration) {
          bundle.stickyDuration = state.stickyDuration;
        }
        const { data } = await paymentApi.createPromoCode(bundle);
        setPromoCode(data.promoCode);
      }
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col container mx-auto px-4 pt-20 pb-28">
      <Link
        to="/buy-single"
        className="ml-auto mb-10 inline-flex font-sans justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Post a single Job
      </Link>
      <DragSlider />
      <div className="mt-20 mb-10">
        <JobPostDesign />
      </div>
      <button
        className="mx-auto mb-20 px-4 py-4 max-w-lg inline-flex font-sans text-3xl justify-center  border border-transparent shadow-sm font-medium rounded-xl text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleBuybundleClick}
      >
        Buy <span>{size}</span> -jobs bundle-$
        <span>{pricePerPost * (1 - discountPercent / 100) * size}</span>
      </button>
      {/* <JobPostPreview /> */}

      <Modal open={checkoutFormOpen} setOpen={setCheckoutFormOpen}>
        {promoCode ? (
          <PaymentSucess
            promoCode={promoCode}
            open={checkoutFormOpen}
            setOpen={setCheckoutFormOpen}
          />
        ) : (
          <StripeCardForm
            loading={loading}
            open={checkoutFormOpen}
            setOpen={setCheckoutFormOpen}
            amount={pricePerPost * (1 - discountPercent / 100) * size}
            onSubmit={handleSubmit}
          />
        )}
      </Modal>
    </div>
  );
}
