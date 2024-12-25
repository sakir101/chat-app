"use client";

import { useUserLoginMutation } from "@/redux/api/authApi";
import {
  getUserInfo,
  removeUserInfo,
  socketInfo,
  storeUserInfo,
} from "@/services/auth.service";
import { Button, Col, Row, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import Form from "../Forms/Form";
import FormInput from "../Forms/FormInput";
import Link from "next/link";
import loginImage from "../../assets/login-image.png";
import { connectSocket } from "@/socket/socket";
import { authKey } from "@/constant/storageKey";

type FormValues = {
  id: string;
  password: string;
};

const LoginPage = () => {
  const [userLogin] = useUserLoginMutation();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    const key = "loadingKey";
    message.loading({ content: "Loading...", key });
    try {
      const res = await userLogin({ ...data }).unwrap();
      console.log(res);
      if (res?.accessToken) {
        storeUserInfo({ accessToken: res?.accessToken });
        const { role, userId: id } = getUserInfo() as any;
        const socket = await connectSocket(id);
        if (socket.success) {
          socketInfo({ connected: true });
          message.success("User logged in successfully!");
        } else {
          message.error("User logged in fail");
          removeUserInfo(authKey);
        }

        router.push(`/${role}/profile/account-profile`);

        message.destroy(key);
      }
    } catch (err: any) {
      console.error(err.message);
      message.error("User logged in fail");
      message.destroy(key);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
      }}
    >
      <Col sm={12} md={16} lg={10}>
        <Image
          src={loginImage}
          alt="login image"
          layout="responsive"
          width={500}
          height={300}
          className="max-w-full h-auto"
        />
      </Col>
      <Col sm={12} md={8} lg={8}>
        <h1
          style={{
            margin: "15px 0px",
          }}
        >
          Login your account
        </h1>
        <div>
          <Form submitHandler={onSubmit} formKey="loginUser">
            <div>
              <FormInput
                name="email"
                type="email"
                size="large"
                label="User Email"
              />
            </div>
            <div
              style={{
                margin: "15px 0px",
              }}
            >
              <FormInput
                name="password"
                type="password"
                size="large"
                label="User Password"
              />
            </div>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;
