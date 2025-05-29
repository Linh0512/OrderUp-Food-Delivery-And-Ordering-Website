import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Banner from "../components/banner";
import Header from "../components/header";

export default function HomePageLayout() {
  return (
    <div>
      <Header />
      <hr  className="mb-5"/>
      <Banner />
      <main>
        <Outlet />
      </main>
      <hr  className="mt-5"/>
      <Footer />
    </div>
  );
}
