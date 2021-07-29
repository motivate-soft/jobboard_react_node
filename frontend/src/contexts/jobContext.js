import React, { createContext, useContext, useReducer, useEffect } from "react";
import jobApi from "../service/jobApi";
import { toast } from "react-toastify";

export const JobContext = createContext();

const defaultPricePerPost = 300;
const defaultBundleSize = 10;

const initialJob = {
  logo: null,
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

  discountPercent: null,
  pricePerPost: null,
};

const initialJobBundle = {
  logo: null,
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

  pricePerPost: null,
  discountPercent: null,
};

const upsells = {
  showLogo: 50,
  blastEmail: 50,
  highlight: 50,
  highlightColor: 300,
  stickyDay: 200,
  stickyWeek: 500,
  stickyMonth: 1500,
};

function getDiscountRate(size) {
  if (size === 1) {
    return 0;
  } else if (size <= 5) {
    return 5;
  } else if (size <= 10) {
    return 10;
  } else if (size <= 15) {
    return 15;
  } else if (size <= 30) {
    return 20;
  } else if (size <= 40) {
    return 25;
  } else if (size <= 50) {
    return 30;
  } else if (size <= 60) {
    return 35;
  } else if (size <= 75) {
    return 40;
  } else if (size <= 99) {
    return 45;
  } else {
    return 50;
  }
}

function calculatePricePerPost(bundleState) {
  let pricePerPost = defaultPricePerPost;
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

  return pricePerPost;
}

function reducer(state, action) {
  let { payload } = action;
  switch (action.type) {
    case "RESET_JOB_BUNDLE":
      return {
        ...initialJobBundle,
        discountPercent: getDiscountRate(initialJobBundle.size),
        pricePerPost: calculatePricePerPost(initialJobBundle),
      };
    case "RESET_JOB":
      return {
        ...initialJob,
        discountPercent: getDiscountRate(initialJob.size),
        pricePerPost: calculatePricePerPost(initialJob),
      };

    case "UPDATE_JOB_DETAIL":
      payload.discountPercent = getDiscountRate(payload.size);
      payload.pricePerPost = calculatePricePerPost({
        ...state,
        ...action.payload,
      });
      console.log("jobContext->UPDATE_JOB_DETAIL", payload);

      return { ...state, ...payload };

    case "UPDATE_JOB_UPSELLS":
      // toggle highlight option
      if (payload.highlight) {
        payload.highlightColor = false;
        payload.brandColor = null;
      }
      if (payload.highlightColor) {
        payload.highlight = false;
      }

      payload.discountPercent = getDiscountRate(payload.size);
      payload.pricePerPost = calculatePricePerPost({
        ...state,
        ...action.payload,
      });
      console.log("jobContext->UPDATE_JOB_UPSELLS", payload);

      return { ...state, ...payload };

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
