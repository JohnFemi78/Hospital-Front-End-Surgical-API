import React, { useState, useEffect, useContext } from "react";
import { storeContext } from "../context/storeContext";
import { toast } from "react-toastify";
import Spinner from "../layout/Spinner";

function Profile() {
  const { localStorageToken, API, setIsLoading, isLoading } =
    useContext(storeContext);

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    speciality: "",
    bloodGroup: "",
  });

  const profilePicture = "https://i.imgur.com/uIgDDDd.png";

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/profile/single`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorageToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setProfile(data.profile);

        setFormData({
          fullName: data.profile.fullName ?? "",
          phoneNumber: data.profile.phoneNumber ?? "",
          speciality: data.profile.speciality ?? "",
          bloodGroup: data.profile.bloodGroup ?? "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const userEmail = profile?.email;

  // Handle input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Update Profile
  async function updateProfile() {
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
    return (
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        Loading profile...
      </div>
    );

  if (isLoading) return <Spinner />;

  return (
    <div className="profile-container">
      {/* EDIT BUTTON */}
      <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
        Edit Profile
      </button>

      {/* PROFILE PICTURE */}
      <div className="profile-photo-wrapper">
        <img src={profilePicture} alt="Profile" className="profile-photo" />
      </div>

      {/* HEADER */}
      <div className="profile-header">
        <h2>{profile.fullName}</h2>
        <p>Email: {profile.email}</p>
      </div>

      {/* FIELDS */}
      <ProfileField
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        isEditing={isEditing}
        onChange={handleChange}
      />

      <ProfileField
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        isEditing={isEditing}
        onChange={handleChange}
      />

      <ProfileField
        label="Speciality"
        name="speciality"
        value={formData.speciality}
        isEditing={isEditing}
        onChange={handleChange}
      />

      <ProfileField
        label="Blood Group"
        name="bloodGroup"
        value={formData.bloodGroup}
        isEditing={isEditing}
        onChange={handleChange}
      />

      {/* BUTTONS */}
      {isEditing && (
        <div className="profile-actions">
          <button onClick={updateProfile} className="profile-update-btn">
            Update Profile
          </button>

          <button onClick={() => setIsEditing(false)} className="profile-cancel-btn">
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
