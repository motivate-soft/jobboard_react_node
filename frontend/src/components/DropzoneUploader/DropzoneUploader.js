import React from "react";
import Dropzone from "react-dropzone-component";
import "dropzone/dist/min/dropzone.min.css";

export default function DropzoneUploader(props) {
  const componentConfig = {
    iconFiletypes: [".jpg", ".png", ".gif"],
    method: true,
    showFiletypeIcon: true,
    uploadMultiple: false,
    maxFilesize: 2, // MB
    maxFiles: 2,
    dictMaxFilesExceeded: "You can only upload upto 2 images",
    dictRemoveFile: "Delete",
    dictCancelUploadConfirmation: "Are you sure to cancel upload?",
    postUrl: "no-url",
  };
  const djsConfig = { autoProcessQueue: false };
  const eventHandlers = {
    addedfile: (file) => onAddedFile(file),
    success: (file) => console.log(`${file.name} successfully uploaded`),
    error: (error) => console.log("Server is not set in the demo"),
  };

  async function onAddedFile(file) {
    console.log("onAddFile", file);
    const body = new FormData();
    body.append("file", file);
  }

  return (
    <Dropzone
      config={componentConfig}
      eventHandlers={eventHandlers}
      djsConfig={djsConfig}
      className=""
    />
  );
}
