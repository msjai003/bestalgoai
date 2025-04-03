
import React from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const Dashboard = () => {
  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <h1 className="text-2xl font-bold text-white mt-4">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to your dashboard</p>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
