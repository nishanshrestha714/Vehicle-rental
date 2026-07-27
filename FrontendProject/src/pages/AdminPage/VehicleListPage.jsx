
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
} from "../../Slices/VehicleApislice";
import { toast } from "react-toastify";
import "./VehicleListPage.css";

// Renders the right icon for a vehicle's fuel type (electric gets a charging bolt instead of a pump)
function FuelIcon({ type, ...props }) {
  return type === "electric" ? (
    <FaChargingStation {...props} />
  ) : (
    <FaGasPump {...props} />
  );
}

function VehicleListPage() {
  const { data, isLoading, error, refetch } = useGetVehicleQuery();
  const [CreateVehicle, { isLoading: createLoading }] =
    useCreateVehicleMutation();
  const [query, setQuery] = useState("");

  const vehicles = data?.vehicles || [];

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
      // ❌ BEFORE (the bug): CreateVehicle() — called with NO argument.
      //    RTK Query then sends the POST request with an empty/undefined body.
      //    On the backend, addVechiles does:
      //        const { name, vehicleNumber, ... } = req.body;
      //    Since req.body was undefined, destructuring it threw:
      //    "Cannot destructure property 'name' of 'req.body' as it is undefined"
      //
      // ✅ AFTER (the fix): CreateVehicle({}) — pass an empty object as the body.
      //    Now req.body = {} on the backend, destructuring succeeds (each field
      //    comes back as undefined), and addVechiles' `field ? field : "default"`
      //    fallbacks fill in the sample values instead of crashing.
      const res = await CreateVehicle({}).unwrap();

      toast.success(res.message || "vehicle add in successfull!");
      refetch();
    } catch (err) {
      console.log("this is error ", err?.data?.error || err?.message);
      toast.error(err?.data?.error || "Failed to add vehicle");
    }
  };

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
        {isLoading && (
          <div className="vx-skeleton-wrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="vx-skeleton-row" />
            ))}
          </div>
        )}

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
                <thead>
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
                      <td className="vx-rating">★ {vehicle.rating ?? "—"}</td>
                      <td>
                        <div className="vx-actions">
                          <button className="vx-icon-btn" title="Edit">
                            <FaEdit size={13} />
                          </button>
                          <button className="vx-icon-btn danger" title="Delete">
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