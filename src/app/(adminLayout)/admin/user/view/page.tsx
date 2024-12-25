"use client";

import { useGetUsersQuery } from "@/redux/api/UserApi";
import React from "react";
import { Table } from "antd";

const UserTrack = () => {
  const { data, isLoading } = useGetUsersQuery({
    refetchOnMountOrArgChange: true,
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl text-blue-500 font-semibold mb-4">
        User List
      </h1>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "No users found" }}
      />
    </div>
  );
};

export default UserTrack;
