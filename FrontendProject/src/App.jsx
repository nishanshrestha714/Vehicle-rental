import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import Layout from "./pages/Layout";
import HomePage from "./pages/Homepage";
import Contactpage from "./pages/Contactpage";
import Servicepage from "./pages/Servicepage";
import Cartpage from "./pages/Cartpage";
import SigninPage from "./pages/Signinpage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Vehiclepage from "./pages/vehiclepage";
import RegisterPage from "./pages/Registerpage";
import VerificationPage from "./pages/validations";
import Shippingpage from "./pages/Shippingpage";
import NagariktaPage from "./pages/NagariktaVerify";
import PaymentPage from "./pages/PaymentPage";
import LicensePage from "./pages/License";
import BookingPage from "./pages/BookingPage";
import RentalPage from "./pages/Rentalpage";
import BookingDetalis from "./pages/BookingDetails";
import NotFoundPage from "./components/NotFound";
import PrivatePage from "./pages/PrivatePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<HomePage />} />
            <Route path="contact" element={<Contactpage />} />
            <Route path="service" element={<Servicepage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="/cart" element={<Cartpage />} />
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
              <Route path="rental" element={<RentalPage />} />
              {/* <Route path="/rental/:bookingId" element={<RentalPage />} /> */}

              <Route path="/bookingdetails/:id" element={<BookingDetalis />} />
              <Route path="notFoudpage" element={<NotFoundPage />} />
            </Route>
            <Route path="vehicle/:id" element={<Vehiclepage />} />

            {/* <Route path = "/browservehicle" element={<VehicleDetailPage/>}/> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
