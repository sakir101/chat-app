"use client";

import { Row } from "antd";
import Image from "next/image";
import error from "../assets/error.png";

const ErrorPage = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
        color: "red",
      }}
    >
      <Image src={error} width={500} alt="Error Image" />
    </Row>
  );
};

export default ErrorPage;
