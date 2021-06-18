import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userActions from "../../../redux/user/actions";
import TReactTable from "../Datatable/TReactTable";
import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import SideOverlay from "./../../Shared/SideOverlay/SideOverlay";
import {
  ChevronRightIcon,
  DotsVerticalIcon,
  DuplicateIcon,
  PencilAltIcon,
  SearchIcon,
  SelectorIcon,
  TrashIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import UserDetail from "./UserDetail";
import { useHistory } from "react-router";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function UserList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditting, setIsEditting] = useState(false);

  const history = useHistory();

  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.users);

  const renderActionDropdown = (obj) => {
    return (
      <Menu as="div" className="relative flex justify-end items-center">
        {({ open }) => (
          <>
            <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <span className="sr-only">Open options</span>
              <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
              >
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "group flex items-center px-4 py-2 text-sm"
                        )}
                        onClick={() => handleEditClick(obj._id)}
                      >
                        <PencilAltIcon
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Edit
                      </span>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "group flex items-center px-4 py-2 text-sm"
                        )}
                        onClick={() => handleDeleteClick(obj._id)}
                      >
                        <TrashIcon
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Delete
                      </span>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    );
  };

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  function handleAddClick() {
    setIsEditting(false);
    setIsOpen(true);
  }

  function handleEditClick(id) {
    console.log("handleEditClick", id);
    dispatch(userActions.retrieve(id, history));
    setIsEditting(true);
    setIsOpen(true);
  }

  function handleDeleteClick(id) {
    dispatch(userActions.delete(id, history));
  }

  if (!items) return null;

  return (
    <div>
      <button
        type="submit"
        className="mb-10 mr-auto ml-10  py-2 px-4 inline-flex font-sans justify-center border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleAddClick}
      >
        Create User
      </button>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((user, index) => {
            return (
              <tr key={index} className="text-gray-900 text-center">
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-between">
                  <span>{user.isAdmin ? "Admin" : "User"}</span>
                  <div>{renderActionDropdown(user)}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <SideOverlay
        className="w-screen max-w-3xl relative border-l border-gray-200"
        open={isOpen}
        setOpen={setIsOpen}
      >
        <UserDetail isEdit={isEditting} setIsOpen={setIsOpen} />
      </SideOverlay>
    </div>
  );
}
