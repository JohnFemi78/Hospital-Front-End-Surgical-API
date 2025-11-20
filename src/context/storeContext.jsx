import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const storeContext = createContext();

export const StoreProvider = ({ children }) => {
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const appName = "JK Online Surgery";

  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [time, setTime] = useState("");
  const [role, setRole] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [doctorId, setDoctorId] = useState(1);
  const [Schedule, setSchedule] = useState(null);
  const [bloodGrop, setBloodGroup] = useState("");
  
  const [profile, setProfile] = useState("");

  const localStorageToken = localStorage.getItem("hospitalToken");

  // Token expiration checker
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Invalid token:", error);
      return true;
    }
  }

  // Initial check and data load
  useEffect(() => {
    const expired = isTokenExpired(localStorageToken);
    if (!expired) {
      setToken(localStorageToken);
      setIsAuth(true);
      fetchProfile();
      fetchSchedules();
    } else {
      setIsAuth(false);
      localStorage.removeItem("hospitalToken"); 
    }
  }, []);

  //  Fetch all user schedules
  async function fetchSchedules() {
    try {
      setIsLoading(true);
      const res = await fetch(`${API}/schedule/my-schedules`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorageToken}`,
        },
      });

      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.message);
      setSchedules(data.schedules || []);
    } catch (err) {
      toast.error(`Error fetching schedules: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  //  Fetch a Schedule of User
  async function fetchSchedule(id) {
    console.log(id)
    try {
      setIsLoading(true);
      const res = await fetch(`${API}/schedule/single/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorageToken}`,
        },
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message);
      setSchedule(data.schedule);
    } catch (err) {
      toast.error(`Error fetching schedule: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }


  // ❌ Delete schedule
  async function deleteSchedule(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
    if (!confirmDelete) return; // ✅ only cancel returns

    try {
      setIsLoading(true);
      const res = await fetch(`${API}/schedule/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorageToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Schedule deleted successfully");
      fetchSchedules(); // refresh list
    } catch (err) {
      toast.error(`Error deleting schedule: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  //  Fetch user profile
  async function fetchProfile() {
    try {
      setIsLoading(true);
      const res = await fetch(`${API}/profile/single`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorageToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfile(data.profile);
    } catch (err) {
      toast.error(`Error fetching profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  

  const contextObj = {
    appName,
    API,
    isAuth,
    setIsAuth,
    isLoading,
    setIsLoading,
    email,
    setEmail,
    password,
    setPassword,
    token,
    setToken,
    user,
    setUser,
    note,
    setNote,
    date,
    setDate,
    type,
    setType,
    time,
    setTime,
    role,
    setRole,
    schedules,
    fetchSchedules,
    fetchSchedule,
    deleteSchedule,
    profile,
    fetchProfile,
    localStorageToken,
    doctorId,
    setDoctorId,
    bloodGrop,
    setBloodGroup

  
  };

  return (
    <storeContext.Provider value={contextObj}>
      {children}
    </storeContext.Provider>
  );
};
