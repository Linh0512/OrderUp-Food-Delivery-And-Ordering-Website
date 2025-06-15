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
import RestaurentLayout from "./layouts/RestaurentLayout";
import Dashboard from "./pages/hostRes/Dashboard";
import UnAuthorizedPage from "./pages/UnAuthorizePage";
import {
  RequireAnonymous,
  RequireAuth,
  RequireRestaurantHost,
} from "./components/common/AuthRoutes";
import OrderPage from "./pages/hostRes/OrderPage";
import OrderDetailPage from "./pages/hostRes/OrderDetailPage";
import ProductPage from "./pages/hostRes/ProductPage";
import ProductDetailPage from "./pages/hostRes/ProductDetailPage";
import CategoryPage from "./pages/hostRes/CategoryPage";
import AddProduct from "./pages/hostRes/AddProduct";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
      </Route>

      <Route path="/" element={<NoBannerLayout />}>

        <Route element={<RequireAnonymous />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="forget" element={<ForgetPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
        <Route path="unAuth" element={<UnAuthorizedPage />} />
      </Route>


      <Route element={<RequireRestaurantHost />}>
        <Route path="/" element={<RestaurentLayout />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Order" element={<OrderPage />} />
          <Route path="Order/:id" element={<OrderDetailPage />} />
          <Route path="Product" element={<ProductPage />} />
          <Route path="Product/add" element={<AddProduct />} />
          <Route path="Product/:id" element={<ProductDetailPage />} />
          <Route path="Category" element={<CategoryPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
