// import { useState, useEffect } from "react";
// // and  then axios mathod for api calling
// import axios from "axios";
// import Vehicles from "../components/Vehicles";
// import { Row, Col } from "react-bootstrap";
// import { useGetVehicleQuery } from "../Slices/VehicleApislice";
// import Loader from "../components/Loader";
// import ErrorMessage from "../components/ErrorMessage";
// function HomePage() {
//   // this is fetch method
//   // useEffect(()=>{
//   //     fetch(" /api/vehicle")
//   //     .then((response)=>response.json())
//   //     .then((data)=> console.log(data))
//   //     .catch((error)=>console.log(error?.message?.err));
//   // },[]);



//   // this method is axios '
  
//   // const [vehicles, setvehicles] = useState([]);
//   // console.log(vehicles);

//   // useEffect(() => {
//   //   axios
//   //     .get("/api/vehicle")
//   //     .then((response) => {
//   //       setvehicles(response.data?.vechile);
//   //     })
//   //     .catch((error) => {
//   //       console.log(error?.message?.err);
//   //     });
//   // }, []);


//    // import from usegetvehiclesquery

//    const {data, isLoading , error} = useGetVehicleQuery();
//   const vehicles = data?.vehicles || [];
 
//   return (
//     <>
// <div
//   className="homepage d-flex flex-column justify-content-center text-primary "
//   style={{
//     backgroundImage: "url('/homepage/homepage.png')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     minHeight: "400px",
//   }}
// >
// <div className="headertext w-25">
//     <h1
//     className="text-white p-2"
//     style={{ animation: "slideInLeft 1s ease forwards", }}
//   >
//     Rent the <b className=" text-danger"> perfect</b>  vehicle for your journey
//   </h1>

//   <p
//     className="text-white p-1 "
//     style={{ animation: "slideInLeft 1.5s ease forwards" , color:"blue" }}
//   >
//     From city sedans to mountain SUVs - flexible
//   </p>

//   <p
//     className="text-white p-1"
//     style={{ animation: "slideInLeft 2s ease forwards" }}
//   >
//     hourly, daily or weekly plans with zero hidden fees.
//   </p>
// </div>
// </div>

     
//     <div className="vehicles-details ">
//           <h2 className="  text-center "> latest vehicles </h2>
//     </div>
//  {isLoading ? (
//   // <h1>data is loading...</h1>
//   <Loader/>
// ) : error ? (
//   <ErrorMessage>{error?.data?.message || error?.error || "Something went wrong"}</ErrorMessage>
// ) : (
//   <Row className="m-2 p-2">
//     {vehicles.map((vehicle) => (
//       <Col
//        sm={12}
//         md={6}
//         lg={4}
//         xl={3}

//         className="p-1 rounded"
//         key={vehicle._id}
//       >
//         <Vehicles vehicle={vehicle} />
//       </Col>
//     ))}
//   </Row>
// )}











 



//       {/* <Row>
//         {vehicles && vehicles.length > 0 ? (
//           vehicles.map((v) => (
//             <Col key={v._id} sm={12} md={6} lg={4}>
//               <Vehicles vehicle={v} />
//             </Col>
//           ))
//         ) : (
//           <Col>
//             <p>Loading vehicles...</p>
//           </Col>
//         )}
//       </Row> */}
//     </>
//   );
// }
// export default HomePage;














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




/* ── Paste in index.css or a <style> block ────────────────────── */
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

//   .hp-root { font-family: 'DM Sans', sans-serif; background: #f7f8fa; min-height: 100vh; }

//   /* ── Hero ── */
//   .hp-hero {
//     background: #0a1628;
//     min-height: 340px;
//     display: flex; align-items: center;
//     padding: 3.5rem 2rem;
//     position: relative; overflow: hidden;
//     border-radius: 0 0 28px 28px;
//   }
//   .hp-hero::after {
//     content: '';
//     position: absolute; inset: 0;
//     background: linear-gradient(120deg, #0a1628 55%, #0F6E56 100%);
//     opacity: .95; z-index: 0;
//   }
//   .hp-hero-content { position: relative; z-index: 1; max-width: 560px; }

