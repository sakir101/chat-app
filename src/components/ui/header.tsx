"use client";

import { Avatar, Button, Dropdown, Layout, Row, Space } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  getSocketInfo,
  getUserInfo,
  removeSocketInfo,
  removeUserInfo,
} from "@/services/auth.service";
import { authKey, socketKey } from "@/constant/storageKey";
import { useRouter } from "next/navigation";
import { disconnectSocket } from "@/socket/socket";

const { Header: AntHeader } = Layout;

const Header = () => {
  const router = useRouter();
  const logOut = () => {
    const { role, userId: id } = getUserInfo() as any;
    const connected: boolean = getSocketInfo() as any;
    disconnectSocket(id);
    removeSocketInfo(socketKey);

    removeUserInfo(authKey);

    router.push("/login");
  };
  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <Button onClick={logOut} type="text" danger>
          Logout
        </Button>
      ),
    },
  ];
  return (
    <AntHeader
      style={{
        background:
          "linear-gradient(to right, #051937, #001b4b, #001c5f, #001b71, #0c1682)",
      }}
    >
      <Row
        justify="end"
        align="middle"
        style={{
          height: "100%",
        }}
      >
        <Dropdown menu={{ items }}>
          <a>
            <Space wrap size={16}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </Row>
    </AntHeader>
  );
};

export default Header;
