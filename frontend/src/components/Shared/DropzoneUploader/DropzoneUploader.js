import React from "react";
import Dropzone from "react-dropzone-component";
import "dropzone/dist/min/dropzone.min.css";
import mediaApi from "../../../service/mediaApi";

export default function DropzoneUploader(props) {
  const { onUpload } = props;
  const componentConfig = {
    iconFiletypes: [".jpg", ".png"],
    method: true,
    showFiletypeIcon: true,
    uploadMultiple: false,
    maxFilesize: 2, // MB
    maxFiles: 1,
    dictMaxFilesExceeded: "You can only upload upto 1 image",
    dictRemoveFile: "Delete",
    dictCancelUploadConfirmation: "Are you sure to cancel upload?",
    postUrl: "no-url",
    // dropzoneSelector: "#dropzone",
  };
  const djsConfig = { autoProcessQueue: false };
  const eventHandlers = {
    addedfile: (file) => onAddedFile(file),
    success: (file) => console.log(`${file.name} successfully uploaded`),
    error: (error) => console.log("Server is not set in the demo"),
  };

  async function onAddedFile(file) {
    const body = new FormData();
    body.append("file", file);
    try {
      const { data } = await mediaApi.create(body);
      console.log("onAddedFile->mediaApi->create:res", data);
      onUpload(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dropzone
      config={componentConfig}
      eventHandlers={eventHandlers}
      djsConfig={djsConfig}
    >
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
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
    </Dropzone>
  );
}
