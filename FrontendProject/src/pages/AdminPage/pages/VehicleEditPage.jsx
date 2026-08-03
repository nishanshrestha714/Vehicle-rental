

import { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import FromContainer from "../../../components/FromContainers";
import {
  useCreateVehicleMutation,
  useGetVehicleByIdQuery,
  useUpdateVehicleMutation,
} from "../../../Slices/VehicleApislice";

function VehicleEditPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const {
    data: vehicleData,
    isLoading: fetchLoading,
    isError,
    error,
  } = useGetVehicleByIdQuery(id, { skip: !id });

  console.log("this is edit vehile " , vehicleData);

  const [createVehicle, { isLoading: createLoading }] =
    useCreateVehicleMutation();
  const [updateVehicle, { isLoading: updateLoading }] =
    useUpdateVehicleMutation();

  // ===== All fields from your API =====
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [gearSystem, setGearSystem] = useState("manual");
  const [color, setColor] = useState("");
  const [engineCC, setEngineCC] = useState("");
  const [seats, setSeats] = useState(2);
  const [mileage, setMileage] = useState("");
  const [licenseCategory, setLicenseCategory] = useState("");
  const [rentPerHour, setRentPerHour] = useState(0);
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState("");
  const [location, setLocation] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [image, setImage] = useState("");
  const [discription, setDiscription] = useState("");
  const [bluebookExpiredDate, setBluebookExpiredDate] = useState("");
  const [insuranceExpiredDate, setInsuranceExpiredDate] = useState("");
  const [bluebook, setBluebook] = useState("");
  const [insurance, setInsurance] = useState("");
  const [documents, setDocuments] = useState("");

  // ===== Fill form when data loads =====
  useEffect(() => {
    if (!isEditMode || !vehicleData) return;

    const v = vehicleData.vehicle || vehicleData.data || vehicleData;
    if (!v?._id) return;

    setName(v.name || "");
    setBrand(v.brand || "");
    setModel(v.model || "");
    setYear(v.year || "");
    setVehicleNumber(v.vehicleNumber || "");
    setVehicleType(v.vehicleType || "");
    setFuelType(v.fuelType || "petrol");
    setGearSystem(v.gearSystem || "manual");
    setColor(v.color || "");
    setEngineCC(v.engineCC || "");
    setSeats(v.seats ?? 2);
    setMileage(v.mileage || "");
    setLicenseCategory(v.licenseCategory || "");
    setRentPerHour(v.rentPerHour ?? 0);
    setPrice(v.price ?? 0);
    setDiscountPrice(v.discountPrice || "");
    setLocation(v.location || "");
    setCountInStock(v.countInStock ?? 0);
    setImage(v.image || "");
    setDiscription(v.discription || v.description || "");
    setBluebookExpiredDate(
      v.bluebookExpiredDate ? v.bluebookExpiredDate.slice(0, 10) : ""
    );
    setInsuranceExpiredDate(
      v.insuranceExpiredDate ? v.insuranceExpiredDate.slice(0, 10) : ""
    );
    setBluebook(v.vehicleDocument?.bluebook || "");
    setInsurance(v.vehicleDocument?.insurance || "");
    setDocuments(v.vehicleDocument?.documents || "");
  }, [isEditMode, vehicleData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !brand ||
      !model ||
      !vehicleNumber ||
      !vehicleType ||
      !fuelType ||
      !rentPerHour ||
      !location
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name,
        brand,
        model,
        year: year ? Number(year) : undefined,
        vehicleNumber,
        vehicleType,
        fuelType,
        gearSystem,
        color,
        engineCC,
        seats: Number(seats),
        mileage,
        licenseCategory,
        rentPerHour: Number(rentPerHour),
        price: Number(price),
        discountPrice,
        location,
        countInStock: Number(countInStock),
        image,
        discription,
        bluebookExpiredDate: bluebookExpiredDate || undefined,
        insuranceExpiredDate: insuranceExpiredDate || undefined,
        vehicleDocument: {
          bluebook,
          insurance,
          documents,
        },
      };

      if (isEditMode) {
        await updateVehicle({ _id: id, ...payload }).unwrap();
        toast.success("Vehicle updated successfully");
      } else {
        await createVehicle(payload).unwrap();
        toast.success("Vehicle added successfully");
      }

      navigate("/admin/vehicles");
    } catch (err) {
      toast.error(
        err?.data?.error || err?.data?.message || "Failed to save vehicle"
      );
    }
  };

  const isSaving = createLoading || updateLoading;

  if (isEditMode && !id) {
    return (
      <Alert variant="danger" className="m-3">
        Invalid vehicle ID. <Link to="/admin/vehicles">Back to list</Link>
      </Alert>
    );
  }

  return (
    <>
      <Button
        variant="dark"
        as={Link}
        to="/admin/vehicles"
        className="mb-3"
      >
        Go Back
      </Button>

      <FromContainer>
        <h2 className="mb-4">
          {isEditMode ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        {fetchLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : isError ? (
          <Alert variant="danger">
            {error?.data?.error ||
              error?.data?.message ||
              "Failed to load vehicle"}
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Header className="bg-light fw-semibold">
                Basic Information
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Vehicle Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Brand <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Model <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Vehicle Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        placeholder="e.g. ba 65 pa 3296"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Specs */}
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Header className="bg-light fw-semibold">
                Specifications
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Vehicle Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                        <option value="scooter">Scooter</option>
                        <option value="van">Van</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Fuel Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                        required
                      >
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gear System</Form.Label>
                      <Form.Select
                        value={gearSystem}
                        onChange={(e) => setGearSystem(e.target.value)}
                      >
                        <option value="manual">Manual</option>
                        <option value="automatic">Automatic</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Color</Form.Label>
                      <Form.Control
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Engine CC</Form.Label>
                      <Form.Control
                        placeholder="e.g. 1205cc"
                        value={engineCC}
                        onChange={(e) => setEngineCC(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Seats</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mileage</Form.Label>
                      <Form.Control
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>License Category</Form.Label>
                      <Form.Select
                        value={licenseCategory}
                        onChange={(e) => setLicenseCategory(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Pricing & Stock */}
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Header className="bg-light fw-semibold">
                Pricing & Stock
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Rent / Hour (Rs.) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        value={rentPerHour}
                        onChange={(e) => setRentPerHour(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Discount Price</Form.Label>
                      <Form.Control
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Count In Stock</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Location <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Documents & Dates */}
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Header className="bg-light fw-semibold">
                Documents & Expiry
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bluebook Expired Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={bluebookExpiredDate}
                        onChange={(e) =>
                          setBluebookExpiredDate(e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Insurance Expired Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={insuranceExpiredDate}
                        onChange={(e) =>
                          setInsuranceExpiredDate(e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bluebook File</Form.Label>
                      <Form.Control
                        value={bluebook}
                        onChange={(e) => setBluebook(e.target.value)}
                        placeholder="filename.pdf"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Insurance File</Form.Label>
                      <Form.Control
                        value={insurance}
                        onChange={(e) => setInsurance(e.target.value)}
                        placeholder="filename.pdf"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Other Documents</Form.Label>
                      <Form.Control
                        value={documents}
                        onChange={(e) => setDocuments(e.target.value)}
                        placeholder="filename.pdf"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Image & Description */}
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Header className="bg-light fw-semibold">
                Image & Description
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/vehicles/images/..."
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="mt-2 rounded border"
                      style={{ maxHeight: 160, objectFit: "contain" }}
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={discription}
                    onChange={(e) => setDiscription(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : isEditMode
                  ? "Update Vehicle"
                  : "Add Vehicle"}
              </Button>
              <Button
                variant="outline-secondary"
                as={Link}
                to="/admin/vehicles"
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </FromContainer>
    </>
  );
}

export default VehicleEditPage;