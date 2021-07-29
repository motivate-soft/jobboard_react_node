import React from "react";
import Dropzone from "react-dropzone";
import Spinner from "../Loader/Spinner";

export default function Uploader(props) {
  const { isLoading, onAddFiles } = props;
  if (isLoading) {
    return (
      <div className="">
        <Spinner />
      </div>
    );
  }

  return (
    <Dropzone onDrop={onAddFiles} onFileDialogCancel={() => {}}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <input
            {...getInputProps({
              capture: "environment",
              multiple: false,
              accept: "image/*",
            })}
          />
          <div className="dz-message">
            <div className="max-w-lg flex justify-center px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="companyLogo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
}
