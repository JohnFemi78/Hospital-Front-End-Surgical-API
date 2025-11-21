import React, { useState, useEffect, useContext } from "react";
import { storeContext } from "../context/storeContext";
import { toast } from "react-toastify";
import Spinner from "../layout/Spinner";

function Profile() {
  const { localStorageToken, API, setIsLoading, isLoading, user } =
    useContext(storeContext);

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    speciality: "",
    bloodGroup: "",
    role:"PATIENT"
  });

  const profilePicture = "https://i.imgur.com/uIgDDDd.png";

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

        setFormData({
          fullName: data.profile.fullName || "",
          phoneNumber: data.profile.phoneNumber || "",
          speciality: data.profile.speciality || "",
          bloodGroup: data.profile.bloodGroup || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  async function updateProfile() {
    console.log(formData);
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
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!profile) return <Spinner />;

  const userEmail = user?.email || "Email not available";

  return (
    <div className="profile-container">

      <div className="profile-header">
        <h2>{profile.fullName || "No Name"}</h2>
        <p>{userEmail}</p>
      </div>

      <div className="profile-photo-wrapper">
        <img src={profilePicture} className="profile-photo" alt="profile" />
      </div>

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

      {isEditing && (
        <div className="profile-actions">
          <button onClick={updateProfile} className="profile-update-btn">
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

      {!isEditing && (
        <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
          Edit Profile
        </button>
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
        />
      ) : (
        <p>{value || "Not available"}</p>
      )}
    </div>
  );
}

export default Profile;
