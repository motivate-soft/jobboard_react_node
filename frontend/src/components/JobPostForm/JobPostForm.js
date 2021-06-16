import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DropzoneUploader from "../Shared/DropzoneUploader/DropzoneUploader";
import Editor from "../Shared/MDEditor/Editor";
import JobPostDesign from "../JobPostDesign/JobPostDesign";
import { useJobPost } from "../../contexts/jobContext";
import classNames from "classnames";

const salaryOptions = Array(21)
  .fill(null)
  .map((u, i) => i * 10000);

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

export default function JobPostForm(props) {
  const { open, setOpen } = props;
  const { state, dispatch } = useJobPost();

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    position: Yup.string().required("Position is required"),
    primaryTag: Yup.string().required("PrimaryTag is required"),
    tags: Yup.string().required("Tags are required"),
    location: Yup.string().required("Location are required"),

    minSalary: Yup.number().required("Minimum salary is required"),
    maxSalary: Yup.number().required("Maximum salary is required"),
    jobDescription: Yup.string().required("Job description is required"),
    howtoApply: Yup.string().required("This field is required"),
    applyUrl: Yup.string().required("This field is required"),
    applyEmail: Yup.string().required("This field is required"),

    companyTwitter: Yup.string().required("This field is required"),
    companyEmail: Yup.string().required("This field is required"),
    invoiceAddress: Yup.string().required("This field is required"),
    invoiceNotes: Yup.string().required("This field is required"),
    payLater: Yup.bool(),

    // dob: Yup.string()
    //   .required("Date of Birth is required")
    //   .matches(
    //     /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
    //     "Date of Birth must be a valid date in the format YYYY-MM-DD"
    //   ),
    // email: Yup.string().required("Email is required").email("Email is invalid"),
    // password: Yup.string()
    //   .min(6, "Password must be at least 6 characters")
    //   .required("Password is required"),
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref("password"), null], "Passwords must match")
    //   .required("Confirm Password is required"),
    // acceptTerms: Yup.bool().oneOf([true], "Accept Ts & Cs is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, control, formState } = useForm(
    formOptions
  );

  const { errors } = formState;

  useEffect(() => {
    dispatch({
      type: "RESET_JOB",
    });
  }, []);

  useEffect(() => {
    console.log("formState", formState);
  });

  function handleChange(fieldName, value) {
    if (fieldName === "tags") {
      console.log("JobPostForm:useJobPost", state);

      let { tags } = state;
      tags = value.split(",").filter((tag) => tag !== "");

      dispatch({
        type: "UPDATE_JOB_DETAIL",
        payload: {
          tags,
        },
      });
      return;
    }
    dispatch({
      type: "UPDATE_JOB_DETAIL",
      payload: {
        [fieldName]: value,
      },
    });
  }

  function onSubmit(data) {
    console.log("onSubmit", data);
    // display form data on success
    alert("SUCCESS!! :-)\n\n" + JSON.stringify(data, null, 4));
    return false;
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
                Post a new job
              </Dialog.Title>
            </div>

            <div className="h-7 flex items-center">
              <Link
                to="/buy-bundle"
                className="mr-4 inline-flex font-sans justify-center py-2 px-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Buy a bundle
              </Link>
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

        {/* Job main info container */}
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
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
              <span className="text-xs text-indigo-500">
                {errors.companyName?.message}
              </span>
            </div>
          </div>

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
                onChange={(e) => handleChange("position", e.target.value)}
              />
              <span className="text-xs text-indigo-500">
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
                onChange={(e) => handleChange("primaryTag", e.target.value)}
              >
                <option value="">Select a primary tag</option>
                {primaryTagOptions.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <span className="text-xs text-indigo-500">
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
                onChange={(e) => handleChange("tags", e.target.value)}
              />
              <span className="text-xs text-indigo-500">
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
                onChange={(e) => handleChange("location", e.target.value)}
              />
              <span className="text-xs text-indigo-500">
                {errors.location?.message}
              </span>
            </div>
          </div>
        </div>

        {/* Job Post design */}
        <JobPostDesign />
        {/* Job detail container */}
        <div className="relative mt-20 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          <h3 class="px-4 py-4 text-xl leading-6 font-bold text-gray-900 sm:px-6 sm:py-5">
            Job details
          </h3>

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
            <div className="col-span-2">
              <div className="flex flex-col">
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
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        for="companyLogo"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="companyLogo"
                          name="companyLogo"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {/* <DropzoneUploader /> */}
                <span className="text-xs text-indigo-500">
                  {errors.companyLogo?.message}
                </span>
              </div>
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
                    <span className="text-xs text-indigo-500">
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
                    <span className="text-xs text-indigo-500">
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
                htmlFor="jobDescription"
                className="block text-md font-semibold text-gray-900 sm:mt-px sm:pt-2"
              >
                Job description*
              </label>
            </div>
            <div className="sm:col-span-2">
              <Controller
                control={control}
                name="jobDescription"
                // {...register("jobDescription")}
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
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                  formState,
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
                      console.log("inputRef", ref);
                      onChange(description);
                    }}
                    value={value || ""}
                    inputRef={ref}
                    theme="snow"
                    id="jobDescription"
                  />
                )}
              />
              <span className="text-xs text-indigo-500">
                {errors.jobDescription?.message}
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
              <span className="text-xs text-indigo-500">
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
              <span className="text-xs text-indigo-500">
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
              <span className="text-xs text-indigo-500">
                {errors.applyEmail?.message}
              </span>
            </div>
          </div>
        </div>

        {/* COMPANY detail container */}
        <div className="relative mt-6 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          <h3 class="px-4 py-4 text-xl leading-6 font-bold text-gray-900 sm:px-6 sm:py-5">
            Company
          </h3>

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
              <span className="text-xs text-indigo-500">
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
              <span className="text-xs text-indigo-500">
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
              <span className="text-xs text-indigo-500">
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
              <span className="text-xs text-indigo-500">
                {errors.invoiceNotes?.message}
              </span>
            </div>
          </div>

          {/* Pay option */}
          <div className="space-y-1 px-4 pt-5 py-40 sm:space-y-0 flex justify-items-center sm:gap-4 sm:px-6">
            <input
              id="payLater"
              name="payLater"
              type="checkbox"
              {...register("payLater")}
              className={` my-auto block shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                errors.payLater ? "bg-error" : ""
              }`}
            />
            <label htmlFor="payLater" className="form-check-label">
              PAY LATER
            </label>
            <div className="invalid-feedback">{errors.payLater?.message}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute left-0 right-0 bottom-0 flex-shrink-0 px-4 border-t border-gray-200 py-5 sm:px-6 bg-white">
        <div className="space-x-3 flex justify-center">
          <button
            type="submit"
            className="inline-flex full-width justify-center px-12 py-5 border border-transparent shadow-sm text-3xl font-bold rounded-md text-white bg-indigo-500 hover:bg-white hover:text-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Post your job — $<span className="font-bold">{state.price}</span>{" "}
          </button>
        </div>
      </div>
    </form>
  );
}
