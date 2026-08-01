
import { useMemo, useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
  FaGasPump,
  FaChargingStation,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  useGetVehicleQuery,
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
} from "../../Slices/VehicleApislice";
import { toast } from "react-toastify";
import "./VehicleListPage.css";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";


// Renders the right icon for a vehicle's fuel type 
function FuelIcon({ type, ...props }) {
  return type === "electric" ? (
    <FaChargingStation {...props} />
  ) : (
    <FaGasPump {...props} />
  );
}

function VehicleListPage() {
  const { data, isLoading, error, refetch } = useGetVehicleQuery();
  const vehicles = data?.vehicles  || data || [];
   console.log(vehicles)
  const [CreateVehicle, { isLoading: createLoading }] = useCreateVehicleMutation();
  const [deleteVehicle , {isLoading:isDeleteLoading}] = useDeleteVehicleMutation();
  const [query, setQuery] = useState("");

  

  const filtered = useMemo(() => {
    if (!query.trim()) return vehicles;
    const q = query.toLowerCase();
    return vehicles.filter((v) =>
      [v.name, v.brand, v.model, v.vehicleNumber, v.vehicleType]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q)),
    );
  }, [vehicles, query]);

  const CreateVehicleHanler = async () => {
    try {
      const res = await CreateVehicle({}).unwrap();

      toast.success(res.message || "vehicle add in successfull!");
      refetch();
    } catch (err) {
      console.log("this is error ", err?.data?.error || err?.message);
      toast.error(err?.data?.error || "Failed to add vehicle");
    }
  };
  const DeleteVehicleHaldler = async (VehicleId) =>{
    try{
      if(window.confirm("Are you  sure you want to delete Vehicle")) {
    const res = deleteVehicle({VehicleId}).unwrap();
    toast.success(res.message);
      }

    }
    catch(err){
      toast.error(err.data.error);
      console.log("THIS IS ERROR",err.data.error);
    }
  };


  const navigate = useNavigate(); 
  const editHandler = async () =>{
    try{
      if(window.confirm("Are you sure !")) {
        // const res  = 
        navigate (`/admin/vehicle/${vehicles._id}/edit`)

      };


    }catch(err){
      toast.error(err.data.error);
    }
  }

  return (
    <div className="vx-page">
      <div className="vx-container">
        {/* Header */}
        <div className="vx-toolbar">
          <div>
            <p className="vx-eyebrow">Drivex Admin</p>
            <h1 className="vx-title">Vehicle Inventory</h1>
            <p className="vx-subtitle">
              {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} listed
              across your fleet
            </p>
          </div> 

          <div className="vx-toolbar-actions">
            <div className="vx-search-wrap">
              <FaSearch className="vx-search-icon" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, brand, plate..."
                className="vx-search"
              />
            </div>

            <button
              className="vx-add-btn"
              onClick={CreateVehicleHanler}
              disabled={createLoading}
            >
              <FaPlus size={12} /> {createLoading ? "Adding..." : "Add vehicle"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {/* {isLoading && (
          <div className="vx-skeleton-wrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="vx-skeleton-row" />
            ))}
          </div>
        )} */}

        {/* Error */}
        {!isLoading && error && (
          <div className="vx-error-box">
            Couldn't load vehicles —{" "}
            {error?.data?.message || "please try again."}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="vx-empty-box">
            <p className="vx-empty-title">
              {query ? "No vehicles match your search" : "No vehicles yet"}
            </p>
            <p className="vx-empty-sub">
              {query
                ? "Try a different name, brand, or plate number."
                : "Add your first vehicle to get started."}
            </p>
          </div>
        )}

        {/* Table (desktop) */}
        {!isLoading && !error && filtered.length > 0 && (
          <>
            <div className="vx-table-wrap vx-table">
              <table className="vx-table-el">
                {/* <thead>
                  <tr>
                    {[
                      "Vehicle",
                      "Plate",
                      "Type",
                      "Fuel",
                      "Rent/Hr",
                      "Location",
                      "Stock",
                      "Rating",
                      "",
                    ].map((h) => (
                      <th
                        key={h || "actions"}
                        className={h === "" ? "vx-th-center" : ""}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead> */}

                <thead className="table-dark">
  <tr>
    <th>Vehicle</th>
    <th>Plate</th>
    <th>Type</th>
    <th>Fuel</th>
    <th>Rent/Hr</th>
    <th>Location</th>
    <th>Stock</th>
    <th>Rating</th>
    <th>Action</th>
  </tr>
</thead>

                <tbody>
                  {filtered.map((vehicle) => (
                    <tr key={vehicle._id} className="vx-row">
                      <td>
                        <div className="vx-vehicle-cell">
                          <img
                            className="vx-vehicle-img"
                            src={vehicle.image}
                            alt={vehicle.name}
                          />
                          <div>
                            <div className="vx-vehicle-name">
                              {vehicle.name?.trim()}
                            </div>
                            <div className="vx-vehicle-sub">
                              {vehicle.brand} · {vehicle.model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="vx-plate">
                          {vehicle.vehicleNumber}
                        </span>
                      </td>
                      <td className="vx-type-cell">{vehicle.vehicleType}</td>
                      <td>
                        <span className="vx-fuel">
                          <FuelIcon type={vehicle.fuelType} size={11} />{" "}
                          {vehicle.fuelType}
                        </span>
                      </td>
                      <td className="vx-price">Rs {vehicle.rentPerHour}</td>
                      <td>
                        <span className="vx-location">
                          <FaMapMarkerAlt className="vx-pin" size={11} />{" "}
                          {vehicle.location}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`vx-stock ${vehicle.countInStock > 0 ? "in" : "out"}`}
                        >
                          {vehicle.countInStock > 0
                            ? `${vehicle.countInStock} in stock`
                            : "Out of stock"}
                        </span>
                      </td>
                      <td className="vx-rating"><FaStar/> {vehicle.rating ?? "—"}</td>
                      <td>
                        <div className="vx-actions">
                          <button className="vx-icon-btn" title="Edit" 
                            // as={Link}
                            // to={`/admin/vehicle/${vehicle._id}/edit`}
                            // onClick={()=> editHandler(vehicle._id)}
                                                      onClick={() => editHandler(vehicle._id)}

                          >
                            <FaEdit size={13} />
                          </button>
                          <button className="vx-icon-btn danger" title="Delete" 
                          onClick={()=> DeleteVehicleHaldler(vehicle._id)}>
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (mobile) */}
            <div className="vx-cards">
              {filtered.map((vehicle) => (
                <div key={vehicle._id} className="vx-card">
                  <img
                    className="vx-card-img"
                    src={vehicle.image}
                    alt={vehicle.name}
                  />
                  <div className="vx-card-body">
                    <div className="vx-card-head">
                      <div>
                        <div className="vx-card-name">
                          {vehicle.name?.trim()}
                        </div>
                        <div className="vx-card-sub">
                          {vehicle.brand} · {vehicle.model} · {vehicle.year}
                        </div>
                      </div>
                      <div className="vx-card-actions">
                        <button className="vx-icon-btn">
                          <FaEdit size={12} />
                        </button>
                        <button className="vx-icon-btn danger">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="vx-card-tags">
                      <span className="vx-plate">{vehicle.vehicleNumber}</span>
                      <span className="vx-card-fuel">
                        <FuelIcon type={vehicle.fuelType} size={10} />{" "}
                        {vehicle.fuelType}
                      </span>
                      <span
                        className={`vx-card-stock ${vehicle.countInStock > 0 ? "in" : "out"}`}
                      >
                        {vehicle.countInStock > 0
                          ? `${vehicle.countInStock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                    <div className="vx-card-footer">
                      <span className="vx-card-location">
                        <FaMapMarkerAlt className="vx-pin" size={11} />{" "}
                        {vehicle.location}
                      </span>
                      <span className="vx-card-price">
                        Rs {vehicle.rentPerHour}/hr
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VehicleListPage;