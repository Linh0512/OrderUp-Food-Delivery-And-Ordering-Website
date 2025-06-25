import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Banner from "../components/banner";
import Header from "../components/header";
import { useState } from "react";

export default function HomePageLayout() {
  const [search,setSearch]=useState("")
  return (
    <div>
      <Header search={search} setSearch={setSearch}/>
      <div className="bg-gray-100 py-10">
        <Banner/>
      </div>
      <main className="bg-gray-100 pb-10">
        <Outlet context={{search,setSearch}}/>
      </main>
      <Footer />
    </div>
  );
}
