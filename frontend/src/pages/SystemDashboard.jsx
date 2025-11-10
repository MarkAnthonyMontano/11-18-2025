import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  Assignment,        // Requirements
  MeetingRoom,       // Room
  Class,             // Section
  Timeline,          // Semester
  ChangeCircle,      // Change Grade Period
  Update,            // Year Update
  EventAvailable,    // School Year Activator
  Layers,            // Year Level
  CalendarToday,     // Year Panel
  DateRange,         // School Year Panel
  Email,             // Email Sender
  Settings,
  Campaign,          // Announcement
} from "@mui/icons-material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const SystemDashboardPanel = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff");
  const [stepperColor, setStepperColor] = useState("#000000");

  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  // 🏫 Apply Settings from Context
  useEffect(() => {
    if (!settings) return;

    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);
    if (settings.stepper_color) setStepperColor(settings.stepper_color);

    if (settings.logo_url) {
      setFetchedLogo(`http://localhost:5000${settings.logo_url}`);
    }

    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);
  }, [settings]);

  // 👤 User Info and Access Control
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 96;

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole === "registrar") {
        checkAccess(storedID);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const checkAccess = async (userID) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/page_access/${userID}/${pageId}`);
      if (response.data && response.data.page_privilege === 1) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Error checking access:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Dashboard Menu Items
  const menuItems = [
    { title: "REQUIREMENTS PANEL", link: "/requirements_form", icon: <Assignment style={{ fontSize: 32 }} /> },
    { title: "ROOM FORM", link: "/room_registration", icon: <MeetingRoom style={{ fontSize: 32 }} /> },
    { title: "SETTINGS", link: "/settings", icon: <Settings style={{ fontSize: 32 }} /> },
    { title: "SECTION PANEL FORM", link: "/section_panel", icon: <Class style={{ fontSize: 32 }} /> },
    { title: "SEMESTER PANEL FORM", link: "/semester_panel", icon: <Timeline style={{ fontSize: 32 }} /> },
    { title: "CHANGE GRADING PERIOD", link: "/change_grade_period", icon: <ChangeCircle style={{ fontSize: 32 }} /> },
    { title: "YEAR UPDATE PANEL", link: "/year_update_panel", icon: <Update style={{ fontSize: 32 }} /> },
    { title: "SCHOOL YEAR ACTIVATOR PANEL", link: "/school_year_activator_panel", icon: <EventAvailable style={{ fontSize: 32 }} /> },
    { title: "YEAR LEVEL PANEL FORM", link: "/year_level_panel", icon: <Layers style={{ fontSize: 32 }} /> },
    { title: "YEAR PANEL FORM", link: "/year_panel", icon: <CalendarToday style={{ fontSize: 32 }} /> },
    { title: "SCHOOL YEAR PANEL", link: "/school_year_panel", icon: <DateRange style={{ fontSize: 32 }} /> },
    { title: "EMAIL SENDER", link: "/email_template_manager", icon: <Email style={{ fontSize: 32 }} /> },
    { title: "ANNOUNCEMENT", link: "/announcement", icon: <Campaign style={{ fontSize: 32 }} /> },
    { title: "EVALUATION MANAGEMENT", link: "/evaluation_crud", icon: <HelpOutlineIcon style={{ fontSize: 32 }} /> },
  ];

  // 🔒 Access Loading States
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Checking Access..." />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  // 🧱 UI Layout
  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent",
      }}
    >
      <div className="p-2 px-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item, index) => (
            <div className="relative" key={index}>
              <Link to={item.link}>
                {/* ICON BOX */}
                <div
                  className="absolute left-16 top-12 rounded-lg p-4"
                  style={{
                    backgroundColor: "white",
                    border: `5px solid ${borderColor}`,
                    color: titleColor,
                    transition: "0.2s ease-in-out",
                  }}
                >
                  {item.icon}
                </div>

                {/* MAIN BUTTON */}
                <button
                  className="rounded-lg p-4 w-80 h-32 font-medium mt-20 ml-8 flex items-end justify-center"
                  style={{
                    backgroundColor: "white",
                    color: titleColor,
                    border: `5px solid ${borderColor}`,
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
    </Box>
  );
};

export default SystemDashboardPanel;
