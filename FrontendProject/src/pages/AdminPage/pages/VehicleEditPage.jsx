import { useEffect, useState } from "react";
import { Button, Row, Col, Form, Spinner } from "react-bootstrap";
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

  const { data: vehicleData, isLoading: fetchLoading } =
    useGetVehicleByIdQuery(id, { skip: !isEditMode });

  const [createVehicle, { isLoading: createLoading }] =
    useCreateVehicleMutation();
  const [updateVehicle, { isLoading: updateLoading }] =
    useUpdateVehicleMutation();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [rentPerHour, setRentPerHour] = useState(0);
  const [location, setLocation] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEditMode && vehicleData) {
      const v = vehicleData?.vehicle || vehicleData;
      setName(v.name || "");
      setBrand(v.brand || "");
      setModel(v.model || "");
      setVehicleNumber(v.vehicleNumber || "");
      setVehicleType(v.vehicleType || "");
      setFuelType(v.fuelType || "petrol");
      setRentPerHour(v.rentPerHour || 0);
      setLocation(v.location || "");
      setCountInStock(v.countInStock || 0);
      setImage(v.image || "");
      setDescription(v.description || "");
    }
  }, [isEditMode, vehicleData]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

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
      let imageUrl = image;

      // TODO: wire this up once an image-upload mutation is available
      // if (imageFile) {
      //   const formData = new FormData();
      //   formData.append("image", imageFile);
      //   const uploaded = await uploadImage(formData).unwrap();
      //   imageUrl = uploaded.image;
      // }

      const vehiclePayload = {
        name,
        brand,
        model,
        vehicleNumber,
        vehicleType,
        fuelType,
        rentPerHour,
        location,
        countInStock,
        image: imageUrl,
        description,
      };

      if (isEditMode) {
        // updateVehicle's query builds the URL from vehicle._id,
        // so the key here must be _id, not id
        await updateVehicle({ _id: id, ...vehiclePayload }).unwrap();
        toast.success("Vehicle updated successfully");
      } else {
        await createVehicle(vehiclePayload).unwrap();
        toast.success("Vehicle added successfully");
      }

      navigate("/admin/vehicles");
    } catch (err) {
      toast.error(err?.data?.error || "Failed to save vehicle");
    }
  };

  const isSaving = createLoading || updateLoading;

  return (
    <>
      <Button variant="dark" as={Link} to="/admin/vehicles">
        Go Back
      </Button>

      <FromContainer>
        <h2>{isEditMode ? "Edit Vehicle" : "Add Vehicle"}</h2>

        {fetchLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="name" className="my-2">
                  <Form.Label>Vehicle Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="brand" className="my-2">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="model" className="my-2">
                  <Form.Label>Model</Form.Label>
                  <Form.Control
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="vehicleNumber" className="my-2">
                  <Form.Label>Vehicle Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. BA 12 PA 3456"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="vehicleType" className="my-2">
                  <Form.Label>Vehicle Type</Form.Label>
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

              <Col md={6}>
                <Form.Group controlId="fuelType" className="my-2">
                  <Form.Label>Fuel Type</Form.Label>
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
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group controlId="rentPerHour" className="my-2">
                  <Form.Label>Rent / Hour (Rs.)</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={rentPerHour}
                    onChange={(e) => setRentPerHour(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="countInStock" className="my-2">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="location" className="my-2">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="mt-2 rounded border"
                  style={{ maxHeight: 150 }}
                />
              )}
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button
              className="btn btn-primary my-2"
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : isEditMode
                ? "Update Vehicle"
                : "Add Vehicle"}
            </Button>
          </Form>
        )}
      </FromContainer>
    </>
  );
}

export default VehicleEditPage;