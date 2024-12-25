"use client";

import { Button, Col, Row, message } from "antd";
import Form from "../Forms/Form";
import FormInput from "../Forms/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupUserSchema } from "@/schemas/signup";
import { useSignUpUserMutation } from "@/redux/api/UserApi";
import { useState } from "react";

const SignUpUser = () => {
  const [success, setSuccess] = useState(false);
  const [signUpUser, { isSuccess, isError, isLoading }] =
    useSignUpUserMutation();
  const [validation, setValidation] = useState(false);

  const onSubmit = async (values: any) => {
    console.log(values);
    const obj = { ...values };
    delete obj["confPassword"];
    obj["role"] = "user";
    const data = JSON.stringify(obj);

    const key = "loadingKey";
    message.loading({ content: "Loading...", key });

    signUpUser(data)
      .unwrap()
      .then(() => {
        message.success("Registration successful");
        setValidation(false);
        setSuccess(true);
      })
      .catch((err) => {
        message.error("User Registration Failed!");
        setSuccess(false);
        setValidation(true);
      })
      .finally(() => {
        message.destroy(key);
      });
  };

  return (
    <div
      className="flex justify-center items-center p-5"
      style={{
        minHeight: "100vh",
      }}
    >
      <div className="my-5">
        <h1
          className="text-center"
          style={{
            margin: "15px 0px",
            color: "#CC9DF1",
          }}
        >
          Create your account
        </h1>
        <div>
          <Form
            submitHandler={onSubmit}
            resolver={yupResolver(signupUserSchema)}
            formKey="signupUser"
          >
            <div className="p-3 bg-slate-300 shadow-md shadow-slate-600 rounded-md">
              <FormInput
                name="fullName"
                type="text"
                size="large"
                label="Full Name"
                placeholder="Sabbir"
                required
              />
            </div>
            <div
              className="p-3 bg-slate-300 shadow-md shadow-slate-600 rounded-md"
              style={{
                margin: "15px 0px",
              }}
            >
              <FormInput
                name="email"
                type="email"
                size="large"
                label="Email"
                placeholder="sabbir104@gmail.com"
                required
              />
            </div>
            {validation ? (
              <p className="text-red-500 text-xl">
                Must provide appropriate email
              </p>
            ) : (
              <p></p>
            )}
            <div
              className="p-3 bg-slate-300 shadow-md shadow-slate-600 rounded-md"
              style={{
                margin: "15px 0px",
              }}
            >
              <FormInput
                name="password"
                type="password"
                size="large"
                label="Password"
                required
              />
            </div>
            <div
              className="p-3 bg-slate-300 shadow-md shadow-slate-600 rounded-md"
              style={{
                margin: "15px 0px",
              }}
            >
              <FormInput
                name="confPassword"
                type="password"
                size="large"
                label="Confirm Password"
                required
              />
            </div>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUpUser;
