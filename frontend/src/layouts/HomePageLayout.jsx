import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Banner from "../components/banner";
import Header from "../components/header";

export default function HomePageLayout() {
  return (
    <div>
      <Header />

      <div className="bg-gray-100 py-10">
        <Banner/>
      </div>
      <main className="bg-gray-100 pb-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
