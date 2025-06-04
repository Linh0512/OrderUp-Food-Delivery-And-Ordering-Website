import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/header";

export default function NoBannerLayout() {
  return (
    <div>
      <Header />

      <main className="bg-gray-100 py-10">
        <Outlet />
      </main> 

      <Footer />
    </div>
  );
}
