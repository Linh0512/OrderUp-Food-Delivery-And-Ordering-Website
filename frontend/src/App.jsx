import { Route, Router, Routes } from "react-router-dom";
import HomePageLayout from "./layouts/HomePageLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import LoginPage from "./pages/LoginPage";
import NoBannerLayout from "./layouts/NoBannerLayout";
import SignUpPage from "./pages/SignUpPage";
import ForgetPage from "./pages/ForgetPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import TrackingPage from "./pages/TrackingPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
      </Route>
      <Route path="/" element={<NoBannerLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="forget" element={<ForgetPage />} />
        <Route path="cart" element={<CartPage/>}/>
        <Route path="payment" element={<PaymentPage/>}/>
        <Route path="tracking" element={<TrackingPage/>}/>
        <Route path="profile" element={<ProfilePage/>}/>
        <Route path="history" element={<HistoryPage/>}/>
        <Route path="chat" element={<ChatPage/>}/>
      </Route>
    </Routes>
  );
}
