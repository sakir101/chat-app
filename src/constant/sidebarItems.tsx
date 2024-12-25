import { MenuProps } from "antd";
import {
  ProfileOutlined,
  HeartOutlined,
  MonitorOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export const sidebarItems = (role: string) => {
  const defaultSidebarItems: MenuProps["items"] = [
    {
      label: <p className="text-white hover:text-slate-400">Profile</p>,
      key: "profile",
      icon: <ProfileOutlined style={{ color: "white" }} />,
      children: [
        {
          label: (
            <Link
              className="text-white hover:text-slate-400"
              href={`/${role}/profile/account-profile`}
            >
              Account Profile
            </Link>
          ),
          key: `/${role}/profile/account-profile`,
        },
      ],
    },
    {
      label: <p className="text-white hover:text-slate-400">Message</p>,
      icon: <HeartOutlined style={{ color: "white" }} />,
      key: "Message",
      children: [
        {
          label: (
            <Link
              className="text-white hover:text-slate-400"
              href={`/${role}/message/chat`}
            >
              Chat
            </Link>
          ),
          key: `/${role}/message/chat`,
        },
      ],
    },
  ];

  const commonAdminSidebarItems: MenuProps["items"] = [
    {
      label: <p className="text-white hover:text-slate-400">User</p>,
      icon: <HeartOutlined style={{ color: "white" }} />,
      key: "User",
      children: [
        {
          label: (
            <Link
              className="text-white hover:text-slate-400"
              href={`/${role}/user/view`}
            >
              View
            </Link>
          ),
          key: `/${role}/user/view`,
        },
      ],
    },
    {
      label: <p className="text-white hover:text-slate-400">Form</p>,
      icon: <HeartOutlined style={{ color: "white" }} />,
      key: "Form",
      children: [
        {
          label: (
            <Link
              className="text-white hover:text-slate-400"
              href={`/${role}/form/create`}
            >
              Create
            </Link>
          ),
          key: `/${role}/form/create`,
        },
        {
          label: (
            <Link
              className="text-white hover:text-slate-400"
              href={`/${role}/form/view`}
            >
              View
            </Link>
          ),
          key: `/${role}/form/view`,
        },
        {
          label: (
            <Link
              className="text-white hover:text-slate-400"
              href={`/${role}/form/dataTable`}
            >
              Data Table
            </Link>
          ),
          key: `/${role}/form/dataTable`,
        },
      ],
    },
  ];

  const adminSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    ...commonAdminSidebarItems,
  ];

  const userSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: <p className="text-white hover:text-slate-400">Form</p>,
      icon: <HeartOutlined style={{ color: "white" }} />,
      key: "Form",
      children: [
        {
          label: (
            <Link
              className="text-white hover:text-slate-400"
              href={`/${role}/form/addData`}
            >
              Add Data
            </Link>
          ),
          key: `/${role}/form/addData`,
        },
      ],
    },
  ];

  if (role === "admin") {
    return adminSidebarItems;
  } else if (role === "user") {
    return userSidebarItems;
  } else {
    return defaultSidebarItems;
  }
};
