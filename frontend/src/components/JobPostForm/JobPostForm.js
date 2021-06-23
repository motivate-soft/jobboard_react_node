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
import companyApi from "../../service/companyApi";
import jobApi from "../../service/jobApi";
import { toast } from "react-toastify";
import classNames from "classnames";

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

export default function JobPostForm(props) {
  const { open, setOpen } = props;
  const { state, dispatch } = useJobPost();

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

      companyLogo: Yup.string().required("This field is required"),
      companyTwitter: Yup.string().required("This field is required"),
      companyEmail: Yup.string().email().required("This field is required"),
      invoiceAddress: Yup.string().required("This field is required"),
      invoiceNotes: Yup.string().required("This field is required"),
      payLater: Yup.bool(),
    },
    ["applyEmail", "applyUrl"]
  );

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, setValue, control, formState } = useForm(
    formOptions
  );
  const { errors } = formState;

  useEffect(() => {
    dispatch({
      type: "RESET_JOB",
    });
  }, []);

  function handleChange(fieldName, value) {
    console.log("JobPostForm->handleChange:useJobpost", state);

    if (fieldName === "tags") {
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

  function handleUpload(file) {
    console.log("handleUpload", file);
    setValue("companyLogo", file._id, { shouldValidate: true });
  }

  async function onSubmit(formData) {
    console.log("onSubmit", formData);

    try {
      const company = {
        name: formData.companyName,
        logo: formData.companyLogo,
        twitter: formData.companyTwitter,
        email: formData.companyEmail,
        invoiceAddress: formData.invoiceAddress,
        invoiceNotes: formData.invoiceNotes,
      };
      let {
        data: { _id: companyId },
      } = await companyApi.create(company);

      const {
        tags,
        isShowLogo,
        isBlastEmail,
        isHighlight,
        isHighlightColor,
        highlightColor,
        isStickyDay,
        isStickyWeek,
        isStickyMonth,
      } = state;

      let stickyDuration;
      if (isStickyWeek) {
        stickyDuration = "week";
      }
      if (isStickyMonth) {
        stickyDuration = "month";
      }

      const job = {
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

        tags: tags,
        isShowLogo,
        isBlastEmail,
        isHighlight: isHighlight || isHighlightColor,
        highlightColor: isHighlightColor ? highlightColor : null,
        isStickyDay,
        stickyDuration,
      };

      let { data } = await jobApi.create(job);
      console.log("JobPostForm->onSubmit->success", data);
      toast.success("Job posted successfully");
    } catch (error) {
      console.log("JobPostForm->onSubmit->error", error);
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
                Post a new job
              </Dialog.Title>
            </div>

            <div className="h-7 flex items-center">
              <Link to="/buy-bundle" className="mr-4  btn-indigo">
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
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
              <span className="span-error">{errors.companyName?.message}</span>
            </div>
          </div>

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
                onChange={(e) => handleChange("position", e.target.value)}
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
                onChange={(e) => handleChange("primaryTag", e.target.value)}
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
                Tags separated by comma*
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
                onChange={(e) => handleChange("tags", e.target.value)}
              />
              <span className="span-error">{errors.tags?.message}</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="location" className="label-default">
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
                className={classNames("block", "w-full", "input-indigo", {
                  "bg-pink-200": errors.location,
                })}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              <span className="span-error">{errors.location?.message}</span>
            </div>
          </div>
        </div>

        {/* Job Post design */}
        <JobPostDesign />
        {/* Job detail container */}
        <div className="relative mt-20 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          <h3 className="px-4 py-4 text-xl leading-6 font-bold text-gray-900 sm:px-6 sm:py-5">
            Job details
          </h3>

          {/* Company Logo */}
          <div className="space-y-1 px-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="companyLogo" className="label-default">
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
                <DropzoneUploader onUpload={handleUpload} />
                <span className="span-error">
                  {errors.companyLogo?.message}
                </span>
              </div>
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

        {/* COMPANY detail container */}
        <div className="relative mt-6 py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200 border-2 border-gray-200 rounded-md">
          <h3 className="px-4 py-4 text-xl leading-6 font-bold text-gray-900 sm:px-6 sm:py-5">
            Company
          </h3>

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

          {/* Pay option */}
          <div className="space-y-1 px-4 pt-5 py-40 sm:space-y-0 flex justify-items-center sm:gap-4 sm:px-6">
            <input
              {...register("payLater")}
              id="payLater"
              name="payLater"
              type="checkbox"
              className={classNames("block", "my-auto", "input-indigo", {
                "bg-pink-200": errors.payLater,
              })}
            />
            <label htmlFor="payLater" className="form-check-label">
              PAY LATER
            </label>
            <span className="span-error">{errors.payLater?.message}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute left-0 right-0 bottom-0 flex-shrink-0 px-4 border-t border-gray-200 py-5 sm:px-6 bg-white">
        <div className="space-x-3 flex justify-center">
          <button type="submit" className="px-12 py-5 text-3xl btn-indigo">
            Post your job — $<span className="font-bold">{state.price}</span>{" "}
          </button>
        </div>
      </div>
    </form>
  );
}
