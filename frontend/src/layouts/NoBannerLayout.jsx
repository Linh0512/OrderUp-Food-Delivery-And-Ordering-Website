import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/header";

export default function NoBannerLayout() {
  return (
    <div>
      <Header />
      <hr className="mb-10" />
      <main>
        <Outlet />
      </main>
      <hr className="mt-10" />
      <Footer />
    </div>
  );
}
