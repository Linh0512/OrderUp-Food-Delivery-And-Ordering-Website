import { Route, Router, Routes } from "react-router-dom";
import HomePageLayout from "./layouts/HomePageLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import LoginPage from "./pages/auth/LoginPage";
import NoBannerLayout from "./layouts/NoBannerLayout";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgetPage from "./pages/auth/ForgetPage";
import CartPage from "./pages/user/CartPage";
import PaymentPage from "./pages/user/PaymentPage";
import TrackingPage from "./pages/user/TrackingPage";
import ProfilePage from "./pages/user/ProfilePage";
import HistoryPage from "./pages/user/HistoryPage";
import ChatPage from "./pages/user/ChatPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

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
        <Route path="unAuth" element={<UnauthorizedPage/>}/>
      </Route>
    </Routes>
  );
}
