import CheckOutSteps from "../components/CheckoutSteps";
 import { Link } from "react-router";
 import { Button } from "react-bootstrap";
import SuccessMessage from "../components/SuccessMessage";
function Shippingpage () {
    return (
        <>
          <CheckOutSteps step1 step2 />
          {/* <h1> aba timi booking page ma jana tayer xau </h1> */}
          {/* <SuccessMessage  varient="success" className="text-black">next</SuccessMessage> */}
             <SuccessMessage>
                {" "}
                 You are ready for the next step.{" "}
                <Link to="/nagarikta">
                  {" "}
                  <Button className="bg-primary  custom-outline-btn ">
                    next
                  </Button>{" "}
                </Link>
              </SuccessMessage>
          
            











            
        </>
    )
};

export  default Shippingpage;
