"use client";

import { useCreateFormMutation } from "@/redux/api/formApi";
import { message, Button, Input, Form, Select, Space } from "antd";
import React, { useState } from "react";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const FormCreate = () => {
  const [createForm, { isLoading }] = useCreateFormMutation();
  const [form] = Form.useForm();
  const [hasFile, setHasFile] = useState(false);

  const onSubmit = async (values: any) => {
    const { formName, fields } = values;

    const payload = {
      formName,
      fieldNumber: fields.length,
      fieldLabel: fields.map((field: any) => field.label),
      fieldType: fields.map((field: any) => field.type),
      selectFieldLabel: fields
        .filter((field: any) => field.type === "select")
        .map((field: any) => field.label),
      selectOptions: fields
        .filter((field: any) => field.type === "select")
        .map((field: any) => field.options || []),
      hasFile, // Include in payload
    };

    createForm(payload)
      .unwrap()
      .then(() => {
        message.success("Form created successfully");
        form.resetFields();
        setHasFile(false); // Reset hasFile after submission
      })
      .catch(() => {
        message.error("Form creation failed");
      });
  };

  const handleFieldTypeChange = (type: string) => {
    if (type === "file") setHasFile(true);
  };

  return (
    <div>
      <h1 className="text-center text-xl text-blue-600 font-bold my-4">
        Create Your Own Form
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{ maxWidth: 600, margin: "0 auto" }}
      >
        <Form.Item
          label="Form Name"
          name="formName"
          rules={[{ required: true, message: "Please enter the form name" }]}
        >
          <Input placeholder="Enter form name" />
        </Form.Item>

        <Form.List name="fields">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "label"]}
                    rules={[{ required: true, message: "Enter field label" }]}
                  >
                    <Input placeholder="Field Label" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "type"]}
                    rules={[{ required: true, message: "Select field type" }]}
                  >
                    <Select
                      placeholder="Select Type"
                      onChange={(value) => handleFieldTypeChange(value)}
                    >
                      <Option value="text">Text</Option>
                      <Option value="textarea">Text Area</Option>
                      <Option value="email">Email</Option>
                      <Option value="number">Number</Option>
                      <Option value="password">Password</Option>
                      <Option value="date">Date</Option>
                      <Option value="select">Select</Option>
                      <Option value="file">File</Option> {/* New file type */}
                    </Select>
                  </Form.Item>
                  {form.getFieldValue(["fields", name, "type"]) ===
                    "select" && (
                    <Form.List name={[name, "options"]}>
                      {(options, { add: addOption, remove: removeOption }) => (
                        <>
                          {options.map((option, idx) => (
                            <Space key={idx} align="baseline">
                              <Form.Item
                                {...option}
                                name={[option.name]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter option value",
                                  },
                                ]}
                              >
                                <Input placeholder="Option value" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => removeOption(option.name)}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addOption()}
                              icon={<PlusOutlined />}
                              style={{ width: "100%" }}
                            >
                              Add Option (optional)
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  )}
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: "100%" }}
                >
                  Add Field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{ width: "100%" }}
          >
            Create Form
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormCreate;
