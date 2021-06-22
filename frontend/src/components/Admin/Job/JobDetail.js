import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import jobActions from "../../../redux/job/actions";

export default function JobDetail(props) {
  const { isEdit, setIsOpen } = props;
  const dispatch = useDispatch();
  const job = useSelector((state) => state.jobs.selectedItem);

  useEffect(() => {
    if (isEdit && job) {
      const { email, jobname, firstName, lastName } = job;
      reset({ email, jobname, firstName, lastName });
    }
  }, [job]);

  const validationSchema = yup.object().shape({});

  const { register, handleSubmit, reset, control, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  function onSubmit(data) {
    console.log("onSubmit", data);
    if (isEdit) {
      dispatch(jobActions.update({ ...data, id: job._id }, history));
    } else {
      dispatch(jobActions.create(data, history));
    }
    setIsOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isEdit ? "Edit" : "Create"} Job
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <button
                type="reset"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-500 bg-whit hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

JobDetail.prototype = {
  isEdit: PropTypes.bool,
};

JobDetail.defultProps = {
  isEdit: false,
};
