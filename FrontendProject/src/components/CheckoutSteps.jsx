
import { Link } from 'react-router';

function CheckOutSteps({ step1, step2, step3, step4, step5, step6, step7 }) {
  const steps = [
    { active: step1, to: '/signin',    label: 'Sign in' },
    { active: step2, to: '/shipping',  label: 'Next steps' },
    { active: step3, to: '/nagarikta', label: 'Nagarikta' },
    { active: step4, to: '/license',   label: 'License' },
    { active: step5, to: '/payment',   label: 'Payment' },
    { active: step6, to: '/booking',   label: 'Booking' },
    { active: step7, to: '/rental',    label: 'Rental' },
  ];

  const activeIndex = steps.reduce((last, s, i) => s.active ? i : last, 0);

  return (
    <div className="py-3 px-2 bg-light rounded-3 mb-4">

      {/* Step track */}
      <div className="d-flex align-items-center justify-content-center overflow-auto pb-1">
        {steps.map((s, i) => {
          const done   = i < activeIndex;
          const active = i === activeIndex;
          return (
            <div key={i} className="d-flex align-items-center" style={{ flex: i < steps.length - 1 ? 1 : '0 0 auto', maxWidth: 110 }}>
              <div className="d-flex flex-column align-items-center gap-1" style={{ width: '100%' }}>

                {/* Circle */}
                {done ? (
                  <Link to={s.to}
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold text-decoration-none"
                    style={{ width: 40, height: 40, fontSize: 13, background: '#0d6efd', border: '2px solid #0d6efd' }}>
                    ✓
                  </Link>
                ) : active ? (
                  <span
                    className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                    style={{ width: 40, height: 40, fontSize: 13, color: '#0d6efd', background: '#fff', border: '2px solid #0d6efd', boxShadow: '0 0 0 4px rgba(13,110,253,.12)' }}>
                    {i + 1}
                  </span>
                ) : (
                  <span
                    className="rounded-circle d-flex align-items-center justify-content-center text-secondary"
                    style={{ width: 40, height: 40, fontSize: 13, background: '#fff', border: '2px solid #dee2e6' }}>
                    {i + 1}
                  </span>
                )}

                {/* Label */}
                <span style={{ fontSize: 11, whiteSpace: 'nowrap', color: done || active ? '#0d6efd' : '#adb5bd', fontWeight: active ? 600 : done ? 500 : 400 }}>
                  {s.label}
                </span>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: done ? '#0d6efd' : '#dee2e6', minWidth: 8, marginBottom: 22 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="d-flex align-items-center gap-3 mt-3 bg-white rounded-3 p-3 border">
        <div>
          <div style={{ fontSize: 11, color: '#6c757d' }}>Current step</div>
          <div className="fw-500" style={{ fontSize: 15 }}>{steps[activeIndex]?.label}</div>
        </div>
        <div className="flex-grow-1">
          <div className="progress" style={{ height: 6 }}>
            <div
              className="progress-bar"
              style={{ width: `${Math.round(((activeIndex + 1) / steps.length) * 100)}%` }}
            />
          </div>
        </div>
        <span className="text-primary fw-semibold" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
          {activeIndex + 1} / {steps.length}
        </span>
      </div>

    </div>
  );
}

export default CheckOutSteps;