//   .hp-eyebrow {
//     font-size: 11px; font-weight: 500;
//     letter-spacing: .12em; text-transform: uppercase;
//     color: #5DCAA5; margin-bottom: 12px;
//   }
//   .hp-hero h1 {
//     font-family: 'Syne', sans-serif;
//     font-size: 36px; font-weight: 800;
//     color: #fff; line-height: 1.18; margin-bottom: 14px;
//   }
//   .hp-hero h1 span { color: #5DCAA5; }
//   .hp-hero p { font-size: 14px; color: rgba(255,255,255,.62); line-height: 1.75; margin-bottom: 24px; }

//   .hp-hero-btns { display: flex; gap: 10px; flex-wrap: wrap; }
//   .hp-btn-primary {
//     background: #1D9E75; color: #fff;
//     font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600;
//     border: none; padding: 11px 24px; border-radius: 999px; cursor: pointer;
//     transition: background .2s, transform .15s; text-decoration: none;
//     display: inline-flex; align-items: center; gap: 6px;
//   }
//   .hp-btn-primary:hover { background: #0F6E56; transform: translateY(-1px); color: #fff; }
//   .hp-btn-outline {
//     background: transparent; color: #fff;
//     font-family: 'DM Sans', sans-serif; font-size: 13px;
//     border: 1px solid rgba(255,255,255,.25); padding: 11px 24px;
//     border-radius: 999px; cursor: pointer; transition: border-color .2s;
//   }
//   .hp-btn-outline:hover { border-color: rgba(255,255,255,.6); }

//   .hp-stats { display: flex; gap: 32px; margin-top: 2rem; }
//   .hp-stat-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; }
//   .hp-stat-lbl { font-size: 11px; color: rgba(255,255,255,.45); margin-top: 2px; }

//   /* ── Listing section ── */
//   .hp-section { padding: 2rem 1.25rem; }
//   .hp-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
//   .hp-section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #111; margin: 0; }
//   .hp-view-all { font-size: 13px; color: #1D9E75; text-decoration: none; font-weight: 500; }
//   .hp-view-all:hover { text-decoration: underline; color: #0F6E56; }

//   /* ── Search ── */
//   .hp-search-wrap { position: relative; margin-bottom: 1rem; }
//   .hp-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; color: #aaa; }
//   .hp-search { width: 100%; padding: 11px 16px 11px 42px; border-radius: 14px; border: 1px solid #e2e2e2; background: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #111; outline: none; transition: border-color .2s; }
//   .hp-search:focus { border-color: #1D9E75; }

//   /* ── Filter chips ── */
//   .hp-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem; }
//   .hp-chip { font-size: 12px; font-weight: 500; padding: 7px 16px; border-radius: 999px; border: 1px solid #e2e2e2; background: #fff; color: #666; cursor: pointer; transition: all .18s; }
//   .hp-chip.active { background: #0F6E56; color: #fff; border-color: #0F6E56; }
//   .hp-chip:hover:not(.active) { border-color: #1D9E75; color: #111; }

//   /* ── Empty / sort bar ── */
//   .hp-sort-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 13px; color: #888; }
//   .hp-sort-select { font-size: 13px; border: 1px solid #e2e2e2; border-radius: 8px; padding: 5px 10px; background: #fff; color: #333; outline: none; font-family: 'DM Sans', sans-serif; cursor: pointer; }


// //  add this image background image  for my code 
//   .hp-hero::after {
//   content: '';
//   position: absolute;
//   inset: 0;
//   background: linear-gradient(120deg, #0a1628 55%, #0F6E56 100%);
//   opacity: .95;
//   z-index: 0;
// }
//   .hp-hero::after {
//   content: '';
//   position: absolute;
//   inset: 0;
//   background: rgba(0,0,0,0.55);
//   z-index: 0;
// }
// `;

const CATEGORIES = ["All", "SUV", "Sedan", "Electric", "Hatchback", "Pickup"];

function HomePage() {
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