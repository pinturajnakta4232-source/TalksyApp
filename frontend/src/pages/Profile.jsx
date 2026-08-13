import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    address: user?.address || "",
    state: user?.state || "",
    district: user?.district || "",
    pincode: user?.pincode || "",
    profilePhoto: user?.profilePhoto || "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: 480 }}>
      <h2>My Profile</h2>
      <p style={{ color: "#888", fontSize: 13, marginTop: -8 }}>
        {user?.email} · {user?.mobile}
      </p>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>State</label>
            <input name="state" value={form.state} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>District</label>
            <input name="district" value={form.district} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>PIN Code</label>
          <input name="pincode" value={form.pincode} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Profile Photo URL</label>
          <input name="profilePhoto" value={form.profilePhoto} onChange={handleChange} placeholder="https://..." />
        </div>
        <button className="btn btn-block" type="submit">
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
