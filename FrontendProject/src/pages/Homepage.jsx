import { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router";
import { useGetVehicleQuery } from "../Slices/VehicleApislice";
import Vehicles from "../components/Vehicles";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import heroBg from "../assets/homepage.png";
import "./HomePage.css";
import { IoSearch } from "react-icons/io5";

// import heroBg from "../assets/hero.png";
// import Banner from "../components/Banner";

const CATEGORIES = [
  "All",
  "car",
  "scooter",
  "Electric",
  "bike",
  "Van",
  "Bus"


];
const LOCATIONS = ["All Locations", "Kathmandu", "Lalitpur", "Bhaktapur"];

function HomePage() {
  // this is fetch method
  // useEffect(()=>{
  //     fetch(" /api/vehicle")
  //     .then((response)=>response.json())
  //     .then((data)=> console.log(data))
  //     .catch((error)=>console.log(error?.message?.err));
  // },[]);

  //    const {data, isLoading , error} = useGetVehicleQuery();
  //   const vehicles = data?.vehicles || [];

  const { data, isLoading, error } = useGetVehicleQuery();
  const allVehicles = data?.vehicles || [];

  //   const [search, setSearch]       = useState("");
  //   const [activeFilter, setFilter] = useState("All");
  //   const [location , setLocation] = useState("All Locations");
  //   // const [availability , setAvailability] = useState("All");
  //   const [availability, setAvailability] = useState("All");
  //     const [bookedVehicle, setBookedVehicle] = useState(null);
  //   const [sort, setSort]           = useState("default");

  //   const filtered = allVehicles
  //     .filter((v) =>{
  //       const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.vehicleNumber.toLowerCase().includes(search.toLowerCase());
  //       const matchLoc = location === "All Locations" || v.location === location;
  //       const matchAvail = availability === "all" || (availability === "available" && v.countInStock) || (availability === "booked" && !v.countInStock);
  //      return matchSearch &&  matchAvail && matchLoc;

  //       (activeFilter === "All" || v.category === activeFilter) &&
  //       (v.name + v.brand + v.location).toLowerCase().includes(search.toLowerCase())
  //  } )
  //     .sort((a, b) => {
  //       if (sort === "price-asc")  return a.price - b.price;
  //       if (sort === "price-desc") return b.price - a.price;
  //       if (sort === "rating")     return b.rating - a.rating;
  //       return 0;
  //     });

  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("All");
  const [location, setLocation] = useState("All Locations");
  const [availability, setAvailability] = useState("All"); 
  const [bookedVehicle, setBookedVehicle] = useState(null);
  const [sort, setSort] = useState("default");

  const filtered = allVehicles
    .filter((v) => {
      const searchTerm = search.toLowerCase();

      const matchSearch =
        v.name.toLowerCase().includes(searchTerm) ||
        v.vehicleNumber.toLowerCase().includes(searchTerm) ||
        v.brand?.toLowerCase().includes(searchTerm) ||
        v.location?.toLowerCase().includes(searchTerm);

      const matchLoc = location === "All Locations" || v.location === location;

      const matchAvail =
        availability === "All" ||
        (availability === "available" && v.countInStock > 0) ||
        (availability === "booked" && v.countInStock === 0);

      const matchCategory =
        activeFilter === "All" || v.vehicleType === activeFilter;

      return matchSearch && matchAvail && matchLoc && matchCategory;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="hp-root">
      {/* <style>{styles}</style> */}

      <section
        className="hp-hero"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hp-hero-content">
          <p className="hp-eyebrow">🚗 Vehicle Rental Platform</p>
          <h1>
            Rent the <span>perfect vehicle</span>
            <br />
            for your journey
          </h1>
          <p>
            From city sedans to mountain SUVs — flexible hourly, daily or weekly
            plans with zero hidden fees.
          </p>
          <div className="hp-hero-btns">
            <a href="#vehicles" className="hp-btn-primary">
              Browse vehicles
            </a>
            <button className="hp-btn-outline">How it works</button>
          </div>
          <div className="hp-stats">
            <div>
              <div className="hp-stat-val">200+ </div>
              <div className="hp-stat-lbl">Vehicles </div>
            </div>
            <div>
              <div className=" mt-2 " style={{ color: "white" }}>
                {allVehicles.filter((v) => v.countInStock > 0).length}
              </div>
              <div className="hp-stat-lbl">Vehicles Availables</div>
            </div>

            <div>
              <div className="hp-stat-val">50+</div>
              <div className="hp-stat-lbl">Locations</div>
            </div>
            <div>
              <div className="hp-stat-val">4.8★</div>
              <div className="hp-stat-lbl">Avg rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ──  all vehicle display  or  vehile lists  ── */}
      <section className="hp-section" id="vehicles">
        <div className="hp-section-header">
          <h2 className="hp-section-title">Available vehicles</h2>
          <Link to="/all" className="hp-view-all">
            View all{" "}
          </Link>
        </div>

        {/* Search to vehicle in user for list out in  vehicle  */}
        <div className="hp-search-wrap">
          <span className="hp-search-icon">
            <IoSearch />
          </span>
          <input
            className="hp-search"
            type="text"
            placeholder="Search by brand, model or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
     {/* Filters section */}
<Col md={8}>
  <div
    // style={{
    //   background: "#F7FAFC",
    //   border: "1px solid #E1E8ED",
    //   borderRadius: 12,
    //   padding: "14px 16px",
    // }}
  >
    {/* Header + clear */}
  
    {/* Location + Availability side by side */}
    <Row className="g-4">
      <Col xs={6}>
        <Form.Label style={{ fontSize: 12, color: "#", marginBottom: 4 }}>
          Location
        </Form.Label>
        <Form.Select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13,
            border: "1px solid #B8C9D9",
            // background: "#EEF3F8",
            color: "#0F1923",
            borderRadius: 8,
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#378ADD";
            e.target.style.boxShadow = "0 0 0 3px rgba(55,138,221,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#B8C9D9";
            e.target.style.boxShadow = "none";
          }}
        >
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Form.Select>
      </Col>

      <Col xs={6}>
        <Form.Label style={{ fontSize: 12, color: "#6c757d", marginBottom: 4 }}>
          Availability
        </Form.Label>
        <Form.Select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13,
            border: "1px solid #B8C9D9",
            // background: "#EEF3F8",
            color: "#0F1923",
            borderRadius: 8,
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            margin:"3px"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#378ADD";
            e.target.style.boxShadow = "0 0 0 3px rgba(55,138,221,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#B8C9D9";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="All">All Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </Form.Select>
      </Col>
    </Row>
  </div>
</Col>

        {/* Filters in vehicles  */}
        <div className="hp-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`hp-chip ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        

        {/* Sort + count bar */}
        {!isLoading && !error && (
          <div className="hp-sort-bar">
            <span>
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
            </span>
            <select
              className="hp-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        )}
        {/* <Banner/> */}
        {/* Content */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage type="danger">
            {error?.data?.message || error?.error || "Something went wrong"}
          </ErrorMessage>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#aaa",
              fontSize: 14,
            }}
          >
            No vehicles match your search.
          </div>
        ) : (
          <Row className="g-3">
            {filtered.map((vehicle) => (
              <Col key={vehicle._id} sm={12} md={6} lg={4} xl={3}>
                <Vehicles vehicle={vehicle}  onBook={setBookedVehicle}/>
              </Col>
            ))}

            
          </Row>
          
        )}

        
      </section>

            {bookedVehicle && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,25,35,0.65)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) =>
            e.target === e.currentTarget && setBookedVehicle(null)
          }
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: 480,
              width: "100%",
            }}
          >
            <h4>{bookedVehicle.name}</h4>
            <p>Confirm your booking for this vehicle.</p>
            {/* booking form / confirm button goes here */}
            <button onClick={() => setBookedVehicle(null)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
}

      

//     // </div>
//   );
// }

export default HomePage;
