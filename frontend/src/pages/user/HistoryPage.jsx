import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import HistotyItem from "../../components/HistotyItem";
import { useAuth } from "../../components/common/AuthContext";
import { getHistotyData } from "../../services/userServices/Service";
import { Link } from "react-router-dom";

export default function HistoryPage() {
  const LIMIT = 5;
  const [history, setHistory] = useState();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  useEffect(() => {
    getHistotyData(user.userId, user.token).then((res) => {
      setCount(res.totalItems);
      setHistory(res.orders);
    });
  }, [user]);
  return (
    <div className="w-[60vw] mx-auto">
      <p className="dancing-script-700 text-7xl ">History</p>
      <hr className="mb-10" />
      {history && (
        <div className="space-y-7 mb-10">
          {history.map((item, index) => (
            <HistotyItem key={index} item={item} />
          ))}
        </div>
      )}
      <Pagination count={count} current={page} limit={LIMIT} onPageChange={setPage}/>
    </div>
  );
}
