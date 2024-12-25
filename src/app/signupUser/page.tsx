import Navbar from "@/components/Navbar/Navbar";
import SignUpUser from "@/components/SignUpUser/SignUpUser";
import React from "react";

const page = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(to right, #051937, #001b4b, #001c5f, #001b71, #0c1682)",
      }}
    >
      <Navbar />
      <SignUpUser />
    </div>
  );
};

export default page;
