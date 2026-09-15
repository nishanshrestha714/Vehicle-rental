import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";

// Layout
import Layout from "./pages/Layout";

// Public pages
import HomePage from "./pages/Homepage";
import Contactpage from "./pages/Contactpage";
import Servicepage from "./pages/Servicepage";
import Cartpage from "./pages/Cartpage";
import SigninPage from "./pages/Signinpage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Vehiclepage from "./pages/vehiclepage";
import RegisterPage from "./pages/Registerpage";
import VerificationPage from "./pages/validations";

// Logged-in user pages (guarded by PrivatePage)
import Shippingpage from "./pages/Shippingpage";
import NagariktaPage from "./pages/NagariktaVerify";
import PaymentPage from "./pages/PaymentPage";
import LicensePage from "./pages/License";
import BookingPage from "./pages/BookingPage";
import RentalPage from "./pages/Rentalpage";
import BookingDetalis from "./pages/BookingDetails";
import PrivatePage from "./pages/PrivatePage";
import ProfilePage from "./pages/ProfilePage";

// Admin-only pages
import AdminPage from "./pages/AdminPage/AdminPage";
import BookingPageLists from "./pages/AdminPage/BookingListPage";

// Fallback
import NotFoundPage from "./components/NotFound";
import VehicleListPage from "./pages/AdminPage/VehicleListPage";
import Nagariktas from "./pages/AdminPage/nagarikta";
import Licenses from "./pages/AdminPage/Licenses";
import AdminNagariktaDetailPage from "./pages/AdminPage/adminNagariktaDetailsPage";
import AdminLicenseDetailPage from "./pages/AdminPage/adminLicenseDetailsPage";
import VehicleEditPage from "./pages/AdminPage/pages/VehicleEditPage";
import ContactMessage from "./pages/AdminPage/pages/contactmessage";


function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            <Route path="contact" element={<Contactpage />} />
            <Route path="service" element={<Servicepage />} />
            <Route path="about" element={<AboutPage />} />

            <Route path="cart" element={<Cartpage />} />

            <Route path="signin" element={<SigninPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verifacation" element={<VerificationPage />} />

            <Route path="" element={<PrivatePage />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="shipping" element={<Shippingpage />} />
              <Route path="nagarikta" element={<NagariktaPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="license" element={<LicensePage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="rental/:id" element={<RentalPage />} />

              {/* <Route path="/booking/:id" element={<BookingPage />} /> */}

              <Route path="bookingdetails/:id" element={<BookingDetalis />} />
            </Route>

            <Route path="vehicle/:id" element={<Vehiclepage />} />

            {/*  Admin-only routes  */} 
            <Route path="admin" element={<AdminPage />}>
              <Route path="bookings" element={<BookingPageLists />} />
              <Route path="vehicles" element={<VehicleListPage />} />
              <Route path="nagarikta" element={<Nagariktas />} />
              <Route path="nagarikta/:id" element={<AdminNagariktaDetailPage />} />
              <Route path="license" element={<Licenses />} />
              <Route path="license/:id/verify" element={<AdminLicenseDetailPage />} />
              <Route path="vehicle/:id/edit" element={<VehicleEditPage />} />
              <Route path="contact" element={<ContactMessage />} />


            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
