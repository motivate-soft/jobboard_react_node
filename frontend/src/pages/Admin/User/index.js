import React from "react";
import UserList from "../../../components/Admin/User/UserList";

export default function User() {
  return (
    <div className="shadow bg-white border-b sm:rounded-lg">
      <div className="container mx-auto flex flex-col py-8">
        <UserList />
      </div>
    </div>
  );
}
