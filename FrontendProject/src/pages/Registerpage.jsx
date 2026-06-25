import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRegisterMutation } from "../Slices/UserApiSlices"; // ✅ import hook
// import "./register.css";

const steps = ["Personal", "Contact", "Security"];

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function RegisterPage() {
  const navigate = useNavigate();

  // ✅ RTK Query mutation hook
  const [register, { isLoading }] = useRegisterMutation();

  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.firstName || !form.lastName) {
        showToast("error", "Please enter your first and last name.");
        return false;
      }
      if (form.firstName.length < 4 || form.lastName.length < 4) {
        showToast("error", "Name must be at least 4 characters.");
        return false;
      }
    }
    if (step === 1) {
      if (!form.email || !form.phoneNumber) {
        showToast("error", "Please fill email and phone number.");
        return false;
      }
      if (!form.phoneNumber.startsWith("+977")) {
        showToast("error", "Phone must start with +977.");
        return false;
      }
    }
    if (step === 2) {
      if (!form.password || !form.confirmPassword) {
        showToast("error", "Please fill password fields.");
        return false;
      }
      if (form.password.length < 8) {
        showToast("error", "Password must be at least 8 characters.");
        return false;
      }
      if (form.password !== form.confirmPassword) {
        showToast("error", "Passwords do not match.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  // ✅ Use register mutation instead of fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      const res = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        city: form.city,
        password: form.password,
      }).unwrap(); // ✅ unwrap throws error if request fails

      console.log("Register success:", res);
      showToast("success", "Account created! Redirecting to OTP verification…");
      setTimeout(() => navigate("/verify-otp"), 1500);

    } catch (err) {
      // ✅ RTK Query error comes from err.data.message
      showToast("error", err?.data?.message || "Registration failed.");
    }
  };

  const progress = ((step) / (steps.length - 1)) * 100;

  return (
    <div className="rg-page">
      <div className="rg-bg-blob rg-bg-blob--1" />
      <div className="rg-bg-blob rg-bg-blob--2" />
      <div className="rg-bg-blob rg-bg-blob--3" />

      <div className="rg-card">
        {/* ── Left Panel ── */}
        <div className="rg-left">
          <div className="rg-left-inner">
            <div className="rg-brand-icon">🚗</div>
            <h1 className="rg-brand-title">Drive Nepal</h1>
            <p className="rg-brand-sub">
              Join thousands of travellers exploring Nepal with trusted, insured vehicles.
            </p>

            <div className="rg-steps">
              {steps.map((s, i) => (
                <div key={s} className={`rg-step ${i <= step ? "rg-step--done" : ""} ${i === step ? "rg-step--active" : ""}`}>
                  <div className="rg-step-circle">
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className="rg-step-label">{s}</span>
                </div>
              ))}
              <div className="rg-step-line">
                <div className="rg-step-line-fill" style={{ height: `${progress}%` }} />
              </div>
            </div>

            <div className="rg-perks">
              {[
                ["✅", "Free cancellation"],
                ["📍", "500+ pickup points"],
                ["🔒", "OTP verified accounts"],
                ["🕐", "24/7 support"],
              ].map(([icon, text]) => (
                <div key={text} className="rg-perk">
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="rg-right">
          <div className="rg-progress-bar">
            <div
              className="rg-progress-fill"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="rg-right-inner">
            <div className="rg-form-header">
              <p className="rg-step-tag">Step {step + 1} of {steps.length}</p>
              <h2 className="rg-form-title">
                {step === 0 && "Who are you? 👤"}
                {step === 1 && "How to reach you? 📬"}
                {step === 2 && "Secure your account 🔐"}
              </h2>
              <p className="rg-form-sub">
                {step === 0 && "Enter your full name as per your Nagarikta."}
                {step === 1 && "We'll send your OTP to this email & phone."}
                {step === 2 && "Choose a strong password to protect your account."}
              </p>
            </div>

            {toast && (
              <div className={`rg-toast rg-toast--${toast.type}`}>
                {toast.type === "success" ? "✓" : "✕"} {toast.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {step === 0 && (
                <div className="rg-fields">
                  <div className="rg-row2">
                    <div className="rg-field">
                      <label className="rg-label">First Name</label>
                      <input className="rg-input" type="text" name="firstName"
                        placeholder="Ram" value={form.firstName} onChange={handleChange} />
                    </div>
                    <div className="rg-field">
                      <label className="rg-label">Last Name</label>
                      <input className="rg-input" type="text" name="lastName"
                        placeholder="Sharma" value={form.lastName} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="rg-row2">
                    <div className="rg-field">
                      <label className="rg-label">City</label>
                      <input className="rg-input" type="text" name="city"
                        placeholder="Kathmandu" value={form.city} onChange={handleChange} />
                    </div>
                    <div className="rg-field">
                      <label className="rg-label">Address</label>
                      <input className="rg-input" type="text" name="address"
                        placeholder="Thamel" value={form.address} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="rg-fields">
                  <div className="rg-field">
                    <label className="rg-label">Email Address</label>
                    <input className="rg-input" type="email" name="email"
                      placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="rg-field">
                    <label className="rg-label">Phone Number</label>
                    <input className="rg-input" type="tel" name="phoneNumber"
                      placeholder="+977 98XXXXXXXX" value={form.phoneNumber} onChange={handleChange} />
                    <p className="rg-hint">Must start with +977</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="rg-fields">
                  <div className="rg-field">
                    <label className="rg-label">Password</label>
                    <div className="rg-pass-wrap">
                      <input className="rg-input rg-input--pass"
                        type={showPassword ? "text" : "password"}
                        name="password" placeholder="Min 8 characters"
                        value={form.password} onChange={handleChange} />
                      <button type="button" className="rg-eye-btn"
                        onClick={() => setShowPassword((p) => !p)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="rg-field">
                    <label className="rg-label">Confirm Password</label>
                    <div className="rg-pass-wrap">
                      <input className="rg-input rg-input--pass"
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword" placeholder="Re-enter password"
                        value={form.confirmPassword} onChange={handleChange} />
                    </div>
                  </div>
                  {form.password && (
                    <div className="rg-strength">
                      <div className={`rg-strength-bar ${
                        form.password.length >= 12 ? "rg-strength-bar--strong"
                        : form.password.length >= 8 ? "rg-strength-bar--medium"
                        : "rg-strength-bar--weak"}`} />
                      <span className="rg-strength-label">
                        {form.password.length >= 12 ? "Strong 💪"
                          : form.password.length >= 8 ? "Medium 👍"
                          : "Weak ⚠️"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className={`rg-btn-row ${step > 0 ? "rg-btn-row--split" : ""}`}>
                {step > 0 && (
                  <button type="button" className="rg-back-btn" onClick={handleBack}>
                    ← Back
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button type="button" className="rg-next-btn" onClick={handleNext}>
                    Continue →
                  </button>
                ) : (
                  // ✅ isLoading comes from RTK Query now
                  <button type="submit" className="rg-next-btn" disabled={isLoading}>
                    {isLoading ? "Creating account…" : "🚀 Create Account"}
                  </button>
                )}
              </div>
            </form>

            {step === 0 && (
              <>
                <div className="rg-divider">or</div>
                <button className="rg-google-btn" type="button">
                  <GoogleIcon /> Continue with Google
                </button>
              </>
            )}

            <p className="rg-switch-txt">
              Already have an account?{" "}
              <Link to="/signin" className="rg-switch-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;