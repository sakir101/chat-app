import { useEffect, useState } from "react";

import SidebarSkeleton from "./skeletons/SidebarSkeletons";
import { Users } from "lucide-react";
import { getUserInfo } from "@/services/auth.service";
import { useFetchUsersQuery } from "@/redux/api/message";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSelectedUser } from "@/redux/slice/chatSlice";
import Image from "next/image";

const Sidebar = () => {
  const { userId: id } = getUserInfo() as any;
  const { data: users, isLoading: isUsersLoading } = useFetchUsersQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useAppDispatch();
  const { selectedUser } = useAppSelector((state) => state.chat);
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        <div></div>
        {users.map((user: any) => (
          <button
            key={user._id}
            onClick={() => dispatch(setSelectedUser(user))}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <Image
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt={user.name}
                width={48} // Set your desired width
                height={48} // Set your desired height
                className="object-cover rounded-full"
              />
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
