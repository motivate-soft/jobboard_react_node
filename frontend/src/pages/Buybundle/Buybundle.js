import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DragSlider from "../../components/JobPostDesign/DragSlider";
import JobPostDesign from "../../components/JobPostDesign/JobPostDesign";
import JobPostPreview from "../../components/JobPostPreview/JobPostPreview";
import { useJobPost } from "../../contexts/jobContext";
import { toast } from "react-toastify";
import Modal from "../../components/Shared/Modal/Modal";
import StripePaymentForm from "../../components/PaymentForm/StripePaymentForm";

export default function Buybundle() {
  const { state, dispatch } = useJobPost();
  const { size, price } = state;
  const [checkoutFormOpen, setCheckoutFormOpen] = useState(false);

  useEffect(() => {
    dispatch({
      type: "RESET_JOB_BUNDLE",
    });
  }, []);

  function handleSubmit() {
    setCheckoutFormOpen(true);
  }

  function handleBuybundle(paymentMethodId) {
    console.log("handleBuybundle", paymentMethodId, state);
    const {
      tags,
      showLogo,
      blastEmail,
      highlight,
      highlightColor,
      brandColor,
      stickyDuration,
    } = state;
    let upsells = {
      tags,
      showLogo,
      blastEmail,
      highlight,
    };

    if (highlightColor && !brandColor) {
      toast.warning("Please select brand color");
      return;
    }
    if (highlightColor && brandColor) {
      upsells.brandColor = brandColor;
    }
    if (stickyDuration) {
      upsells.stickyDuration = stickyDuration;
    }
    

    setCheckoutFormOpen(false);
  }

  function handleCreatePaymentMethodSuccess(paymentMethod) {
    console.log("Buybundle->handleCreatePaymentMethodSuccess", paymentMethod);
    handleBuybundle(paymentMethod.id);
  }

  function handleCreatePaymentMethodFailure(error) {
    console.log("Buybundle->handleCreatePaymentMethodFailure", error);
    toast.warning(error.message || "stripe error");
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
        onClick={handleSubmit}
      >
        Buy <span>{size}</span>-jobs bundle — $<span>{price}</span>
      </button>
      <JobPostPreview />
      <Modal open={checkoutFormOpen} setOpen={setCheckoutFormOpen}>
        <StripePaymentForm
          open={checkoutFormOpen}
          setOpen={setCheckoutFormOpen}
          amount={state.price}
          onCreatePaymentMethodSuccess={handleCreatePaymentMethodSuccess}
          onCreatePaymentMethodFailure={handleCreatePaymentMethodFailure}
        />
      </Modal>
    </div>
  );
}
