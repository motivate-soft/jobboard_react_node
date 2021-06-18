import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userActions from "../../../redux/user/actions";
import TReactTable from "../Datatable/TReactTable";
import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { Transition } from "@headlessui/react";
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function UserList() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.users);

  const renderActionCell = (obj) => {
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
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "group flex items-center px-4 py-2 text-sm"
                        )}
                      >
                        <PencilAltIcon
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Edit
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "group flex items-center px-4 py-2 text-sm"
                        )}
                      >
                        <TrashIcon
                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Delete
                      </a>
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

  const columns = [
    {
      Header: "Name",
      accessor: "fullName",
      className:
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      style: {
        width: "unset",
        display: "flex",
      },
      sortType: "basic",

      Cell: ({ row: { original } }) => (
        <Link to={`/admin/user?id=${original.id}`}>
          {original.firstName + " " + original.lastName}
        </Link>
      ),
    },
    {
      Header: "Username",
      accessor: "username",
      className:
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      style: {
        width: "unset",
        display: "flex",
      },
      sortType: "basic",
      Cell: ({ row: { original } }) => (
        <Link to={`/admin/user?id=${original.id}`}>{original.username}</Link>
      ),
    },
    {
      Header: "Email",
      accessor: "email",
      className:
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      style: {
        width: "unset",
        display: "flex",
      },
      sortType: "basic",
      Cell: ({ row: { original } }) => <p>{original.email}</p>,
    },
    {
      Header: "Action",
      accessor: "action",
      className:
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      style: {
        width: "unset",
        display: "flex",
      },
      Cell: ({ row: { original } }) => renderActionCell(original),
    },
  ];

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  if (!items) return null;

  return (
    <div>
      <TReactTable columns={columns} data={items} />
    </div>
  );
}
