"use client";

import Loading from "@/app/loading";
import {
  useAddFieldMutation,
  useDeleteFieldMutation,
  useDeleteFormMutation,
  useGetFormsQuery,
  useUpdateFieldMutation,
  useUpdateFormMutation,
} from "@/redux/api/formApi";
import {
  message,
  Input,
  Button,
  Form,
  Select,
  Upload,
  Modal,
  Space,
} from "antd";
import React, { useState } from "react";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getUserInfo } from "@/services/auth.service";
import { useGetSingleAdminQuery } from "@/redux/api/admin";

const { Option } = Select;
const { TextArea } = Input;

const FormView = () => {
  const { userId: id } = getUserInfo() as any;

  const { data: userInfo } = useGetSingleAdminQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [increment, setIncrement] = useState(0);
  const [fileExist, setFileExist] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formIdForNewField, setFormIdForNewField] = useState<string | null>(
    null
  );
  const [updateFieldModalVisible, setUpdateFieldModalVisible] = useState(false);
  const [deleteFormModalVisible, setDeleteFormModalVisible] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [editFieldModalVisible, setEditFieldModalVisible] = useState(false);
  const [deleteFieldModalVisible, setDeleteFieldModalVisible] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(
    null
  );

  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedType, setUpdatedType] = useState("");

  const { data, isLoading } = useGetFormsQuery({
    refetchOnMountOrArgChange: true,
  });
  const [updateForm] = useUpdateFormMutation();
  const [addField] = useAddFieldMutation();
  const [deleteField] = useDeleteFieldMutation();
  const [updateField] = useUpdateFieldMutation();
  const [deleteForm] = useDeleteFormMutation();
  const [formStates, setFormStates] = useState<Record<string, any>>({});
  const [newField, setNewField] = useState<{
    label: string;
    type: string;
    options: string[];
  }>({
    label: "",
    type: "",
    options: [],
  });

  if (isLoading) {
    return <Loading />;
  }

  const handleAddFieldClick = (formId: string) => {
    setFormIdForNewField(formId);
    setIsModalVisible(true);
  };

  const handleOpenModal = (type: string, formId: string) => {
    setSelectedFormId(formId);
    if (type === "updateField") setUpdateFieldModalVisible(true);
    if (type === "deleteForm") setDeleteFormModalVisible(true);
  };

  const handleModalOk = async () => {
    if (formIdForNewField) {
      const fieldPayload = {
        fieldLabel: newField.label,
        fieldType: newField.type,
        selectOptions: newField.type === "select" ? newField.options : [],
      };

      try {
        await addField({
          id: formIdForNewField,
          fieldData: fieldPayload,
        }).unwrap();
        message.success("Field added successfully");
      } catch (error) {
        message.error("Failed to add field");
      } finally {
        setIsModalVisible(false);
        setNewField({ label: "", type: "", options: [] });
      }
    }
  };
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
    const validFileList = Array.isArray(fileList) ? fileList : [];

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

  const handleDeleteForm = async () => {
    if (selectedFormId) {
      try {
        await deleteForm(selectedFormId).unwrap();
        message.success("Form deleted successfully");
        setDeleteFormModalVisible(false);
      } catch {
        message.error("Failed to delete form");
      }
    }
  };

  const handleOpenEditFieldModal = (
    formId: string,
    fieldIndex: number,
    label: string
  ) => {
    setSelectedFormId(formId);
    setSelectedFieldIndex(fieldIndex);
    setUpdatedLabel(label);
    setEditFieldModalVisible(true);
  };

  const handleOpenDeleteFieldModal = (
    formId: string,
    fieldIndex: number,
    type: string
  ) => {
    setSelectedFormId(formId);
    setSelectedFieldIndex(fieldIndex);
    setUpdatedType(type);
    setDeleteFieldModalVisible(true);
  };

  const handleEditFieldModalOk = async () => {
    if (selectedFormId && selectedFieldIndex !== null) {
      const fieldPayload = {
        id: selectedFormId,
        fieldIndex: selectedFieldIndex,
        fieldData: { fieldLabel: updatedLabel },
      };

      try {
        await updateField({
          id: selectedFormId,
          fieldIndex: selectedFieldIndex,
          fieldData: updatedLabel,
        }).unwrap();
        message.success("Field label updated successfully");
      } catch (error) {
        message.error("Failed to update field label");
      } finally {
        setEditFieldModalVisible(false);
        setSelectedFormId(null);
        setSelectedFieldIndex(null);
      }
    }
  };
  const handleDeleteFieldModalOk = async () => {
    if (selectedFormId && selectedFieldIndex !== null) {
      try {
        await deleteField({
          id: selectedFormId,
          fieldIndex: selectedFieldIndex,
          fieldType: updatedType,
        }).unwrap();
        message.success("Field deleted successfully");
      } catch (error) {
        message.error("Failed to field");
      } finally {
        setEditFieldModalVisible(false);
        setSelectedFormId(null);
        setSelectedFieldIndex(null);
      }
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

                  if (isSelectField) {
                    currentIncrement += 1;
                  }

                  return (
                    <div
                      key={`${form._id}-${index}`}
                      className="flex items-start"
                    >
                      <Form.Item
                        key={`${form._id}-${index}`}
                        label={label}
                        className="mb-4 w-full"
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
                            <Button icon={<UploadOutlined />}>
                              Upload File
                            </Button>
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
                      <div className="flex items-center">
                        <Button
                          onClick={() =>
                            handleOpenEditFieldModal(form._id, index, label)
                          }
                        >
                          <EditOutlined />
                        </Button>
                        <Button
                          onClick={() =>
                            handleOpenDeleteFieldModal(
                              form._id,
                              index,
                              form.fieldType[index]
                            )
                          }
                          className="mx-3"
                        >
                          <DeleteOutlined />
                        </Button>
                      </div>
                    </div>
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
                <Button
                  type="primary"
                  onClick={() => handleAddFieldClick(form._id)}
                  className="mx-5"
                >
                  Add Field
                </Button>
                <Button onClick={() => handleOpenModal("deleteForm", form._id)}>
                  Delete Form
                </Button>
              </Form>
            </div>
          );
        })}
      </div>

      <Modal
        title="Add New Field"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Field Label" required>
            <Input
              value={newField.label}
              onChange={(e) =>
                setNewField({ ...newField, label: e.target.value })
              }
              placeholder="Enter field label"
            />
          </Form.Item>

          <Form.Item label="Field Type" required>
            <Select
              value={newField.type}
              onChange={(value) => setNewField({ ...newField, type: value })}
              placeholder="Select field type"
            >
              <Option value="text">Text</Option>
              <Option value="textarea">Text Area</Option>
              <Option value="email">Email</Option>
              <Option value="number">Number</Option>
              <Option value="password">Password</Option>
              <Option value="date">Date</Option>
              <Option value="select">Select</Option>
              <Option value="file">File</Option>
            </Select>
          </Form.Item>

          {newField.type === "select" && (
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      align="baseline"
                      style={{ display: "flex", marginBottom: 8 }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name]}
                        rules={[
                          { required: true, message: "Please enter an option" },
                        ]}
                      >
                        <Input
                          placeholder="Enter option value"
                          onChange={(e) => {
                            const options = [...newField.options];
                            options[name] = e.target.value;
                            setNewField({ ...newField, options });
                          }}
                        />
                      </Form.Item>
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
                      Add Option
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}
        </Form>
      </Modal>
      <Modal
        title="Confirm Delete Form"
        visible={deleteFormModalVisible}
        onOk={handleDeleteForm}
        onCancel={() => setDeleteFormModalVisible(false)}
      >
        <p>Are you sure you want to delete this form?</p>
      </Modal>
      <Modal
        title="Edit Field Label"
        visible={editFieldModalVisible}
        onOk={handleEditFieldModalOk}
        onCancel={() => setEditFieldModalVisible(false)}
      >
        <Input
          value={updatedLabel}
          onChange={(e) => setUpdatedLabel(e.target.value)}
          placeholder="Enter new label"
        />
      </Modal>
      <Modal
        title="Confirm Delete Field"
        visible={deleteFieldModalVisible}
        onOk={handleDeleteFieldModalOk}
        onCancel={() => setDeleteFieldModalVisible(false)}
      >
        <p>Are you sure you want to delete this field?</p>
      </Modal>
    </div>
  );
};

export default FormView;
