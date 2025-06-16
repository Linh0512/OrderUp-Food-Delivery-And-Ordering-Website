import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import HistotyItem from "../../components/HistotyItem";
import { useAuth } from "../../components/common/AuthContext";
import { getHistotyData } from "../../services/userServices/Service";

export default function HistoryPage() {
  const [history,setHistory]=useState()
  const {user}=useAuth()
  useEffect(()=>{
    getHistotyData(user.userId,user.token).then((res)=>{
      console.log(res)
      setHistory(res)
    })
  },[])
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
