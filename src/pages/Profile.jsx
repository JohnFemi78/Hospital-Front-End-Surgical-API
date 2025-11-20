import React, { useState, useEffect, useContext } from "react";
import { storeContext } from "../context/storeContext";
import { toast } from "react-toastify";
import Spinner from '../layout/Spinner';
function Profile() {
  const { localStorageToken, API, setIsLoading, isLoading } =
    useContext(storeContext);
    const [profile, setProfile] = useState(null);
    const userEmail = profile?.user?.email;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      fullName: "",
      phoneNumber: "",
      speciality: "",
      bloodGroup: "",
    });
    

  // 🔹 External Picture URL (You can change this to any image)
  const profilePicture =
    "https://i.imgur.com/uIgDDDd.png"; // <-- replace with your preferred picture URL

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/profile/:single`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorageToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setProfile(data.profile);
        setFormData(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    
    fetchProfile();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update Profile
  async function updateProfile(formData) {
    try {
      setIsLoading(true);
      const res = await fetch(`${API}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorageToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Profile updated successfully");
      setProfile(data.profile);
      setIsEditing(false);
    } catch (err) {
      toast.error(`Error updating profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  if (!profile)
    return <div style={{ textAlign: "center", marginTop: "30px" }}>Loading profile...</div>;

  if (isLoading) {
    return <Spinner/>
  }
    // return <div style={{ textAlign: "center", marginTop: "30px" }}>Updating profile...</div>;

  return (
    <div className="profile-container">

      {/* EDIT BUTTON */}
      <button
        onClick={() => setIsEditing(true)}
        className="profile-edit-btn"
      >
        Edit Profile
      </button>

      {/* 🔹 PROFILE PICTURE SECTION */}
      <div className="profile-photo-wrapper">
        <img
          src={profilePicture}
          alt="Profile"
          className="profile-photo"
        />
      </div>

      {/* HEADER */}
      <div className="profile-header">
        <h2><strong>{profile.fullName}</strong></h2>
        <p>Email: {userEmail}</p>
      </div>

      {/* FIELDS */}
      <div>
        <ProfileField
          label="Full Name"
          name="fullName"
          value= <strong>{formData.fullName}</strong>
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          label="Phone Number"
          name="phoneNumber"
          value=<strong>{formData.phoneNumber}</strong>
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          label="Speciality"
          name="speciality"
          value=<strong>{formData.speciality}</strong>
          isEditing={isEditing}
          onChange={handleChange}
        />

        <ProfileField
          label="Blood Group"
          name="bloodGroup"
          value=<strong>{formData.bloodGroup}</strong>
          isEditing={isEditing}
          onChange={handleChange}
        />
      </div>

      {/* BUTTONS */}
      {isEditing && (
        <div className="profile-actions">
          <button
            onClick={() => updateProfile(formData)}
            className="profile-update-btn"
          >
            Update Profile
          </button>

          <button
            onClick={() => setIsEditing(false)}
            className="profile-cancel-btn"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, name, value, isEditing, onChange }) {
  return (
    <div className="profile-field">
      <label>{label}</label>

      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="profile-input"
        />
      ) : (
        <p>{value || "Not available"}</p>
      )}
    </div>
  );
}

export default Profile;
