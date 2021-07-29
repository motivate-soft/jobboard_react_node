/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/outline";

export default function PaymentSucess(props) {
  const { setOpen, promoCode } = props;
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
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <div className="mt-3 text-center sm:mt-5">
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Please save this promotion code for future use{" "}
            <span className="font-bold text-lg">{promoCode}</span>
          </p>
        </div>
      </div>
    </Fragment>
  );
}
