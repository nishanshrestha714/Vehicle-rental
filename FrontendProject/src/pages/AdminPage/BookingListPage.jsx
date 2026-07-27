
import { Table, Col, Badge, Card, Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { Link } from "react-router";
import { useGetAllbookingQuery } from "../../Slices/BookingApiSlice";
import {FaTimes} from "react-icons/fa"

function BookingPageLists() {
  const { data, isLoading, error, refetch } = useGetAllbookingQuery();

  const bookings = data?.AllBookingDetails || [];
  console.log("Full API Response:", data);
  console.log("Bookings Array:", bookings);

  return (
    <Col lg={8}>
      <Card className="border-0 shadow rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">All Bookings ({bookings.length})</h4>
            <Button variant="outline-primary" size="sm" onClick={refetch}>
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage>
              {error?.data?.message ||
                error?.data?.error ||
                "Failed to load bookings"}
            </ErrorMessage>
          ) : bookings.length === 0 ? (
            <p className="text-muted text-center py-5">No bookings found.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Vehicle</th>
                    <th>Vehicle Number</th>
                    <th>Pickup</th>
                    <th>Drop</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={
                            booking?.vehicle?.image }
                            alt={booking?.vehicle?.name}
                            style={{
                              width: "50px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                          <span className="fw-semibold">
                            {booking?.vehicle?.name || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/*  Vehicle Number  */}
                      <td className="fw-medium">
                        {booking?.vehicle?.vehicleId?.vehicleNumber || "N/A"}
                      </td>

                      <td>{booking?.pickupLocation || "N/A"}</td>
                      <td>{booking?.dropLocation || "N/A"}</td>
                      <td>{booking?.createdAt?.substring(0, 10) || "N/A"}</td>
                      <td className="text-success fw-bold">
                        Rs. {booking?.totalPrice || 0}
                      </td>

                      <td>
                        {booking?.payment?.isPaid ? (
                          <Badge bg="success">Paid</Badge>
                        ) : (
                          <Badge bg="warning">Pending</Badge>
                        )}
                      </td>

                      <td>
                        {booking?.bookingStatus ? (
                          <Badge bg="primary">Confirmed</Badge>
                        ) : (
                          <Badge bg="warning" text="dark">
                            Waiting
                          </Badge>
                        )}
                      </td>

                      <td>
                        <Link
                       to={`/bookingdetails/${booking._id}`}
                          className="btn btn-dark btn-sm"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default BookingPageLists;
