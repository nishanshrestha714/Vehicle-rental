

import { Card, Badge, Button } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router";
import { IoLocationOutline } from "react-icons/io5";
import { PiEngineFill } from "react-icons/pi";
import { FaRoad } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import "./Vehicles.css"
import { useState } from "react";
// import { vw } from "framer-motion";





function Vehicles({ vehicle , onBook }) {
  const [hovered , setHovered] = useState(false);
  // const filtered = Vehicles.filter ((vehicle)) => {
  //   const matchSearch = 
  // }

  return (
    <>
      <Card className="vehicle-card"
      onMouseEnter={()=> setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      style={{
       border: `1.5px solid ${hovered ? "#007bff" : "#ccc"}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 8px 32px rgba(15,25,35,0.13)"
          : "0 2px 8px rgba(15,25,35,0.06)",
        transition: "all 0.22s ease",
        cursor: "pointer",
      }}
      >

        {/* IMAGE */}
        <div className="vehicle-image-wrap">

          <Link to={`/vehicle/${vehicle._id}`}>
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="vehicle-image"
            />
          </Link>

          <div className="vehicle-top">
            <span className="vehicle-type">
              {vehicle.vehicleType}
            </span>

            <span className="vehicle-price">
              Rs {vehicle.price}/day
            </span>
          </div>
          <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 14,
            background: "white",
            borderRadius: 8,
            padding: "3px 10px",
            fontSize: 11,
            fontFamily:  "'Inter', system-ui, sans-serif",
            fontWeight: 600,
            color: "black",
            border: `1px solid  #B8C9D9 `,
            letterSpacing: 0.3,
          }}
        >
          {vehicle.vehicleNumber}
        </div>
        </div>

        {/* BODY */}
        <Card.Body className="vehicle-body">

          {/* NAME */}
          <Link
            to={`/vehicle/${vehicle._id}`}
            className="vehicle-name d-block"
          >
            {/* {vehicle.brand} {vehicle.model} */}
            {vehicle.name}
          </Link>

          <div className="vehicle-brand">
            {vehicle.year} • {vehicle.fuelType} , {vehicle.seats} {""} seats
          </div>


{/* 
 <span
            style={{
              background: "white",
              color: "red",
              fontFamily: "",
              fontWeight: 700,
              fontSize: 11,
              padding: "3px 9px",
              borderRadius: 8,
              whiteSpace: "nowrap",
              border: `1px solid  black 30`,
            }}
          >
            License {vehicle.license}
          </span> */}

















          {/* RATING */}
          <Rating
            value={vehicle.rating}
            text={`${vehicle.numReview} `}
          />

          {/* INFO */}
          <div className="vehicle-info">

            <div className="vehicle-location">
            <IoLocationOutline  className="text-danger  "/> {" "}
            {vehicle.location}
            </div>

            {vehicle.countInStock > 0 ? (
              <span className="vehicle-stock stock-in">
                Available
              </span>
            ) : (
              <span className="vehicle-stock stock-out">
                Booked
              </span>
            )}
          </div>

          {/* SPECS */}
          <div className="vehicle-specs">
            <span><PiEngineFill  className="text-black"/>
            {vehicle.engineCC}</span>
            <span><FaRoad className="text-secondary"/> mileage {" "}
             {vehicle.mileage}km/hr</span>
            {/* <span> <IoIosColorPalette />
           
            {vehicle.color}</span> */}
          </div>

          {/* FOOTER */}
          <div className="vehicle-footer ">

            <h4 className="vehicle-main-price " 
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: 20,
                color: "#0F1923",
                lineHeight: 1,
              }}  >
              Rs {vehicle.price.toLocaleString()}
              <span
               style={{
                  fontFamily:  "'Inter', system-ui, sans-serif",
                  fontSize: 11,
                  fontWeight: 400,
                  color: "6B8099",
                }}
               
               >/day</span>

                <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 11,
                color: "0F1923",
                marginTop: 1,
              }}
            >
              rs {vehicle.rentPerHour}/hr
            </div>
            </h4>
           

            <Link to={`/vehicle/${vehicle._id}`}>
              <Button className="vehicle-btn bg-primary" 
              onClick={() => vehicle.countInStock && onBook (vehicle)}
              
              styele = {{
                 cursor: vehicle.countInStock > 0  ? "pointer" : "not-allowed",
              }}
              disabled={!vehicle.countInStock }
               >
                {/* View */}
                {vehicle.countInStock > 0 ? "Book Now" : "Unavailable"}
              </Button>
            </Link>

          </div>
        </Card.Body>
      </Card>

 
    </>
  );
}

export default Vehicles;


















