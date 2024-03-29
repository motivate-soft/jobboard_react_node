import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Uploader from "../../Shared/DropzoneUploader/Uploader";
import Editor from "../../Shared/MDEditor/Editor";
import companyApi from "../../../service/companyApi";
import jobApi from "../../../service/jobApi";
import { toast } from "react-toastify";
import classNames from "classnames";
import mediaApi from "../../../service/mediaApi";
import { API_URL } from "../../../env-config";

const salaryOptions = Array(20)
  .fill(null)
  .map((u, i) => (i + 1) * 10000);

const primaryTagOptions = [
  "Software Development",
  "Customer Support",
  "Sales",
  "Marketing",
  "Design",
  "Front End",
  "Back End",
  "Legal",
  "Testing",
  "Quality Assurance",
  "Non-Tech",
  "Other",
];

const statusOptions = ["pending", "approved", "declined"];
const stickyDurationOptions = ["day", "week", "month"];
const defaultHighlightColor = "#ff4742";

export default function EditJob(props) {
  const { jobId, setOpen, dispatch } = props;
  const [companyId, setCompanyId] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetchJobDetail();
  }, []);

  const validationSchema = Yup.object().shape(
    {
      companyName: Yup.string().required("Company Name is required"),
      position: Yup.string().required("Position is required"),
      primaryTag: Yup.string().required("PrimaryTag is required"),
      tags: Yup.string().required("Tags are required"),
      location: Yup.string().required("Location are required"),

      minSalary: Yup.string().required("Minimum salary is required"),
      maxSalary: Yup.string().required("Maximum salary is required"),
      description: Yup.string().required("Job description is required"),
      howtoApply: Yup.string().required("This field is required"),
      applyUrl: Yup.string().when("applyEmail", {
        is: (applyEmail) => !applyEmail || applyEmail.length === 0,
        then: Yup.string().required("Apply url is required"),
        otherwise: Yup.string(),
      }),
      applyEmail: Yup.string().when("applyUrl", {
        is: (applyUrl) => !applyUrl || applyUrl.length === 0,
        then: Yup.string()
          .email("Email is not valid")
          .required("Apply email is required"),
        otherwise: Yup.string(),
      }),

      companyLogo: Yup.object().required("This field is required"), // media obj
      companyTwitter: Yup.string().optional(),
      companyEmail: Yup.string().required("This field is required"),
      invoiceAddress: Yup.string().optional(),
      invoiceNotes: Yup.string().optional(),

      showLogo: Yup.bool().required("This field is required"),
      blastEmail: Yup.bool().required("This field is required"),
      highlight: Yup.bool().required("This field is required"),
      highlightColor: Yup.bool().required("This field is required"),
      brandColor: Yup.string(),
      stickyDuration: Yup.string().oneOf(stickyDurationOptions),
      // .required("This field is required"),

      status: Yup.string()
        .required("This field is required")
        .oneOf(statusOptions, "Select valid status"),
    },
    ["applyUrl", "applyEmail"]
  );

  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    control,
    formState,
  } = useForm(formOptions);
  const { errors } = formState;
  const watchCompanyLogoUrl = watch("companyLogo.url", null);
  const watchStickyDuration = watch("stickyDuration", null);

  async function fetchJobDetail() {
    try {
      if (!jobId) return;
      let { data } = await jobApi.retrieve(jobId);
      console.log("Editjob->fetchJobDetail->success", data);

      setCompanyId(data.company._id);
      const {
        company: { name, logo, twitter, email, invoiceAddress, invoiceNotes },
        position,
        primaryTag,
        tags,
        location,
        minSalary,
        maxSalary,
        description,
        howtoApply,
        applyUrl,
        applyEmail,
        status,

        showLogo,
        blastEmail,
        highlight,
        highlightColor,
        brandColor,
        stickyDuration,
      } = data;

      reset({
        position,
        primaryTag,
        tags: tags.join(","),
        location,
        minSalary,
        maxSalary,
        description,
        howtoApply,
        applyUrl,
        applyEmail,

        companyName: name,
        companyLogo: logo, // media obj id
        companyTwitter: twitter,
        companyEmail: email,
        invoiceAddress,
        invoiceNotes,

        showLogo,
        blastEmail,
        highlight,
        highlightColor,
        stickyDuration,
        status,
      });
      if (highlightColor) {
        setValue("brandColor", brandColor, { shouldValidate: true });
      }
      // setValue("companyLogo", logo, { shouldValidate: true });
    } catch (error) {
      console.log("Editjob->fetchJobDetail->error", error);
    }
  }

  function handleUpload(file) {
    console.log("handleUpload", file);
    setValue("companyLogo", file, { shouldValidate: true });
  }

  async function handleUpload(selectedFiles) {
    console.log(`handleUpload->files`, selectedFiles);
    if (selectedFiles[0].size > 1024 * 1024 * 10) {
      alert("You can only upload files smaller than 10MB.");
      return;
    }

    if (selectedFiles[0].type.indexOf("image") === -1) {
      alert("You can only upload image files.");
      return;
    }

    const body = new FormData();
    body.append("file", selectedFiles[0]);
    try {
      const { data } = await mediaApi.create(body);
      console.log("handleUpload->mediaApi->create:res", data);
      setValue("companyLogo", data, { shouldValidate: true });
    } catch (error) {
      console.log("handleUpload->mediaApi->create:error", error);
    }
  }

  function handleHighlightChange(e) {
    if (e.target.name === "highlight" && e.target.checked) {
      setValue("highlightColor", false);
      setValue("brandColor", null);
    }
    if (e.target.name === "highlightColor" && e.target.checked) {
      setValue("highlight", false);
    }
  }

  function handleStickyDurationChange(e) {
    let duration;
    if (e.target.checked) {
      duration = e.target.name;
    } else {
      duration = null;
    }
    setValue("stickyDuration", duration, { shouldValidate: true });
  }

  async function onSubmit(formData) {
    console.log("onSubmit", formData);
    try {
      const company = {
        id: companyId,
        name: formData.companyName,
        logo: formData.companyLogo._id,
        twitter: formData.companyTwitter,
        email: formData.companyEmail,
        invoiceAddress: formData.invoiceAddress,
        invoiceNotes: formData.invoiceNotes,
      };

      let res = await companyApi.update(company);
      console.log("onSubmit->updateCompany", res);

      const job = {
        id: jobId,
        company: companyId,
        position: formData.position,
        primaryTag: formData.primaryTag,
        location: formData.location,
        minSalary: formData.minSalary,
        maxSalary: formData.maxSalary,
        description: formData.description,
        howtoApply: formData.howtoApply,
        applyUrl: formData.applyUrl,
        applyEmail: formData.applyEmail,

        tags: formData.tags.split(","),
        showLogo: formData.showLogo,
        blastEmail: formData.blastEmail,
        highlight: formData.highlight,
        highlightColor: formData.highlightColor,
        brandColor: formData.brandColor,
        stickyDuration: formData.stickyDuration,
        status: formData.status,
      };

      res = await jobApi.update(job);
      console.log("onSubmit->udpateJob", res);

      toast.success("Saved successfully!");

      dispatch({
        type: "SET_OPTION_VALUE",
        option: "page",
        value: 1,
      });
    } catch (error) {
      console.log("EditJob->onSubmit", error);
      toast.warning("Server error");
    }
  }

  function handleApprove(e) {
    setValue("status", "approved");
    console.log("handleApprove", getValues());
    handleSubmit();
  }

  function handleDecline(e) {
    setValue("status", "declined");
    handleSubmit();
  }

  function renderActionButtons() {
    let status = getValues("status");
    if (status === "pending") {
      return (
        <div className="flex gap-4">
          <button
            className="inline-flex mx-auto bg-green-500 p-2 rounded text-sm text-white uppercase"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="inline-flex mx-auto bg-yellow-500 p-2 rounded text-sm text-white uppercase"
            onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      );
    }
    if (status === "approved") {
      return (
        <button
          className="inline-flex mx-auto bg-yellow-500 p-2 rounded text-sm text-white uppercase"
          onClick={handleDecline}
        >
          Decline
        </button>
      );
    }
    if (status === "declined") {
      return (
        <button
          className="inline-flex mx-auto bg-green-500 p-2 rounded text-sm text-white uppercase"
          onClick={handleApprove}
        >
          Approve
        </button>
      );
    }
  }

  return (
    <form
      className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex-1 px-2">
        {/* Header */}
        <div className="px-4 py-6 bg-gray-50 sm:px-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Edit Job
              </Dialog.Title>
            </div>

            <div className="h-7 flex items-center">
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close panel</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Company info container */}
        <div className="relative mb-20 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          {/* Company name */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="companyName" className="label-default">
                Company name*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("companyName")}
                type="text"
                name="companyName"
                id="companyName"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.companyName,
                })}
              />
              <span className="span-error">{errors.companyName?.message}</span>
            </div>
          </div>

          {/* Company Logo */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="companyLogo" className="label-default">
                Company logo <br /> (.jpg or .png)
              </label>
            </div>
            <div className="col-span-2">
              <div className="flex flex-col">
                <div className="p-4">
                  {watchCompanyLogoUrl && (
                    <img
                      src={`${API_URL}/uploads/${watchCompanyLogoUrl}`}
                      alt="company logo"
                      className="w-full border-2 border-gray-200 rounded-lg"
                    />
                  )}
                </div>

                <Uploader onAddFiles={handleUpload} />
                <span className="mt-2 text-xs text-pink-500">
                  {errors.companyLogo?.message}
                </span>
              </div>
            </div>
          </div>

          {/* Company twitter */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="companyTwitter" className="label-default">
                Company twitter
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("companyTwitter")}
                id="companyTwitter"
                name="companyTwitter"
                type="text"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.companyTwitter,
                })}
                placeholder="username"
              />
              <span className="span-error">
                {errors.companyTwitter?.message}
              </span>
            </div>
          </div>

          {/* Company email */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="companyEmail" className="label-default">
                Company email*
                <br /> (stays private, for invoice + edit link)
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("companyEmail")}
                id="companyEmail"
                name="companyEmail"
                type="text"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.companyEmail,
                })}
              />
              <span className="span-error">{errors.companyEmail?.message}</span>
            </div>
          </div>

          {/* Invoice address */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="invoiceAddress" className="label-default">
                Invoice address
              </label>
            </div>
            <div className="sm:col-span-2">
              <textarea
                {...register("invoiceAddress")}
                id="invoiceAddress"
                name="invoiceAddress"
                rows={5}
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.invoiceAddress,
                })}
                placeholder="e.g. your company's full name and full invoice address, including building, street, city and country; also things like your VAT number, this is shown on the invoice."
              />
              <span className="span-error">
                {errors.invoiceAddress?.message}
              </span>
            </div>
          </div>

          {/* Invoice notes/po number */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="invoiceNotes" className="label-default">
                Invoice notes / po number
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("invoiceNotes")}
                id="invoiceNotes"
                name="invoiceNotes"
                type="text"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.invoiceNotes,
                })}
                placeholder="e.g. PO number 1234"
              />
              <span className="span-error">{errors.invoiceNotes?.message}</span>
            </div>
          </div>
        </div>

        {/* Job detail container */}
        <div className="relative mt-20 mb-32 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          <h3 className="px-4 py-4 text-xl leading-6 font-bold text-gray-900 sm:px-6 sm:py-5">
            Job details
          </h3>

          {/* Position*/}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="position" className="label-default">
                Position*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("position")}
                id="position"
                name="position"
                type="text"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.position,
                })}
              />
              <span className="span-error">{errors.position?.message}</span>
            </div>
          </div>

          {/* Primary Tag */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="company_name" className="label-default">
                Primary tag*
              </label>
            </div>
            <div className="sm:col-span-2">
              <select
                {...register("primaryTag")}
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.primaryTag,
                })}
              >
                <option value="">Select a primary tag</option>
                {primaryTagOptions.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <span className="span-error">{errors.primaryTag?.message}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="tags" className="label-default">
                Tags*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("tags")}
                type="text"
                name="tags"
                id="tags"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.tags,
                })}
              />
              <span className="span-error">{errors.tags?.message}</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="location" className="label-default">
                location*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("location")}
                type="text"
                name="location"
                id="location"
                defaultValue="Worldwide"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.location,
                })}
              />
              <span className="span-error">{errors.location?.message}</span>
            </div>
          </div>

          {/* Annual Salary */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label className="label-default">
                Annual salary or compensation in usd <br />
                (or annualized, in usd equivalent)*
              </label>
            </div>
            <div className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    {...register("minSalary")}
                    id="minSalary"
                    name="minSalary"
                    className={classNames("block", "w-full", "input-indigo", {
                      "bg-pink-200": errors.minSalary,
                    })}
                  >
                    <option value="">Minimum per year</option>
                    {salaryOptions.map((value, index) => (
                      <option key={index} value={value}>
                        USD {value} per year
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-col">
                    <span className="span-error">
                      {errors.minSalary?.message}
                    </span>
                  </div>
                </div>
                <div>
                  <select
                    {...register("maxSalary")}
                    id="maxSalary"
                    name="maxSalary"
                    className={classNames("block", "w-full", "input-indigo", {
                      "bg-pink-200": errors.maxSalary,
                    })}
                  >
                    <option value="">Maximum per year</option>
                    {salaryOptions.map((value, index) => (
                      <option key={index} value={value}>
                        USD {value} per year
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-col">
                    <span className="span-error">
                      {errors.maxSalary?.message}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job description*/}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="description" className="label-default">
                Job description*
              </label>
            </div>
            <div className="sm:col-span-2">
              <Controller
                control={control}
                name="description"
                // {...register("description")}
                // rules={{
                //   required: "Description must have some content.",
                //   validate: (value) => {
                //     console.log("Controller", value);
                //     return (
                //       value.split(" ").length > 10 ||
                //       "Enter at least 10 words in the body."
                //     );
                //   },
                // }}
                render={({
                  field: { onChange, value, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <Editor
                    onChange={(description, delta, source, editor) => {
                      console.log(
                        "onChange:description",
                        description,
                        delta,
                        source,
                        editor
                      );
                      console.log("onChange:inputRef", ref);
                      onChange(description);
                    }}
                    value={value || ""}
                    inputRef={ref}
                    theme="snow"
                    id="description"
                  />
                )}
              />
              <span className="span-error">{errors.description?.message}</span>
            </div>
          </div>

          {/* How to apply*/}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="howtoApply" className="label-default">
                How to apply*
              </label>
            </div>
            <div className="sm:col-span-2">
              <textarea
                {...register("howtoApply")}
                id="howtoApply"
                name="howtoApply"
                rows={3}
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.howtoApply,
                })}
              />
              <span className="span-error">{errors.howtoApply?.message}</span>
            </div>
          </div>

          {/* Apply url */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="applyUrl" className="label-default">
                Apply url*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("applyUrl")}
                id="applyUrl"
                name="applyUrl"
                type="text"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.applyUrl,
                })}
                placeholder="https://"
              />
              <span className="span-error">{errors.applyUrl?.message}</span>
            </div>
          </div>

          {/* Apply email */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="applyEmail" className="label-default">
                Apply email*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("applyEmail")}
                id="applyEmail"
                name="applyEmail"
                type="text"
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.applyEmail,
                })}
                placeholder="Apply email"
              />
              <span className="span-error">{errors.applyEmail?.message}</span>
            </div>
          </div>
        </div>

        {/* Job post design */}
        <div className="relative mt-20 mb-32 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          {/* show logo */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                {...register("showLogo")}
                id="showLogo"
                name="showLogo"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="showLogo"
                className="ml-2 block text-sm text-gray-900"
              >
                Show company logo
              </label>
            </div>
          </div>
          <div></div>

          {/* blast email */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                {...register("blastEmail")}
                id="blastEmail"
                name="blastEmail"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="blastEmail"
                className="ml-2 block text-sm text-gray-900"
              >
                Email blast
              </label>
            </div>
          </div>
          <div></div>

          {/* Highlight */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                {...register("highlight")}
                id="highlight"
                name="highlight"
                type="checkbox"
                onChange={handleHighlightChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="highlight"
                className="ml-2 block text-sm text-gray-900"
              >
                Highlight
              </label>
            </div>
          </div>

          {/* Highlight with company brand color*/}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                {...register("highlightColor")}
                id="highlightColor"
                name="highlightColor"
                type="checkbox"
                onChange={handleHighlightChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="highlightColor"
                className="ml-2 block text-sm text-gray-900"
              >
                Highlight with the company's brand color
                <input
                  {...register("brandColor")}
                  id="brandColor"
                  name="brandColor"
                  type="color"
                  className="mx-4 w-8 h-4"
                />
              </label>
            </div>
          </div>

          {/* Sticky 1 day */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                id="day"
                name="day"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={watchStickyDuration === "day"}
                onChange={handleStickyDurationChange}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="day" className="ml-2 block text-sm text-gray-900">
                Sticky for 24 hours
              </label>
            </div>
          </div>

          {/* Sticky 1 week */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                id="week"
                name="week"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={watchStickyDuration === "week"}
                onChange={handleStickyDurationChange}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="week"
                className="ml-2 block text-sm text-gray-900"
              >
                Sticky for 1 entire week
              </label>
            </div>
          </div>

          {/* Sticky 1 month */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                id="month"
                name="month"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={watchStickyDuration === "month"}
                onChange={handleStickyDurationChange}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="month"
                className="ml-2 block text-sm text-gray-900"
              >
                Sticky for 1 entire month
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute left-0 right-0 bottom-0 flex-shrink-0 px-4 border-t border-gray-200 py-5 sm:px-6 bg-white">
        <div className="space-x-3 flex justify-between">
          {/* <div className="w-32">
            <select
              {...register("status")}
              className="block w-full input-indigo "
            >
              {statusOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div> */}
          <div>{renderActionButtons()}</div>

          <button type="submit" className="btn-indigo">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
