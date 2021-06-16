import React from "react";
import { useJobPost } from "../../contexts/jobContext";

export default function JobPostDesign() {
  const { state, dispatch } = useJobPost();

  function renderOutlinedBadge(text) {
    return (
      <div className="inline-flex p-1 mr-4 border border-orange text-orange font-semibold rounded-md uppercase leading-none">
        {text}
      </div>
    );
  }

  function renderBadge(text) {
    return (
      <div className="inline-flex p-1 mr-4 bg-orange border border-orange text-white font-semibold rounded-md uppercase leading-none">
        {text}
      </div>
    );
  }

  function handleChange(e) {
    console.log("JobPostDesign", e.target.name);
    dispatch({
      type: "UPDATE_JOB_UPSELLS",
      payload: {
        [e.target.name]: !state[e.target.name],
      },
    });
  }

  return (
    <div className="relative px-4 py-6 border-2 border-gray-200 rounded-md sm:px-6 sm:py-5">
      {/* <div className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1  rounded-top rounded-md rounded-b-none border border-b-0 border-gray-200 bg-white "> */}
      <h3 class="mb-8 text-xl leading-6 font-bold text-gray-900">
        Design your job posts
      </h3>
      <div>
        <h5 className="text-center text-xl font-semibold">
          Every job post in your bundle will have the features you select below
          and will be valid for 24 months
        </h5>
      </div>

      <div className="flex items-center text-base mb-1 py-2">
        {/* Company logo */}
        <input
          id="isShowLogo"
          name="isShowLogo"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.isShowLogo}
          onChange={handleChange}
        />
        <label
          htmlFor="isShowLogo"
          className="ml-2 block text-sm text-gray-900"
        >
          Show my ⭐️ company logo besides my posts (+$<span>49</span>)
          <span>(you can change the logo later when posting each job)</span>
          {"     "}
          {renderOutlinedBadge("2X MORE VIEWS")}
          {renderBadge("Highly recommended")}
        </label>
      </div>

      {/* Blast email */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="isBlastEmail"
          name="isBlastEmail"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.isBlastEmail}
          onChange={handleChange}
        />
        <label
          htmlFor="isBlastEmail"
          className="ml-2 block text-sm text-gray-900"
        >
          Email blast my job post to <span class="big">📮95,131</span> remote
          candidates (+$<span>49</span>){"     "}
          {renderOutlinedBadge("3X MORE VIEWS")}
          {renderBadge("Highly recommended")}
        </label>
      </div>

      {/* Highlight */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="isHighlight"
          name="isHighlight"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.isHighlight}
          onChange={handleChange}
        />
        <label
          htmlFor="isHighlight"
          className="ml-2 block text-sm text-gray-900"
        >
          Highlight your posts in ⚠️ yellow (+$<span>49</span>){"     "}
          {renderOutlinedBadge("3X MORE VIEWS")}
        </label>
      </div>

      {/* Highlight color */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="isHighlightColor"
          name="isHighlightColor"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.isHighlightColor}
          onChange={handleChange}
        />
        <label
          htmlFor="isHighlightColor"
          className="ml-2 block text-sm text-gray-900"
        >
          <span class="span_highlight_color">
            Highlight with your company's 🌈 brand color (+$
            <span>349</span>) (you can change the color later when posting each
            job){" "}
          </span>
          {renderOutlinedBadge("3X MORE VIEWS")}
        </label>
      </div>

      {/* Sticky 1 day */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="isStickyDay"
          name="isStickyDay"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.isStickyDay}
          onChange={handleChange}
        />
        <label
          htmlFor="isStickyDay"
          className="ml-2 block text-sm text-gray-900"
        >
          Sticky your posts so they stay on 📌 top of the frontpage for ⏰ 24
          hours (+$<span>199</span>) {renderOutlinedBadge("2X MORE VIEWS")}
        </label>
      </div>

      {/* Sticky 1 week */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="isStickyWeek"
          name="isStickyWeek"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.isStickyWeek}
          onChange={handleChange}
        />
        <label
          htmlFor="isStickyWeek"
          className="ml-2 block text-sm text-gray-900"
        >
          Sticky your posts so they stay on 📌 top of the frontpage for 🗓 1
          entire week (+$<span>549</span>){" "}
          {renderOutlinedBadge("2X MORE VIEWS")}
        </label>
      </div>

      {/* Sticky 1 month */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="isStickyMonth"
          name="isStickyMonth"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.isStickyMonth}
          onChange={handleChange}
        />
        <label
          htmlFor="isStickyMonth"
          className="ml-2 block text-sm text-gray-900"
        >
          Sticky your posts so they stay on 📌 top of the frontpage for 🗓 1
          entire month (+$<spacing>1647</spacing>){" "}
          {renderOutlinedBadge("8X MORE VIEWS")}
        </label>
      </div>
    </div>
  );
}
