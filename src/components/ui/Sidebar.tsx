"use client";

import { Layout, Menu, ConfigProvider } from "antd";
import { useState } from "react";
import type { MenuProps } from "antd";
import { sidebarItems } from "@/constant/sidebarItems";
import { USER_ROLE } from "@/constant/role";
import { getUserInfo } from "@/services/auth.service";
import sidebar from "./sidebar.module.css";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const { role } = getUserInfo() as any;

  return (
    <Sider
      className="z-50 color"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #051937, #001b4b, #001c5f, #001b71, #0c1682)",
        color: "white",
      }}
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {}}
      onCollapse={(collapsed, type) => {}}
      width={280}
    >
      <div
        style={{
          color: "white",
          fontSize: "2rem",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        {collapsed ? "" : "Intellicruit"}
      </div>
      <Menu
        className="text-white"
        style={{
          background:
            "linear-gradient(to right, #051937, #001b4b, #001c5f, #001b71, #0c1682)",
          color: "white",
          marginTop: 30,
        }}
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={sidebarItems(role)}
        expandIcon={({ isOpen }) => (
          <span
            style={{
              color: "white", // Change this color to your preferred one
            }}
          >
            {isOpen ? <UpOutlined /> : <DownOutlined />}
          </span>
        )}
      />
    </Sider>
  );
};

export default Sidebar;
