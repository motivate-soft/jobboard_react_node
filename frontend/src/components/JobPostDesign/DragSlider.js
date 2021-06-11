import React from "react";
import { useJobPost } from "../../contexts/jobContext";

const minBundleSize = 0;
const maxBundleSize = 100;
const step = 5;

export default function DragSlider(props) {
  const { state, dispatch } = useJobPost();
  const { pricePerPost, size, price, discountPercent } = state;

  function handleChange(e) {
    dispatch({
      type: "UPDATE_JOB_DETAIL",
      payload: {
        size: e.target.value * step,
      },
    });
  }

  return (
    <div className="p-12 border border-gray-200 rounded">
      <h2 className=" text-3xl text-center font-bold">
        Drag the slider 👇 to build your own bundle of {size}posts
      </h2>
      <input
        type="range"
        className="bundle-range"
        value={size / step}
        min={minBundleSize / step}
        max={maxBundleSize / step}
        onChange={handleChange}
      />
      <h2 className="text-center text-2xl">
        <span className="line-through">
          ${pricePerPost * size} for {size}
        </span>{" "}
        <span>
          ${price} for {size} =
        </span>{" "}
        <span className="line-through">${price}</span>{" "}
        <span>${price} per post</span>
      </h2>
      <h2 className="text-center text-3xl">
        You save ${pricePerPost * size - price} ({discountPercent}% discount){" "}
      </h2>
    </div>
  );
}
