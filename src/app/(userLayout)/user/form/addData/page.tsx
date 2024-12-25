"use client";

import Loading from "@/app/loading";
import { useGetFormsQuery, useUpdateFormMutation } from "@/redux/api/formApi";
import { message, Input, Button, Form, Select, Upload } from "antd";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { getUserInfo } from "@/services/auth.service";
import { useGetSingleAdminQuery } from "@/redux/api/admin";

const { Option } = Select;
const { TextArea } = Input;

const FormView = () => {
  const { userId: id } = getUserInfo() as any;

  const { data: userInfo } = useGetSingleAdminQuery(
    id,

    { refetchOnMountOrArgChange: true }
  );
  const [increment, setIncrement] = useState(0);
  const [fileExist, setFileExist] = useState(false);

  const { data, isLoading } = useGetFormsQuery({
    refetchOnMountOrArgChange: true,
  });

  const [updateForm] = useUpdateFormMutation();
  const [formStates, setFormStates] = useState<Record<string, any>>({});

  if (isLoading) {
    return <Loading />;
  }

  const handleInputChange = (
    formId: string,
    fieldIndex: number,
    value: string
  ) => {
    setFormStates((prevState) => ({
      ...prevState,
      [formId]: {
        ...prevState[formId],
        [fieldIndex]: value,
      },
    }));
  };

  const handleFileChange = (
    formId: string,
    fieldIndex: number,
    { fileList }: any
  ) => {
    // Ensure fileList is always an array
    const validFileList = Array.isArray(fileList) ? fileList : [];

    // Set form state with the updated file list
    setFormStates((prevState) => ({
      ...prevState,
      [formId]: {
        ...prevState[formId],
        [fieldIndex]: validFileList,
      },
    }));

    setFileExist(true);
  };

  const handleSubmit = async (formId: string) => {
    setIncrement(0);

    const updatedFormStates = { ...formStates };
    const formState = updatedFormStates[formId];

    Object.keys(formState).forEach((fieldIndex) => {
      if (Array.isArray(formState[fieldIndex])) {
        updatedFormStates[formId][fieldIndex] = "car";
      }
    });

    const formData = [
      userInfo?.fullName,
      ...Object.values(updatedFormStates[formId] || {}),
    ];

    console.log(formData);

    try {
      await updateForm({ id: formId, data: formData }).unwrap();
      message.success("Form data submitted successfully");
      setFormStates((prevState) => ({
        ...prevState,
        [formId]: {},
      }));
    } catch (err) {
      message.error("Form submission failed");
    }
  };

  return (
    <div>
      <h1 className="text-center text-xl text-blue-600 font-bold my-4">
        Your created form list
      </h1>
      <div className="form-list">
        {data?.map((form: any) => {
          let currentIncrement = increment;
          return (
            <div
              key={form._id}
              className="form-container my-6 p-4 border border-gray-300 rounded-md"
            >
              <h2 className="text-lg font-semibold mb-4">{form.formName}</h2>
              <Form layout="vertical">
                {form.fieldLabel.map((label: string, index: number) => {
                  const isSelectField =
                    form.fieldType[index] === "select" &&
                    form.selectOptions[currentIncrement]?.length > 0;
                  const isFileField = form.fieldType[index] === "file";
                  const isTextArea = form.fieldType[index] === "textarea";

                  // Increase increment if it's a select field
                  if (isSelectField) {
                    currentIncrement += 1;
                  }

                  return (
                    <Form.Item
                      key={`${form._id}-${index}`}
                      label={label}
                      className="mb-4"
                    >
                      {isSelectField ? (
                        <Select
                          value={formStates[form._id]?.[index] || ""}
                          onChange={(value) =>
                            handleInputChange(form._id, index, value)
                          }
                          placeholder={`Select ${label}`}
                        >
                          {form.selectOptions[currentIncrement - 1].map(
                            (option: string, optIndex: number) => (
                              <Option key={optIndex} value={option}>
                                {option}
                              </Option>
                            )
                          )}
                        </Select>
                      ) : isFileField ? (
                        <Upload
                          beforeUpload={() => false}
                          onChange={({ fileList }) =>
                            handleFileChange(form._id, index, { fileList })
                          }
                        >
                          <Button icon={<UploadOutlined />}>Upload File</Button>
                        </Upload>
                      ) : isTextArea ? (
                        <TextArea
                          value={formStates[form._id]?.[index] || ""}
                          onChange={(e) =>
                            handleInputChange(form._id, index, e.target.value)
                          }
                          required
                          placeholder={`Enter ${label}`}
                          autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                      ) : (
                        <Input
                          type={form.fieldType[index]}
                          value={formStates[form._id]?.[index] || ""}
                          onChange={(e) =>
                            handleInputChange(form._id, index, e.target.value)
                          }
                          required
                          placeholder={`Enter ${label}`}
                        />
                      )}
                    </Form.Item>
                  );
                })}
                <Button
                  type="primary"
                  onClick={() => handleSubmit(form._id)}
                  disabled={
                    !formStates[form._id] ||
                    Object.keys(formStates[form._id]).length === 0
                  }
                >
                  Submit
                </Button>
              </Form>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormView;
