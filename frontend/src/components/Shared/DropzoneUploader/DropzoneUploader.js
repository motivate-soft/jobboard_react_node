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
      {props.children}
    </Dropzone>
  );
}
