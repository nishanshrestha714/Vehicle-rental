

import { Card, Badge, Button } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router";
import { IoLocationOutline } from "react-icons/io5";
import { PiEngineFill } from "react-icons/pi";
import { FaRoad } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import "./Vehicles.css"





function Vehicles({ vehicle }) {
  return (
    <>
  
      

      <Card className="vehicle-card">

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
        </div>

        {/* BODY */}
        <Card.Body className="vehicle-body">

          {/* NAME */}
          <Link
            to={`/vehicle/${vehicle._id}`}
            className="vehicle-name d-block"
          >
            {vehicle.brand} {vehicle.model}
          </Link>

          <div className="vehicle-brand">
            {vehicle.year} • {vehicle.fuelType}
          </div>

          {/* RATING */}
          <Rating
            value={vehicle.rating}
            text={`${vehicle.numReview} reviews`}
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
            <span><FaRoad className="text-secondary"/>
             {vehicle.mileage}km</span>
            <span> <IoIosColorPalette />
            {/* 🎨 */}
            {vehicle.color}</span>
          </div>

          {/* FOOTER */}
          <div className="vehicle-footer">

            <h4 className="vehicle-main-price">
              Rs {vehicle.price}
              <span>/day</span>
            </h4>

            <Link to={`/vehicle/${vehicle._id}`}>
              <Button className="vehicle-btn">
                View
              </Button>
            </Link>

          </div>
        </Card.Body>
      </Card>

 
    </>
  );
}

export default Vehicles;


















