import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DropzoneUploader from "../../Shared/DropzoneUploader/DropzoneUploader";
import Editor from "../../Shared/MDEditor/Editor";
import companyApi from "../../../service/companyApi";
import jobApi from "../../../service/jobApi";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:5000";
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
  const { jobId, setOpen } = props;
  const [companyId, setCompanyId] = useState(null);

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
      companyTwitter: Yup.string().required("This field is required"),
      companyEmail: Yup.string().required("This field is required"),
      invoiceAddress: Yup.string().required("This field is required"),
      invoiceNotes: Yup.string().required("This field is required"),

      isShowLogo: Yup.bool().required("This field is required"),
      isBlastEmail: Yup.bool().required("This field is required"),
      isHighlight: Yup.bool().required("This field is required"),
      highlightColor: Yup.string(),
      stickyDuration: Yup.string()
        .oneOf(stickyDurationOptions)
        .required("This field is required"),

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

  console.log("watchCompanyLogo", watchCompanyLogoUrl);
  useEffect(() => {
    console.log("formState", formState);
    console.log("getValues", getValues());
  });

  async function fetchJobDetail() {
    try {
      if (!jobId) return;
      let { data } = await jobApi.retrieve(jobId);
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

        isShowLogo,
        isBlastEmail,
        isHighlight,
        highlightColor,
        isStickyDay,
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
        // companyLogo: logo, // media obj id
        companyTwitter: twitter,
        companyEmail: email,
        invoiceAddress,
        invoiceNotes,

        isShowLogo,
        isBlastEmail,
        isHighlight,
        highlightColor: highlightColor || defaultHighlightColor,
        isStickyDay,
        stickyDuration,
        status,
      });
      setValue("companyLogo", logo, { shouldValidate: true });
    } catch (error) {
      console.log("Editjob->fetchJobDetail", error);
    }
  }

  function handleUpload(file) {
    console.log("handleUpload", file);
    setValue("companyLogo", file, { shouldValidate: true });
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
        isShowLogo: formData.isShowLogo,
        isBlastEmail: formData.isBlastEmail,
        isHighlight: formData.isHighlight,
        highlightColor: formData.highlightColor,
        isStickyDay: formData.isStickyDay,
        stickyDuration: formData.stickyDuration,
        status: formData.status,
      };

      res = await jobApi.update(job);
      console.log("onSubmit->udpateJob", res);

      toast.success("Saved successfully!");
    } catch (error) {
      console.log("EditJob->onSubmit", error);
      toast.warning("Server error");
    }
  }

  function handleApprove(e) {
    setValue("status", "approved");
    handleSubmit(onSubmit);
  }
  function handleDecline(e) {
    setValue("status", "declined");
    handleSubmit(onSubmit);
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
              <label
                htmlFor="companyName"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Company name*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("companyName")}
                type="text"
                name="companyName"
                id="companyName"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.companyName ? "bg-error" : ""
                }`}
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.companyName?.message}
              </span>
            </div>
          </div>

          {/* Company Logo */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="companyLogo"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Company logo <br /> (.jpg or .png)
              </label>
            </div>
            <input
              {...register("companyLogo")}
              id="companyLogo"
              name="companyLogo"
              type="text"
              className="sr-only"
            />
            <div className="col-span-2">
              <div className="flex flex-col">
                <div className="p-4">
                  {watchCompanyLogoUrl && (
                    <img
                      src={`${baseUrl}/uploads/${watchCompanyLogoUrl}`}
                      alt="company logo"
                      className="w-full border-2 border-gray-200 rounded-lg"
                    />
                  )}
                </div>

                <DropzoneUploader onUpload={handleUpload}>
                  <div className="dz-message">
                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                </DropzoneUploader>
                <span className="mt-2 text-xs text-pink-500">
                  {errors.companyLogo?.message}
                </span>
              </div>
            </div>
          </div>

          {/* Company twitter */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="companyTwitter"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Company twitter
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("companyTwitter")}
                id="companyTwitter"
                name="companyTwitter"
                type="text"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.companyTwitter ? "bg-error" : ""
                }`}
                placeholder="username"
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.companyTwitter?.message}
              </span>
            </div>
          </div>

          {/* Company email */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="companyEmail"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
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
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.companyEmail ? "bg-error" : ""
                }`}
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.companyEmail?.message}
              </span>
            </div>
          </div>

          {/* Invoice address */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="invoiceAddress"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Invoice address
              </label>
            </div>
            <div className="sm:col-span-2">
              <textarea
                {...register("invoiceAddress")}
                id="invoiceAddress"
                name="invoiceAddress"
                rows={5}
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.invoiceAddress ? "bg-error" : ""
                }`}
                placeholder="e.g. your company's full name and full invoice address, including building, street, city and country; also things like your VAT number, this is shown on the invoice."
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.invoiceAddress?.message}
              </span>
            </div>
          </div>

          {/* Invoice notes/po number */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="invoiceNotes"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Invoice notes / po number
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("invoiceNotes")}
                id="invoiceNotes"
                name="invoiceNotes"
                type="text"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.invoiceNotes ? "bg-error" : ""
                }`}
                placeholder="e.g. PO number 1234"
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.invoiceNotes?.message}
              </span>
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
              <label
                htmlFor="position"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Position*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("position")}
                id="position"
                name="position"
                type="text"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.position ? "bg-error" : ""
                }`}
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.position?.message}
              </span>
            </div>
          </div>

          {/* Primary Tag */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="company_name"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Primary tag*
              </label>
            </div>
            <div className="sm:col-span-2">
              <select
                {...register("primaryTag")}
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.primaryTag ? "bg-error" : ""
                }`}
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

          {/* Tags */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="tags"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Tags separated by comma*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("tags")}
                type="text"
                name="tags"
                id="tags"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.tags ? "bg-error" : ""
                }`}
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.tags?.message}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="location"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Job is restricted to location?*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("location")}
                type="text"
                name="location"
                id="location"
                defaultValue="Worldwide"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.location ? "bg-error" : ""
                }`}
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.location?.message}
              </span>
            </div>
          </div>

          {/* Annual Salary */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2">
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
                    className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                      errors.minSalary ? "bg-error" : ""
                    }`}
                  >
                    <option value="">Minimum per year</option>
                    {salaryOptions.map((value, index) => (
                      <option key={index} value={value}>
                        USD {value} per year
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-col">
                    <span className="mt-2 text-xs text-pink-500">
                      {errors.minSalary?.message}
                    </span>
                  </div>
                </div>
                <div>
                  <select
                    {...register("maxSalary")}
                    id="maxSalary"
                    name="maxSalary"
                    className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                      errors.maxSalary ? "bg-error" : ""
                    }`}
                  >
                    <option value="">Maximum per year</option>
                    {salaryOptions.map((value, index) => (
                      <option key={index} value={value}>
                        USD {value} per year
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-col">
                    <span className="mt-2 text-xs text-pink-500">
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
              <label
                htmlFor="description"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
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
              <span className="mt-2 text-xs text-pink-500">
                {errors.description?.message}
              </span>
            </div>
          </div>

          {/* How to apply*/}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="howtoApply"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                How to apply*
              </label>
            </div>
            <div className="sm:col-span-2">
              <textarea
                {...register("howtoApply")}
                id="howtoApply"
                name="howtoApply"
                rows={3}
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.howtoApply ? "bg-error" : ""
                }`}
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.howtoApply?.message}
              </span>
            </div>
          </div>

          {/* Apply url */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="applyUrl"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Apply url*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("applyUrl")}
                id="applyUrl"
                name="applyUrl"
                type="text"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.applyUrl ? "bg-error" : ""
                }`}
                placeholder="https://"
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.applyUrl?.message}
              </span>
            </div>
          </div>

          {/* Apply email */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="applyEmail"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Apply email*
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                {...register("applyEmail")}
                id="applyEmail"
                name="applyEmail"
                type="text"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.applyEmail ? "bg-error" : ""
                }`}
                placeholder="Apply email"
              />
              <span className="mt-2 text-xs text-pink-500">
                {errors.applyEmail?.message}
              </span>
            </div>
          </div>
        </div>

        {/* Job post design */}
        <div className="relative mt-20 mb-32 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          {/* show logo */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                {...register("isShowLogo")}
                id="isShowLogo"
                name="isShowLogo"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="isShowLogo"
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
                {...register("isBlastEmail")}
                id="isBlastEmail"
                name="isBlastEmail"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="isBlastEmail"
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
                {...register("isHighlight")}
                id="isHighlight"
                name="isHighlight"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="isHighlight"
                className="ml-2 block text-sm text-gray-900"
              >
                Highlight
              </label>
            </div>
          </div>

          {/* Highlight Company */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <input
                id="isHighlight"
                name="isHighlight"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="isHighlight"
                className="ml-2 block text-sm text-gray-900"
              >
                Highlight with the company's brand color
                <input
                  {...register("highlightColor")}
                  id="highlightColor"
                  name="highlightColor"
                  type="color"
                  className="mx-4 w-8 h-4"
                />
              </label>
            </div>
          </div>

          {/* Sticky 24 hours */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <select
                {...register("stickyDuration")}
                className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md "
              >
                {stickyDurationOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="isStickyDay"
                className="ml-2 block text-sm text-gray-900"
              >
                Sticky post for 24 hours
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
              className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md "
            >
              {statusOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div> */}
          <div>{renderActionButtons()}</div>

          <button
            type="submit"
            className="inline-flex full-width justify-center px-4 py-2 border border-transparent shadow-sm text-base font-bold rounded-md text-white bg-indigo-500 hover:bg-white hover:text-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}