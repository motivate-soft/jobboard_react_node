import React, { createContext, useContext, useReducer, useEffect } from "react";
import jobApi from "../service/jobApi";
import { toast } from "react-toastify";

export const JobContext = createContext();

const defaultPricePerPost = 299;
const defaultDiscountPercent = 5;
const defaultBundleSize = 25;

const initialJob = {
  logo: "/images/sample_logo.png",
  companyName: "Company",
  position: "Position",
  primaryTag: null,
  tags: [],
  location: "Worldwide",

  size: 1,
  showLogo: true,
  blastEmail: true,
  highlight: false,
  highlightColor: false,
  brandColor: null,
  stickyDuration: null,

  price: null,
  discountPercent: 0,
  pricePerPost: defaultPricePerPost,
};

const initialJobBundle = {
  logo: "/images/sample_logo.png",
  companyName: "Example Company",
  position: "Example Position",
  primaryTag: null,
  tags: ["Example Tag1", "Example Tag2", "Example Tag3"],
  location: "Worldwide",

  size: defaultBundleSize,
  showLogo: true,
  blastEmail: true,
  highlight: false,
  highlightColor: false,
  brandColor: null,
  stickyDuration: null,

  price: null,
  pricePerPost: defaultPricePerPost,
  discountPercent: defaultDiscountPercent,
};

const upsells = {
  showLogo: 49,
  blastEmail: 49,
  highlight: 49,
  highlightColor: 349,
  stickyDay: 199,
  stickyWeek: 549,
  stickyMonth: 1647,
};

function calculatePrice(bundleState) {
  let { pricePerPost, size, discountPercent } = bundleState;
  console.log("calculatePrice", bundleState);
  if (bundleState.showLogo) {
    pricePerPost += upsells.showLogo;
  }
  if (bundleState.blastEmail) {
    pricePerPost += upsells.blastEmail;
  }
  if (bundleState.highlight) {
    pricePerPost += upsells.highlight;
  }
  if (bundleState.highlightColor) {
    pricePerPost += upsells.highlightColor;
  }
  if (bundleState.stickyDuration) {
    switch (bundleState.stickyDuration) {
      case "day":
        pricePerPost += upsells.stickyDay;
        break;
      case "week":
        pricePerPost += upsells.stickyWeek;
        break;
      case "month":
        pricePerPost += upsells.stickyMonth;
        break;
      default:
        break;
    }
  }

  return (pricePerPost * size * (100 - discountPercent)) / 100;
}

function reducer(state, action) {
  switch (action.type) {
    case "RESET_JOB_BUNDLE":
      return { ...initialJobBundle, price: calculatePrice(initialJobBundle) };
    case "RESET_JOB":
      return { ...initialJob, price: calculatePrice(initialJob) };

    case "UPDATE_JOB_DETAIL":
      return { ...state, ...action.payload };

    case "UPDATE_JOB_UPSELLS":
      let { payload } = action;

      // toggle highlight option
      if (payload.highlight) {
        payload.highlightColor = false;
        payload.brandColor = null;
      }
      if (payload.highlightColor) {
        payload.highlight = false;
      }

      const price = calculatePrice({
        ...state,
        ...payload,
      });

      return { ...state, ...payload, price };

    default:
      return state;
  }
}

const JobPostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialJob);

  useEffect(() => {
    // fetchPricing();
  });

  async function fetchPricing() {
    const { data } = await jobApi.getPricing();
    if (data.message) {
      toast.warning(data.message);
    }
    console.log("JobPostProvider->fetchPricing", data);
  }

  return (
    <JobContext.Provider value={{ state, dispatch }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobPost = () => useContext(JobContext);

export default JobPostProvider;
