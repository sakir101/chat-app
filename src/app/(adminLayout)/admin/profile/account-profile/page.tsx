"use client";

import Loading from "@/app/loading";
import { useGetSingleAdminQuery } from "@/redux/api/admin";
import { getUserInfo } from "@/services/auth.service";
import React from "react";

const AccountSuperAdmin = () => {
  const { userId: id } = getUserInfo() as any;

  const { data, isLoading, refetch } = useGetSingleAdminQuery(
    id,

    { refetchOnMountOrArgChange: true }
  );
  return (
    <div className="mt-5 lg:mt-7 p-4">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {Object.keys(data || {}).length > 0 && (
            <div className="flex flex-col justify-center items-center">
              <div className="text-center text-xl mt-5">
                <span>{data?.fullName}</span>
              </div>
              <div className="divider"></div>
              <div className="mt-1">
                <p className="text-xl text-center">Personal Information</p>
              </div>

              <div className="mt-5 grid grid-cols-2 justify-items-center items-center mx-auto ">
                <div>
                  <p className="mb-5">
                    <span className="text-lg text-gray-600 ">Email</span>
                  </p>
                </div>
                <div>
                  <p className="mb-5">
                    <span className="text-lg font-semibold">{data?.email}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AccountSuperAdmin;
