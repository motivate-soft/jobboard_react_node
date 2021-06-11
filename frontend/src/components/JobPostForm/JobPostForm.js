import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {
  LinkIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import classNames from "classnames";
import DropzoneUploader from "../DropzoneUploader/DropzoneUploader";
import Editor from "../MDEditor/Editor";
import { useJobPost } from "../../contexts/jobContext";
import { Link } from "react-router-dom";
import JobPostDesign from "../JobPostDesign/JobPostDesign";

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
    applyEmail: Yup.string().required("This field description is required"),

    companyTwitter: Yup.string().required("This field description is required"),
    companyEmail: Yup.string().required("This field description is required"),
    invoiceAddress: Yup.string().required("This field description is required"),
    invoiceNotes: Yup.string().required("This field description is required"),
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
        <div className="relative py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          <div className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1  rounded-top rounded-md rounded-b-none border border-b-0 border-gray-200 bg-white ">
            <h5 className="uppercase">LET'S START</h5>
          </div>
          {/* Company name */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="companyName"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                Company name*
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.companyName?.message}
              </span>
              <span className="text-xs">
                Your company's brand/trade name: without Inc., Ltd., B.V., Pte.,
                etc.
              </span>
            </div>
          </div>

          {/* Position*/}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="position"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                Position*
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.position?.message}
              </span>
              <span className="text-xs">
                Please specify as single job position like "Marketing Manager"
                or "Node JS Developer", not a sentence like "Looking for PM /
                Biz Dev / Manager". We know your job is important but please DO
                NOT WRITE IN FULL CAPS. If posting multiple roles, please create
                multiple job posts. A job post is limited to a single job. We
                only allow real jobs, absolutely no MLM-type courses "learn how
                to work online" please.
              </span>
            </div>
          </div>

          {/* Primary Tag */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="company_name"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                PRIMARY TAG*
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.primaryTag?.message}
              </span>
              <span className="text-xs">
                This primary tag shows first and increases visibility in the
                main sections. Your job is shown on every page that is tagged
                with though. E.g. if you tag it as PHP, it shows for Remote PHP
                Jobs etc.
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="tags"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                TAGS SEPARATED BY COMMA*
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.tags?.message}
              </span>
              <span className="text-xs">
                Short tags are preferred. Use tags like industry and tech stack,
                and separate multiple tags by comma. The first 3 or 4 tags are
                shown on the site, the other tags aren't but the job will be
                shown on each tag specific page (like /remote-react-jobs). We
                also generate tags automatically after you post/edit to
                supplement.
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="location"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                JOB IS RESTRICTED TO LOCATION?*
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.location?.message}
              </span>
              <span className="text-xs">
                If you'd only like to hire people from a specific location or
                timezone this remote job is restricted to (e.g. Europe, United
                States or CET Timezone). If not restricted, please leave it as
                "Worldwide". The less restricted this is, the more applicants
                you will get. Keeping it "Worldwide" is highly recommended as
                you'll have access to a worldwide pool of talent. To promote
                fairness in remote work positions, worldwide jobs are ranked
                higher.
              </span>
            </div>
          </div>
        </div>

        {/* Job Post design */}
        <JobPostDesign />
        {/* Job detail container */}
        <div className="relative mt-6 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          <div className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2  rounded-top rounded-md rounded-b-none border border-b-0 border-gray-200 bg-white ">
            <h5 className="uppercase">Job details</h5>
          </div>

          {/* Company Logo */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="companyLogo"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                COMPANY LOGO (.JPG OR .PNG)
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <DropzoneUploader />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.companyLogo?.message}
              </span>
            </div>
          </div>

          {/* Annual Salary */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2">
                ANNUAL SALARY OR COMPENSATION IN USD (OR ANNUALIZED, IN USD
                EQUIVALENT)*
              </label>
            </div>
            <div className="grid grid-cols-2">
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

          {/* Job description*/}
          {/* <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
          <div>
            <label
              htmlFor="jobDescription"
              className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
            >
              JOB DESCRIPTION*
            </label>
          </div>
          <div>
            <Controller
              control={control}
              name="jobDescription"
              rules={{
                required: "Description must have some content.",
                validate: (value) => {
                  console.log("Controller", value);
                  return (
                    value.split(" ").length > 10 ||
                    "Enter at least 10 words in the body."
                  );
                },
              }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: {
                  invalid,
                  isTouched,
                  isDirty,
                  error,
                },
                formState,
              }) => (
                <Editor
                  onChange={onChange}
                  value={value}
                  inputRef={ref}
                  theme="snow"
                  id="jobDescription"
                />
              )}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-indigo-500">
              {errors.jobDescription?.message}
            </span>
          </div>
        </div> */}

          {/* How to apply*/}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="howtoApply"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                HOW TO APPLY?*
              </label>
            </div>
            <div>
              <textarea
                {...register("howtoApply")}
                id="howtoApply"
                name="howtoApply"
                rows={3}
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.howtoApply ? "bg-error" : ""
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.howtoApply?.message}
              </span>
            </div>
          </div>

          {/* Apply url */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="applyUrl"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                APPLY URL*
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.applyUrl?.message}
              </span>
            </div>
          </div>

          {/* Apply email */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="applyEmail"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                APPLY EMAIL*
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.applyEmail?.message}
              </span>
            </div>
          </div>
        </div>

        {/* COMPANY detail container */}
        <div className="relative mt-6 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          <div className="absolute  left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2  rounded-top rounded-md rounded-b-none border border-b-0 border-gray-200 bg-white ">
            <h5 className="uppercase">COMPANY</h5>
          </div>

          {/* Company twitter */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="companyTwitter"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                COMPANY TWITTER
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.companyTwitter?.message}
              </span>
            </div>
          </div>

          {/* Company email */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="companyEmail"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                COMPANY EMAIL* (STAYS PRIVATE, FOR INVOICE + EDIT LINK)
              </label>
            </div>
            <div>
              <input
                {...register("companyEmail")}
                id="companyEmail"
                name="companyEmail"
                type="text"
                className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md ${
                  errors.companyEmail ? "bg-error" : ""
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.companyEmail?.message}
              </span>
            </div>
          </div>

          {/* Invoice address */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="invoiceAddress"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                INVOICE ADDRESS
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.invoiceAddress?.message}
              </span>
            </div>
          </div>

          {/* Invoice notes/po number */}
          <div className="space-y-1 px-4 sm:space-y-0 flex flex-col sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="invoiceNotes"
                className="block font-bold text-lg uppercase text-gray-900 sm:mt-px sm:pt-2"
              >
                INVOICE NOTES / PO NUMBER
              </label>
            </div>
            <div>
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
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-500">
                {errors.invoiceNotes?.message}
              </span>
            </div>
          </div>

          {/* Pay option */}
          <div className="space-y-1 px-4 sm:space-y-0 flex justify-items-center sm:gap-4 sm:px-6 sm:py-5">
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
            className="inline-flex full-width justify-center px-12 py-5 border border-transparent shadow-sm text-3xl font-bold rounded-md text-white bg-orange hover:bg-white hover:text-orange transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Post your job — $<span className="font-bold">{state.price}</span>{" "}
          </button>
        </div>
      </div>
    </form>
  );
}
