import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import authActions from "../../redux/auth/actions";
import { getProfile } from "../../lib/utils";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileDropdown(props) {
  const { isMobile } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { token } = useSelector((state) => state.auth);
  const profile = getProfile(token);

  function handleLogout() {
    dispatch(authActions.logout(history));
  }

  return (
    <Menu as="div" className="px-3 mt-6 relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            {isMobile ? (
              <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </Menu.Button>
            ) : (
              <Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500">
                <span className="flex w-full justify-between items-center">
                  <span className="flex min-w-0 items-center justify-between space-x-3">
                    <img
                      className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                      src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="flex-1 flex flex-col min-w-0">
                      <span className="text-gray-900 text-sm font-medium truncate">
                        {profile.fullName}
                      </span>
                      <span className="text-gray-500 text-sm truncate">
                        {profile.email}
                      </span>
                    </span>
                  </span>
                  <SelectorIcon
                    className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </span>
              </Menu.Button>
            )}
          </div>
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
              className={`${
                isMobile ? "-left-28" : "left-0"
              } z-10 mx-3 origin-top absolute right-0  mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none`}
            >
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/admin/account/profile"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/admin/account/password"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Change Password
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

ProfileDropdown.prototype = {
  isMobile: PropTypes.bool,
};

ProfileDropdown.defaultProps = {
  isMobile: false,
};
