import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// ✅ Import only the icons you actually use
import {
  ListAltOutlined,
  AccountCircle,
  FamilyRestroom,
  School,
  LocalHospital,
  Info,
  Description,
  MeetingRoom,
  EditCalendar,
  Badge,
  People,
  Score,
  Assessment,
  FormatListNumbered,
  Class,
  Search,
  Numbers,
  MedicalServices,
  HealthAndSafety,
  FolderCopy,
  HistoryEdu,
  Psychology,
  FactCheck,
  ListAlt,
  ContactEmergency,
} from "@mui/icons-material";

const AdmissionDashboardPanel = () => {
  const settings = useContext(SettingsContext);

  // 🌈 Theme Colors
  const [titleColor, setTitleColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

  // 🏫 School Info
  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (!settings) return;

    setTitleColor(settings.title_color || "#000000");
    setBorderColor(settings.border_color || "#000000");
    setMainButtonColor(settings.main_button_color || "#1976d2");

    setFetchedLogo(settings.logo_url ? `http://localhost:5000${settings.logo_url}` : null);
    setCompanyName(settings.company_name || "");
    setShortTerm(settings.short_term || "");
    setCampusAddress(settings.campus_address || "");
  }, [settings]);

  // 👤 User & Access Control
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 93;

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
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


  const groupedMenu = [
    {

      label: "ADMISSION OFFICE",
      items: [
        { title: "APPLICANT LIST", link: "/applicant_list_admin", icon: ListAltOutlined },
        { title: "PERSONAL INFORMATION", link: "/admin_dashboard1", icon: AccountCircle },
        { title: "FAMILY BACKGROUND", link: "/admin_dashboard2", icon: FamilyRestroom },
        { title: "EDUCATIONAL ATTAINMENT", link: "/admin_dashboard3", icon: School },
        { title: "HEALTH MEDICAL RECORDS", link: "/admin_dashboard4", icon: LocalHospital },
        { title: "OTHER INFORMATION", link: "/admin_dashboard5", icon: Info },
        { title: "DOCUMENTS SUBMITTED", link: "/student_requirements", icon: Description },
        { title: "ENTRANCE EXAM ROOM ASSIGNMENT", link: "/assign_entrance_exam", icon: MeetingRoom },
        { title: "ENTRANCE EXAM SCHEDULE MANAGEMENT", link: "/assign_schedule_applicant", icon: EditCalendar },
        { title: "EXAMINATION PERMIT", link: "/registrar_examination_profile", icon: Badge },
        { title: "PROCTOR'S APPLICANT LIST", link: "/proctor_applicant_list", icon: People },
        { title: "ENTRANCE EXAMINATION SCORES", link: "/applicant_scoring", icon: Score },
      ],
    },
    {
      label: "ENROLLMENT OFFICER",
      items: [
        { title: "APPLICANT LIST", link: "/applicant_list", icon: ListAlt },
        { title: "PERSONAL INFORMATION", link: "/registrar_dashboard1", icon: AccountCircle },
        { title: "FAMILY BACKGROUND", link: "/registrar_dashboard2", icon: FamilyRestroom },
        { title: "EDUCATIONAL ATTAINMENT", link: "/registrar_dashboard3", icon: School },
        { title: "HEALTH MEDICAL RECORDS", link: "/registrar_dashboard4", icon: MedicalServices },
        { title: "OTHER INFORMATION", link: "/registrar_dashboard5", icon: Info },
        { title: "DOCUMENTS SUBMITTED", link: "/registrar_requirements", icon: FolderCopy },
        { title: "INTERVIEW ROOM MANAGEMENT", link: "/assign_interview_exam", icon: MeetingRoom },
        { title: "INTERVIEW SCHEDULE MANAGEMENT", link: "/assign_schedule_applicants_interview", icon: EditCalendar },
        { title: "INTERVIEWER APPLICANT LIST", link: "/interviewer_applicant_list", icon: People },
        { title: "QUALIFYING / INTERVIEW EXAM SCORES", link: "/qualifying_exam_scores", icon: Assessment },
        { title: "STUDENT NUMBERING FOR COLLEGE", link: "/student_numbering_per_college", icon: FormatListNumbered },
        { title: "COURSE TAGGING", link: "/course_tagging", icon: Class },
      ],
    },
    {
      label: "MEDICAL AND DENTAL SERVICES",
      items: [
        { title: "APPLICANT LIST", link: "/medical_applicant_list", icon: ListAltOutlined },
        { title: "PERSONAL INFORMATION", link: "/medical_dashboard1", icon: AccountCircle },
        { title: "FAMILY BACKGROUND", link: "/medical_dashboard2", icon: FamilyRestroom },
        { title: "EDUCATIONAL ATTAINMENT", link: "/medical_dashboard3", icon: School },
        { title: "HEALTH MEDICAL RECORDS", link: "/medical_dashboard4", icon: HealthAndSafety },
        { title: "OTHER INFORMATION", link: "/medical_dashboard5", icon: Info },
        { title: "DOCUMENTS SUBMITTED", link: "/medical_requirements", icon: Description },
        { title: "MEDICAL REQUIREMENTS", link: "/medical_requirements_form", icon: MedicalServices },
        { title: "DENTAL ASSESSMENT", link: "/dental_assessment", icon: HealthAndSafety },
        { title: "PHYSICAL AND NEUROLOGICAL EXAMINATION", link: "/physical_neuro_exam", icon: Psychology },
        { title: "HEALTH RECORDS CERTIFICATE", link: "/health_record", icon: FactCheck },
        { title: "MEDICAL CERTIFICATE", link: "/medical_certificate", icon: ContactEmergency },
      ],
    },
    {
      label: "REGISTRAR'S OFFICE",
      items: [
        { title: "APPLICANT LIST", link: "/super_admin_applicant_list", icon: ListAltOutlined },
        { title: "PERSONAL INFORMATION", link: "/readmission_dashboard1", icon: AccountCircle },
        { title: "FAMILY BACKGROUND", link: "/readmission_dashboard2", icon: FamilyRestroom },
        { title: "EDUCATIONAL ATTAINMENT", link: "/readmission_dashboard3", icon: School },
        { title: "HEALTH MEDICAL RECORDS", link: "/readmission_dashboard4", icon: HealthAndSafety },
        { title: "OTHER INFORMATION", link: "/readmission_dashboard5", icon: Info },
        { title: "CLASS LIST", link: "/class_roster", icon: Class },
        { title: "SEARCH CERTIFICATE OF REGISTRATION", link: "/search_cor", icon: Search },
        { title: "STUDENT NUMBERING PANEL", link: "/student_numbering", icon: Numbers },
        { title: "REPORT OF GRADES", link: "/report_of_grades", icon: Assessment },
        { title: "TRANSCRIPT OF RECORDS", link: "/transcript_of_records", icon: HistoryEdu },
      ],
    },
  ];

  if (loading || hasAccess === null) return <LoadingOverlay open={loading} message="Checking Access..." />;
  if (!hasAccess) return <Unauthorized />;

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent",
      }}
    >
      {groupedMenu.map((group, idx) => (
        <Box key={idx} sx={{ mb: 5 }}>
          {/* Group Title */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              borderBottom: `2px solid ${borderColor}`,
              width: "100%",
              pb: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: titleColor,
                textTransform: "uppercase",
                fontSize: "34px",
              }}
            >
              {group.label}
            </Typography>
          </Box>

          {/* Group Items */}
          <div className="p-2 px-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.items.map((item, i) => {
              const Icon = item.icon; // ✅ Define inside map

              return (
                <div className="relative" key={i}>
                  <Link to={item.link}>
                    {/* ICON */}
                    <div
                      className="bg-white p-4 rounded-lg absolute left-16 top-12"
                      style={{
                        border: `5px solid ${borderColor}`,
                        transition: "all 0.2s ease-in-out",
                        color: titleColor,
                      }}
                    >
                      <Icon sx={{ fontSize: 36, color: titleColor, transition: "color 0.2s" }} />
                    </div>


                    {/* BUTTON */}
                    <button
                      className="bg-white rounded-lg p-4 w-80 h-36 font-medium mt-20 ml-8 flex items-end justify-center"
                      style={{
                        border: `5px solid ${borderColor}`,
                        color: titleColor,
                        transition: "all 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = mainButtonColor;
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = titleColor;
                      }}
                    >
                      {item.title}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </Box>
      ))}
    </Box>
  );


};

export default AdmissionDashboardPanel;
