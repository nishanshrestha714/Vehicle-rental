import React from "react";
import { motion } from "framer-motion";
import  assets from "../assets/hero.png";
import "../App.css";

const Banner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} 
      className="banner-container container-fluid"
    >
      <div className="row align-items-center justify-content-between">

        <div className="col-md-6 text-white banner-content">
          <h2 className="banner-title">
            Do You Own a Luxury Car?
          </h2>

          <p className="mt-3">
            Monetize your vehicle effortlessly by listing it on CarRental.
          </p>

          <p className="banner-description">
            We take care of insurance, driver verification and secure payments.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn banner-btn mt-3"
          >
            List your car
          </motion.button>
        </div>

        <div className="col-md-5 text-center">
          <motion.img
            src={assets.banner_car_image}
            alt="car"
            className="img-fluid banner-image"
          />
        </div>

      </div>
    </motion.div>
  );
};

export default Banner;