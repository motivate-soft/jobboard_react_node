import React, { useState, createContext, useContext, useReducer } from "react";

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
  isShowLogo: true,
  isBlastEmail: true,
  isHighlight: false,
  isHighlightColor: false,
  highlightColor: null,
  isStickyDay: false,
  isStickyWeek: false,
  isStickyMonth: false,

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
  isShowLogo: true,
  isBlastEmail: true,
  isHighlight: false,
  isHighlightColor: false,
  highlightColor: null,
  isStickyDay: false,
  isStickyWeek: false,
  isStickyMonth: false,

  price: null,
  pricePerPost: defaultPricePerPost,
  discountPercent: defaultDiscountPercent,
};

const upsells = {
  isShowLogo: 49,
  isBlastEmail: 49,
  isHighlight: 49,
  isHighlightColor: 349,
  isStickyDay: 199,
  isStickyWeek: 549,
  isStickyMonth: 1647,
};

function calculatePrice(bundleState) {
  let { pricePerPost, size, discountPercent } = bundleState;
  console.log("calculatePrice", bundleState);
  if (bundleState.isShowLogo) {
    pricePerPost += upsells.isShowLogo;
  }
  if (bundleState.isBlastEmail) {
    pricePerPost += upsells.isBlastEmail;
  }
  if (bundleState.isHighlight) {
    pricePerPost += upsells.isHighlight;
  }
  if (bundleState.isHighlightColor) {
    pricePerPost += upsells.isHighlightColor;
  }
  if (bundleState.isStickyDay) {
    pricePerPost += upsells.isStickyDay;
  }
  if (bundleState.isStickyWeek) {
    pricePerPost += upsells.isStickyWeek;
  }
  if (bundleState.isStickyMonth) {
    pricePerPost += upsells.isStickyMonth;
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

      // toggle sticky plan
      if (payload.isStickyWeek) {
        console.log("___isStickyWeek");
        payload.isStickyMonth = false;
      }
      if (payload.isStickyMonth) {
        console.log("___isStickyMonth");
        payload.isStickyWeek = false;
      }

      // toggle highlight option
      if (payload.isHighlight) {
        payload.isHighlightColor = false;
      }
      if (payload.isHighlightColor) {
        payload.isHighlight = false;
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
  return (
    <JobContext.Provider value={{ state, dispatch }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobPost = () => useContext(JobContext);

export default JobPostProvider;
