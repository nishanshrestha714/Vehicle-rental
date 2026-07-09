
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router";
import { useGetVehicleQuery } from "../Slices/VehicleApislice";
import Vehicles from "../components/Vehicles";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import heroBg from "../assets/homepage.png";
import "./HomePage.css";
// import heroBg from "../assets/hero.png";
// import Banner from "../components/Banner";


const CATEGORIES = ["All", "SUV", "Sedan", "Electric", "Hatchback", "Pickup"];

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

  const [search, setSearch]       = useState("");
  const [activeFilter, setFilter] = useState("All");
  const [sort, setSort]           = useState("default");

  const filtered = allVehicles
    .filter((v) =>
      (activeFilter === "All" || v.category === activeFilter) &&
      (v.name + v.brand + v.location).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating")     return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="hp-root">
      {/* <style>{styles}</style> */}

      
      <section className="hp-hero" 
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
            Rent the <span>perfect vehicle</span><br />for your journey
          </h1>
          <p>
            From city sedans to mountain SUVs — flexible hourly, daily or weekly
            plans with zero hidden fees.
          </p>
          <div className="hp-hero-btns">
            <a href="#vehicles" className="hp-btn-primary">Browse vehicles</a>
            <button className="hp-btn-outline">How it works</button>
          </div>
          <div className="hp-stats">
            <div><div className="hp-stat-val">200+</div><div className="hp-stat-lbl">Vehicles</div></div>
            <div><div className="hp-stat-val">50+</div><div className="hp-stat-lbl">Locations</div></div>
            <div><div className="hp-stat-val">4.8★</div><div className="hp-stat-lbl">Avg rating</div></div>
          </div>
        </div>
      </section>

      {/* ──  all vehicle display  or  vehile lists  ── */}
      <section className="hp-section" id="vehicles">
        <div className="hp-section-header">
          <h2 className="hp-section-title">Available vehicles</h2>
          <Link to="/all" className="hp-view-all">View all →</Link>
        </div>

        {/* Search to vehicle in user for list out in  vehicle  */}
        <div className="hp-search-wrap">
          <span className="hp-search-icon">🔍</span>
          <input
            className="hp-search"
            type="text"
            placeholder="Search by brand, model or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters in cars  */}
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
            <span>{filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found</span>
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
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: 14 }}>
            No vehicles match your search.
          </div>
        ) : (
          <Row className="g-3">
            {filtered.map((vehicle) => (
              <Col key={vehicle._id} sm={12} md={6} lg={4} xl={3}>
                <Vehicles vehicle={vehicle} />
              </Col>
            ))}
          </Row>
        )}
      </section>
      
    </div>
   
  );
}

export default HomePage;