import React from "react";
import HistotyItem from "../components/HistotyItem";
import Pagination from "../components/Pagination";

export default function HistoryPage() {
  return (
    <div className="w-[60vw] mx-auto">
      <p className="dancing-script-700 text-7xl ">History</p>
      <hr className="mb-10" />
      <div className="space-y-7 mb-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <HistotyItem key={index} />
        ))}
      </div>
      <Pagination/> 
    </div>
  );
}
