"use client";

import React from "react";
import { Table } from "antd";
import Image from "next/image";
import { useGetFormsQuery } from "@/redux/api/formApi";
import car from "../../../../../assets/car.png";

const DataTable = () => {
  const { data, isLoading } = useGetFormsQuery({
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || data.length === 0) {
    return <p>No form data available</p>;
  }

  return (
    <div>
      <h1 className="text-center text-xl text-blue-600 font-bold my-4">
        All Data Tables
      </h1>

      {data.map((form: any) => {
        const columns = [
          {
            title: "User Name",
            dataIndex: "userName",
            key: "userName",
          },
          ...form.fieldLabel?.map((label: string, index: number) => {
            const isFileType = form.fieldType[index] === "file";
            return {
              title: label,
              dataIndex: `field_${index}`,
              key: `field_${index}`,
              render: (text: string) =>
                isFileType ? (
                  <Image alt="car" src={car} height={100} width={100} />
                ) : (
                  text
                ),
            };
          }),
        ];

        const dataSource = form.formData?.map(
          (rowData: string[], rowIndex: number) => {
            const row: { key: number; userName: string; [key: string]: any } = {
              key: rowIndex,
              userName: rowData[0],
            };

            rowData.slice(1).forEach((value, index) => {
              row[`field_${index}`] = value;
            });

            return row;
          }
        );

        return (
          <div key={form.formName} className="my-4">
            <h2 className="text-lg font-semibold mb-2">{form.formName}</h2>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              bordered
            />
          </div>
        );
      })}
    </div>
  );
};

export default DataTable;
