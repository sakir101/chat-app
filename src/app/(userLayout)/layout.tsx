"use client";

import Contents from "../../components/ui/Contents";
import Sidebar from "@/components/ui/Sidebar";
import {
  getSocketInfo,
  getUserInfo,
  isLoggedIn,
  userVerificationCheck,
} from "@/services/auth.service";
import { Layout } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { USER_ROLE } from "@/constant/role";
import { Secret } from "jsonwebtoken";
import { reconnectSocket } from "@/socket/socket";

const DashboardLayoutUser = ({ children }: { children: React.ReactNode }) => {
  const userLoggedIn = isLoggedIn();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socket = getSocketInfo() as any;

  useEffect(() => {
    if (!userLoggedIn) {
      router.push("/login");
    }

    const { role, exp } = getUserInfo() as any;
    if (!(exp * 1000 > Date.now())) {
      router.push("/login");
    }

    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_USER;
    const verifyToken = userVerificationCheck(secretKey as Secret);

    if (role !== USER_ROLE.USER || verifyToken === null || socket === "false") {
      router.push("/error");
    }

    if (socket === "true") {
      reconnectSocket().then(({ success, users }) => {
        if (success) {
          console.log("Reconnected successfully. Online users");
        } else {
          console.log("No active session to reconnect");
        }
      });
    }

    setIsLoading(true);
  }, [userLoggedIn, router]);

  if (!isLoading) {
    return <Loading />;
  }

  return (
    <Layout hasSider>
      <Sidebar />
      <Contents>{children}</Contents>
    </Layout>
  );
};

export default DashboardLayoutUser;
