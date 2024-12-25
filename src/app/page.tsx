import HomeHeader from "@/components/Home/homeHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Mechanic App | Home",
};

export default async function Home() {
  return (
    <div
      className="h-full"
      style={{
        background:
          "linear-gradient(to right, #051937, #001b4b, #001c5f, #001b71, #0c1682)",
      }}
    >
      <HomeHeader />
    </div>
  );
}
