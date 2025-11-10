import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  EventNote,   // Schedule Plotting
  Apartment,   // Department Section
  Assignment,  // Department Panel
  MeetingRoom, // Department Room Panel
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const DepartmentManagement = () => {
  const settings = useContext(SettingsContext);

  // 🌈 Theme
  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff");
  const [stepperColor, setStepperColor] = useState("#000000");

  // 🏫 School Info
  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  // Apply settings from context
  useEffect(() => {
    if (!settings) return;
    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);
    if (settings.stepper_color) setStepperColor(settings.stepper_color);

    if (settings.logo_url) setFetchedLogo(`http://localhost:5000${settings.logo_url}`);
    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);
  }, [settings]);

  // 👤 User & Access Control
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 95;

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole === "registrar") checkAccess(storedID);
      else window.location.href = "/login";
    } else {
      window.location.href = "/login";
    }
  }, []);

  const checkAccess = async (userID) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/page_access/${userID}/${pageId}`);
      setHasAccess(response.data?.page_privilege === 1);
    } catch (error) {
      console.error("Error checking access:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Dashboard Menu Items
  const menuItems = [
    { title: "SCHEDULE PLOTTING FORM", link: "/select_college", icon: <EventNote /> },
    { title: "DEPARTMENT SECTION PANEL", link: "/department_section_panel", icon: <Apartment /> },
    { title: "DEPARTMENT PANEL", link: "/department_registration", icon: <Assignment /> },
    { title: "DEPARTMENT ROOM PANEL", link: "/department_room", icon: <MeetingRoom /> },
  ];

  // 🔒 Loading / Unauthorized
  if (loading || hasAccess === null) return <LoadingOverlay open={loading} message="Checking Access..." />;
  if (!hasAccess) return <Unauthorized />;

  // 🧱 UI Layout
  return (
    <div className="p-2 px-10 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {menuItems.map((item, index) => (
          <div className="relative" key={index}>
            <Link to={item.link}>
              {/* Icon */}
              <div
                className="bg-white p-4 rounded-lg absolute left-16 top-12"
                style={{
                  border: `5px solid ${borderColor}`,
                  color: titleColor,
                  transition: "0.2s ease-in-out",
                }}
              >
                {React.cloneElement(item.icon, { style: { color: titleColor, fontSize: 36 } })}
              </div>

              {/* Button */}
              <button
                className="bg-white rounded-lg p-4 w-80 h-36 font-medium mt-20 ml-8 flex items-end justify-center"
                style={{
                  border: `5px solid ${borderColor}`,
                  color: titleColor,
                  cursor: "pointer",
                  transition: "0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = mainButtonColor;
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.border = `5px solid ${borderColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = titleColor;
                  e.currentTarget.style.border = `5px solid ${borderColor}`;
                }}
              >
                {item.title}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;
