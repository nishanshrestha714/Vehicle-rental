import { Link } from 'react-router';
// import './VehicleCard/VehicleCard.css';
import './VehicleCard.css';


const StarRating = ({ value, numReview }) => {
  return (
    <div className="vc-rating">
      <div className="vc-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`vc-star ${star <= Math.round(value) ? 'filled' : star - 0.5 <= value ? 'half' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="vc-review-count">{numReview} reviews</span>
    </div>
  );
};

const FuelBadge = ({ fuelType }) => {
  const icons = { petrol: '⛽', diesel: '🛢️', electric: '⚡' };
  return (
    <span className={`vc-fuel-badge vc-fuel-${fuelType}`}>
      {icons[fuelType]} {fuelType}
    </span>
  );
};

function VehicleCard({ vehicle }) {
  const {
    _id,
    name,
    image,
    vehicleType,
    brand,
    model,
    year,
    price,
    discountPrice,
    rating,
    numReview,
    fuelType,
    gearSystem,
    licenseCategory,
    location,
    rentPerHour,
    mileage,
    color,
  } = vehicle;

  const hasDiscount = discountPrice && Number(discountPrice) > 0;

  return (
    <article className="vc-card">
      {/* Gloss overlay */}
      <div className="vc-gloss" />

      {/* Image Section */}
      <Link to={`/vehicle/${_id}`} className="vc-image-link">
        <div className="vc-image-wrap">
          <img src={image} alt={name} className="vc-image" />
          <div className="vc-image-overlay" />

          {/* Top badges */}
          <div className="vc-badges-top">
            <span className="vc-type-badge">{vehicleType}</span>
            {color && <span className="vc-color-dot" style={{ background: color }} title={color} />}
          </div>

          {/* License category pill */}
          <div className="vc-license">
            <span>License</span>
            <strong>{licenseCategory}</strong>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="vc-body">
        {/* Brand & Model */}
        <div className="vc-brand-row">
          <span className="vc-brand">{brand}</span>
          <span className="vc-year">{year}</span>
        </div>

        <Link to={`/vehicle/${_id}`} className="vc-name-link">
          <h2 className="vc-name">{name}</h2>
        </Link>
        <p className="vc-model">{model}</p>

        {/* Rating */}
        <StarRating value={rating} numReview={numReview} />

        {/* Specs row */}
        <div className="vc-specs">
          <div className="vc-spec">
            <span className="vc-spec-icon">⚙️</span>
            <span>{gearSystem}</span>
          </div>
          <div className="vc-spec">
            <span className="vc-spec-icon">📍</span>
            <span>{location}</span>
          </div>
          {mileage > 0 && (
            <div className="vc-spec">
              <span className="vc-spec-icon">🛣️</span>
              <span>{mileage} km</span>
            </div>
          )}
        </div>

        {/* Fuel badge */}
        <FuelBadge fuelType={fuelType} />

        {/* Divider */}
        <div className="vc-divider" />

        {/* Price & CTA */}
        <div className="vc-footer">
          <div className="vc-price-block">
            <div className="vc-rent">
              <span className="vc-rent-amount">Rs {rentPerHour.toLocaleString()}</span>
              <span className="vc-rent-label">/hr</span>
            </div>
            <div className="vc-buy-price">
              {hasDiscount && (
                <span className="vc-original-price">Rs {price.toLocaleString()}</span>
              )}
              <span className="vc-final-price">
                Rs {hasDiscount ? Number(discountPrice).toLocaleString() : price.toLocaleString()}
              </span>
            </div>
          </div>

          <Link to={`/vehicle/${_id}`} className="vc-btn">
            View <span className="vc-btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default VehicleCard;
