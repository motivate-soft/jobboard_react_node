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
    console.log("JobPostDesign->handleChange", e.target.name);
    dispatch({
      type: "UPDATE_JOB_UPSELLS",
      payload: {
        [e.target.name]: !state[e.target.name],
      },
    });
  }

  function handleColorChange(e) {
    dispatch({
      type: "UPDATE_JOB_UPSELLS",
      payload: {
        [e.target.name]: e.target.value,
      },
    });
  }

  function handleChangeStickyDuration(e) {
    let duration;

    console.log(
      "JobPostDesign->handleChangeStickyDuration",
      e.target.name,
      e.target.value,
      e.target.checked
    );

    if (e.target.checked) {
      duration = e.target.name;
    } else {
      duration = null;
    }

    dispatch({
      type: "UPDATE_JOB_UPSELLS",
      payload: {
        stickyDuration: duration,
      },
    });
  }

  return (
    <div className="relative px-4 py-6 border-2 border-gray-200 rounded-md sm:px-6 sm:py-5">
      {/* <div className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1  rounded-top rounded-md rounded-b-none border border-b-0 border-gray-200 bg-white "> */}
      <h3 className="mb-8 text-xl leading-6 font-bold text-gray-900">
        Design your job posts
      </h3>

      <div className="flex items-center text-base mb-1 py-2">
        {/* Company logo */}
        <input
          id="showLogo"
          name="showLogo"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.showLogo}
          onChange={handleChange}
        />
        <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-900">
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
          id="blastEmail"
          name="blastEmail"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.blastEmail}
          onChange={handleChange}
        />
        <label
          htmlFor="blastEmail"
          className="ml-2 block text-sm text-gray-900"
        >
          Email blast my job post to <span>📮95,131</span> remote candidates (+$
          <span>49</span>){"     "}
          {renderOutlinedBadge("3X MORE VIEWS")}
          {renderBadge("Highly recommended")}
        </label>
      </div>

      {/* Highlight */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="highlight"
          name="highlight"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.highlight}
          onChange={handleChange}
        />
        <label htmlFor="highlight" className="ml-2 block text-sm text-gray-900">
          Highlight your posts in ⚠️ yellow (+$<span>49</span>){"     "}
          {renderOutlinedBadge("3X MORE VIEWS")}
        </label>
      </div>

      {/* Highlight color */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="highlightColor"
          name="highlightColor"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.highlightColor}
          onChange={handleChange}
        />

        <label
          htmlFor="highlightColor"
          className="ml-2 block text-sm text-gray-900"
        >
          <span className="flex items-center">
            Highlight with your company's 🌈 brand color (+$
            <span>349</span>)
            <input
              id="brandColor"
              name="brandColor"
              type="color"
              onChange={handleColorChange}
              className="mx-4 w-8 h-4"
            />
            {/* (you can change the color later when posting each job){" "} */}
          </span>
          {renderOutlinedBadge("3X MORE VIEWS")}
        </label>
      </div>

      {/* Sticky 1 day */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="day"
          name="day"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.stickyDuration === "day"}
          onChange={handleChangeStickyDuration}
        />
        <label htmlFor="day" className="ml-2 block text-sm text-gray-900">
          Sticky your posts so they stay on 📌 top of the frontpage for ⏰ 24
          hours (+$<span>199</span>) {renderOutlinedBadge("2X MORE VIEWS")}
        </label>
      </div>

      {/* Sticky 1 week */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="week"
          name="week"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.stickyDuration === "week"}
          onChange={handleChangeStickyDuration}
        />
        <label htmlFor="week" className="ml-2 block text-sm text-gray-900">
          Sticky your posts so they stay on 📌 top of the frontpage for 🗓 1
          entire week (+$<span>549</span>){" "}
          {renderOutlinedBadge("2X MORE VIEWS")}
        </label>
      </div>

      {/* Sticky 1 month */}
      <div className="flex items-center text-base mb-1 py-2">
        <input
          id="month"
          name="month"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={state.stickyDuration === "month"}
          onChange={handleChangeStickyDuration}
        />
        <label htmlFor="month" className="ml-2 block text-sm text-gray-900">
          Sticky your posts so they stay on 📌 top of the frontpage for 🗓 1
          entire month (+$<spacing>1647</spacing>){" "}
          {renderOutlinedBadge("8X MORE VIEWS")}
        </label>
      </div>
    </div>
  );
}
