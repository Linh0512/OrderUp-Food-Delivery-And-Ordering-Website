import { Route, Router, Routes } from "react-router-dom";
import HomePageLayout from "./layouts/HomePageLayout";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePageLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
  );
}
