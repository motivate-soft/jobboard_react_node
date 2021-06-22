import React from "react";

export default function Filter() {
  return (
    <div>
      <div>
        <div>
          <label
            htmlFor="company_name"
            className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
          >
            Status
          </label>
        </div>
        <div className="sm:col-span-2">
          <select
            {...register("primaryTag")}
            className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
              errors.primaryTag ? "bg-error" : ""
            }`}
            onChange={(e) => handleChange("primaryTag", e.target.value)}
          >
            <option value="">Select a primary tag</option>
            {primaryTagOptions.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <span className="mt-2 text-xs text-pink-500">
            {errors.primaryTag?.message}
          </span>
        </div>
      </div>
    </div>
  );
}
