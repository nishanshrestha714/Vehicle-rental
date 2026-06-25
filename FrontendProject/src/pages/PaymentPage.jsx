
import { useState } from "react";
import { Button, Form, Col, Row, Card } from "react-bootstrap";
import CheckOutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FromContainers";
import { SavePaymentMethod } from "../Slices/cartslice";
import { useDispatch , useSelector } from "react-redux";
import { useNavigate } from "react-router";
// import { useEffect } from "react";

function PaymentPage() {
  // Fixed: Default state matches the lowercase value "cod" used in the radio button
const { PaymentMethod } = useSelector((state) => state.cart);
const [payment, setPayment] = useState(PaymentMethod || "COD");
console.log('this is payment page method' , PaymentMethod);



  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Selected Payment Method:", payment);
    dispatch (SavePaymentMethod(payment));
    // Add your routing or redux dispatch logic here (e.g., dispatch(savePaymentMethod(paymentMethod)))

    navigate("/booking")
  };

  return (
    <FormContainer>
      {/* Progress Steps */}
      <CheckOutSteps step1 step2 step3 step4 step5 />

      <Row className="justify-content-md-center mt-4">
        <Col xs={12} md={8}>
          <Card className="shadow-sm p-4 border-0 bg-light rounded-3">
            <Card.Body>
              <h2 className="mb-4 text-center text-dark fw-bold">Payment Method</h2>
              
              <Form onSubmit={submitHandler}>
                <Form.Group>
                  <Form.Label as="legend" className="text-muted mb-3 fs-5">
                 <h4>   Select your preferred method</h4>
                  </Form.Label>
                  
                  <div className="p-3 bg-white rounded border mb-3 shadow-2xs">
                    <Form.Check
                      className="fw-semibold text-secondary"
                      type="radio"
                      label="Cash on Delivery (COD)"
                      id="COD"
                      name="paymentMethod" 
                      value="COD"
                      checked={payment === "COD"}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                  </div>

                  <div className="p-3 bg-white rounded border mb-4 shadow-2xs">
                    <Form.Check
                      className="fw-semibold text-secondary"
                      type="radio"
                      label="eSewa Wallet" 
                      id="eSewa"
                      name="paymentMethod" 
                      value="eSewa"
                      checked={payment === "eSewa"}
                      onChange={(e) => setPayment(e.target.value)}
                    />
                  </div>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="mt-3 rounded-pill fw-bold text-uppercase tracking-wider"
                  >
                    Continue 
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default PaymentPage;