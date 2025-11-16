import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import { Box, Container, Typography } from "@mui/material";
import EaristLogo from "../assets/EaristLogo.png";
import { FcPrint } from "react-icons/fc";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ForwardIcon from '@mui/icons-material/Forward';

import { QRCodeSVG } from "qrcode.react";

const ApplicantChangeCourseForm = () => {

    const settings = useContext(SettingsContext);

    const [titleColor, setTitleColor] = useState("#000000");
    const [subtitleColor, setSubtitleColor] = useState("#555555");
    const [borderColor, setBorderColor] = useState("#000000");
    const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
    const [subButtonColor, setSubButtonColor] = useState("#ffffff");   // ✅ NEW
    const [stepperColor, setStepperColor] = useState("#000000");       // ✅ NEW

    const [fetchedLogo, setFetchedLogo] = useState(null);
    const [companyName, setCompanyName] = useState("");
    const [shortTerm, setShortTerm] = useState("");

    useEffect(() => {
        if (!settings) return;

        // 🎨 Colors
        if (settings.title_color) setTitleColor(settings.title_color);
        if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
        if (settings.border_color) setBorderColor(settings.border_color);
        if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
        if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);   // ✅ NEW
        if (settings.stepper_color) setStepperColor(settings.stepper_color);           // ✅ NEW

        // 🏫 Logo
        if (settings.logo_url) {
            setFetchedLogo(`http://localhost:5000${settings.logo_url}`);
        } else {
            setFetchedLogo(EaristLogo);
        }

        // 🏷️ School Information
        if (settings.company_name) setCompanyName(settings.company_name);
        if (settings.short_term) setShortTerm(settings.short_term);
        if (settings.campus_address) setCampusAddress(settings.campus_address);

    }, [settings]);


    const words = companyName.trim().split(" ");
    const middle = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, middle).join(" ");
    const secondLine = words.slice(middle).join(" ");

    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [person, setPerson] = useState({

        profile_img: "",
        campus: "",
        academicProgram: "",
        classifiedAs: "",
        program: "",
        program2: "",
        program3: "",
        yearLevel: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        extension: "",
        nickname: "",
        height: "",
        weight: "",
        lrnNumber: "",
        gender: "",
        pwdType: "",
        pwdId: "",
        birthOfDate: "",
        age: "",
        birthPlace: "",
        languageDialectSpoken: "",
        citizenship: "",
        religion: "",
        civilStatus: "",
        tribeEthnicGroup: "",
        otherEthnicGroup: "",
        cellphoneNumber: "",
        emailAddress: "",
        telephoneNumber: "",
        facebookAccount: "",
        presentStreet: "",
        presentBarangay: "",
        presentZipCode: "",
        presentRegion: "",
        presentProvince: "",
        presentMunicipality: "",
        presentDswdHouseholdNumber: "",
        permanentStreet: "",
        permanentBarangay: "",
        permanentZipCode: "",
        permanentRegion: "",
        permanentProvince: "",
        permanentMunicipality: "",
        permanentDswdHouseholdNumber: "",
        father_deceased: "",
        father_family_name: "", father_given_name: "", father_middle_name: "", father_ext: "", father_contact: "", father_occupation: "",
        father_income: "", father_email: "", mother_deceased: "", mother_family_name: "", mother_given_name: "", mother_middle_name: "",
        mother_contact: "", mother_occupation: "", mother_income: "", guardian: "", guardian_family_name: "", guardian_given_name: "",
        guardian_middle_name: "", guardian_ext: "", guardian_nickname: "", guardian_address: "", guardian_contact: "", guardian_email: "",
    });


    const [campusAddress, setCampusAddress] = useState("");


    useEffect(() => {
        if (settings && settings.address) {
            setCampusAddress(settings.address);
        }
    }, [settings]);


    // ✅ Fetch person data from backend
    const fetchPersonData = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/person/${id}`);
            setPerson(res.data); // make sure backend returns the correct format
        } catch (error) {
            console.error("Failed to fetch person:", error);
        }
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const queryPersonId = queryParams.get("person_id");

    // do not alter
    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const loggedInPersonId = localStorage.getItem("person_id");
        const searchedPersonId = sessionStorage.getItem("admin_edit_person_id");

        if (!storedUser || !storedRole || !loggedInPersonId) {
            window.location.href = "/login";
            return;
        }

        setUser(storedUser);
        setUserRole(storedRole);

        // Allow Applicant, Admin, SuperAdmin to view ECAT
        const allowedRoles = ["registrar", "applicant", "student"];
        if (allowedRoles.includes(storedRole)) {
            const targetId = searchedPersonId || queryPersonId || loggedInPersonId;
            setUserID(targetId);
            fetchPersonData(targetId);
            return;
        }

        window.location.href = "/login";
    }, [queryPersonId]);



    const [shortDate, setShortDate] = useState("");


    useEffect(() => {
        const updateDates = () => {
            const now = new Date();

            // Format 1: MM/DD/YYYY
            const formattedShort = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
            setShortDate(formattedShort);

            // Format 2: MM DD, YYYY hh:mm:ss AM/PM
            const day = String(now.getDate()).padStart(2, "0");
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const year = now.getFullYear();
            const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            const ampm = now.getHours() >= 12 ? "PM" : "AM";


        };

        updateDates(); // Set initial values
        const interval = setInterval(updateDates, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const divToPrintRef = useRef();

    const printDiv = () => {
        const divToPrint = divToPrintRef.current;
        if (divToPrint) {
            const newWin = window.open('', 'Print-Window');
            newWin.document.open();
            newWin.document.write(`
      <html>
        <head>
          <title>Print</title>
       <style>
  @page {
    size: Legal;
    margin: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 210mm;
    height: 297mm;
    font-family: Arial, sans-serif;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

.print-container {
  width: 100%;
  height: auto;
  padding: 10px 20px;
}

  .student-table {
    margin-top: 15px !important;
  }

 

  button {
    display: none;
  }

  

  .dataField{
    margin-top: 2px !important;
  }

  svg.MuiSvgIcon-root {
  margin-top: -53px;
    width: 70px !important;
    height: 70px !important;
  }
</style>

        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 100);">
          <div class="print-container">
            ${divToPrint.innerHTML}
          </div>
        </body>
      </html>
    `);
            newWin.document.close();
        } else {
            console.error("divToPrintRef is not set.");
        }
    };

    const [curriculumOptions, setCurriculumOptions] = useState([]);

    useEffect(() => {
        const fetchCurriculums = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/applied_program");
                setCurriculumOptions(response.data);
            } catch (error) {
                console.error("Error fetching curriculum options:", error);
            }
        };

        fetchCurriculums();
    }, []);

    console.log("person.program:", person.program);
    console.log("curriculumOptions:", curriculumOptions);

    {
        curriculumOptions.find(
            (item) =>
                item?.curriculum_id?.toString() === (person?.program ?? "").toString()
        )?.program_description || (person?.program ?? "")

    }


    return (
        <Box
            sx={{
                height: "calc(100vh - 150px)",
                overflowY: "auto",
                paddingRight: 1,
                backgroundColor: "transparent",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mb: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: titleColor,
                        fontSize: "36px",
                    }}
                >
                    APPLICANT CHANGE COURSE FORM
                </Typography>
            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />

            <button
                onClick={printDiv}
                style={{
                    marginBottom: "1rem",
                    padding: "10px 20px",
                    border: "2px solid black",
                    backgroundColor: "#f0f0f0",
                    color: "black",
                    borderRadius: "5px",
                    marginTop: "20px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#d3d3d3")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
            >
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <FcPrint size={20} />
                    Print Applicant Course Form
                </span>
            </button>





            <div ref={divToPrintRef} style={{ marginBottom: "5%" }}>

                <Container>

                    <div
                        className="student-table"
                        style={{
                            width: "8in", // matches table width assuming 8in for 40 columns
                            maxWidth: "100%",
                            margin: "0 auto",
                            marginTop: "-10px",

                            boxSizing: "border-box",
                            padding: "10px 0",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between", // spread logo, text, profile+QR
                                flexWrap: "nowrap",
                            }}
                        >
                            {/* Logo (Left Side) */}
                            <div style={{ flexShrink: 0 }}>
                                <img
                                    src={fetchedLogo}
                                    alt="School Logo"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        marginLeft: "10px",
                                        marginTop: "-25px",
                                        borderRadius: "50%", // ✅ Makes it perfectly circular

                                    }}
                                />
                            </div>

                            {/* Text Block (Center) */}
                            <div
                                style={{
                                    flexGrow: 1,
                                    textAlign: "center",
                                    fontSize: "14px",
                                    fontFamily: "Arial",
                                    letterSpacing: "5",
                                    lineHeight: 1.4,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                }}
                            >
                                <div
                                    style={{ fontFamily: "Arial", fontSize: "14px" }}
                                >
                                    Republic of the Philippines
                                </div>
                                <div
                                    style={{

                                        letterSpacing: "2px",
                                        fontFamily: "Times new roman",
                                        fontWeight: "bold",
                                        fontSize: "16px"
                                    }}
                                >
                                    {firstLine}
                                </div>
                                {secondLine && (
                                    <div
                                        style={{

                                            letterSpacing: "2px",
                                            fontWeight: "bold",
                                            fontFamily: "Times new roman",
                                            fontSize: "16px"
                                        }}
                                    >
                                        {secondLine}
                                    </div>
                                )}
                                {campusAddress && (
                                    <div style={{ fontSize: "14px", fontFamily: "Arial" }}>
                                        {campusAddress}
                                    </div>
                                )}

                                <div
                                    style={{ fontFamily: "Arial", letterSpacing: "1px" }}
                                >
                                    <b>OFFICE OF THE ADMISSION SERVICES</b>
                                </div>

                                <br />

                                <div
                                    style={{
                                        fontSize: "21px",
                                        fontFamily: "Arial",
                                        fontWeight: "bold",
                                        marginBottom: "5px",
                                        marginTop: "0",
                                        textAlign: "center",
                                    }}
                                >
                                    Applicant's Change Course Form
                                </div>
                            </div>

                            {/* Profile + QR Code (Right Side) */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",   // ✅ side by side
                                    alignItems: "center",
                                    marginRight: "10px",
                                    gap: "10px",            // ✅ 10px space between them
                                }}
                            >
                                {/* Profile Image (2x2) */}
                                <div
                                    style={{
                                        width: "1.3in",
                                        height: "1.3in",
                                        border: "1px solid black",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                        marginTop: "-15px"
                                    }}
                                >
                                    {person?.profile_img ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${person.profile_img}`}
                                            alt="Profile"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",

                                            }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: "12px", color: "#888" }}>No Image</span>
                                    )}
                                </div>



                            </div>

                        </div>
                    </div>


                    <br />
                    <br />
                    <table

                        style={{
                            borderCollapse: "collapse",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            width: "8in",
                            margin: "0 auto",

                            marginTop: "-30px",
                            textAlign: "center",
                            tableLayout: "fixed",
                        }}
                    >

                        <tbody>
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end", // moves everything to the far right of the row
                                            alignItems: "center",
                                            width: "100%",
                                        }}
                                    >
                                        <label
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                marginRight: "10px",
                                                marginTop: "-10px",

                                                fontSize: "14px"

                                            }}
                                        >
                                            Applicant Id No.:
                                        </label>

                                        <span
                                            style={{
                                                width: "200px", // fixed width for the underline
                                                borderBottom: "1px solid black",
                                                height: "1.3em",
                                                fontSize: "14px",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div style={{ marginTop: "-3px" }} className="dataField">
                                                {person.applicant_numbers}
                                            </div>
                                        </span>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td
                                    colSpan={40}
                                    style={{

                                        fontSize: "13px",
                                        paddingTop: "5px",
                                        marginTop: 0,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                marginRight: "10px",
                                                fontSize: "14px"
                                            }}
                                        >
                                            Name of Student:
                                        </span>
                                        <div style={{ flexGrow: 1, display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                                                {person.last_name}
                                            </span>
                                            <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                                                {person.first_name}
                                            </span>
                                            <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                                                {person.middle_name}
                                            </span>
                                            <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                                                {person.extension}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* Labels Row */}
                            <tr>
                                <td
                                    colSpan={40}
                                    style={{

                                        fontSize: "12px",
                                        paddingTop: "2px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginLeft: "-30px",

                                        }}
                                    >
                                        <span style={{ width: "20%", textAlign: "center" }}>(Pls. PRINT)</span>
                                        <span style={{ width: "20%", textAlign: "center" }}>Last Name</span>
                                        <span style={{ width: "20%", textAlign: "center" }}>Given Name</span>
                                        <span style={{ width: "20%", textAlign: "center" }}>Middle Name</span>
                                        <span style={{ width: "20%", textAlign: "center" }}>Ext. Name</span>
                                    </div>
                                </td>
                            </tr>

                            {/* Email & Applicant ID */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={20}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px", fontSize: "14px" }}>Date Applied</label>
                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "14px" }}>
                                            <div style={{ marginTop: "-3px" }} className="dataField"></div>
                                        </span>
                                    </div>
                                </td>
                                <td colSpan={20}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px", fontSize: "14px" }}>Date Examination:</label>
                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "14px" }}>
                                            <div style={{ marginTop: "-3px" }} className="dataField"></div>
                                        </span>
                                    </div>
                                </td>
                            </tr>

                            {/* Email & Applicant ID */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "10px" }}>
                                        <label
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                fontSize: "14px",
                                                marginRight: "10px",
                                            }}
                                        >
                                            ECAT Examination Result/Score:
                                        </label>

                                        {/* 25px inline block space */}
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: "100px",
                                                height: "1px",
                                                marginRight: "15px",
                                                borderBottom: "1px solid black",
                                            }}
                                        ></span>

                                        {/* PASSED checkbox */}
                                        <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                                            <input
                                                type="checkbox"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    marginRight: "8px",
                                                }}
                                            />
                                            <span style={{ fontSize: "14px", fontWeight: "bold" }}>Passed</span>
                                        </div>

                                        {/* FAILED checkbox */}
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <input
                                                type="checkbox"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    marginRight: "8px",
                                                }}
                                            />
                                            <span style={{ fontSize: "14px", fontWeight: "bold" }}>Failed</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={40} style={{ padding: 0 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            gap: "0px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {/* LEFT HALF */}
                                        <div style={{ width: "50%" }}>
                                            <span
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: "bold",
                                                    display: "block",
                                                    marginBottom: "3px",
                                                    textAlign: "left",
                                                }}
                                            >
                                                FROM DEGREE/PROGRAM APPLIED
                                            </span>

                                            <div
                                                style={{
                                                    border: "1px solid black",
                                                    width: "100%",
                                                    height: "50px",
                                                    padding: "8px",
                                                    fontSize: "12px",
                                                }}
                                            ></div>
                                        </div>

                                        {/* RIGHT HALF */}
                                        <div style={{ width: "50%" }}>
                                            <span
                                                style={{
                                                    fontSize: "15px",

                                                    display: "block",
                                                    textAlign: "left",
                                                    marginBottom: "3px",
                                                }}
                                            >
                                                Change to <b>NEW DEGREE/PROGRAM</b>
                                            </span>

                                            <div
                                                style={{
                                                    border: "1px solid black",
                                                    width: "100%",
                                                    height: "50px",
                                                    padding: "8px",
                                                    fontSize: "12px",
                                                    marginBottom: "5px"
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>



                            {/* Reason for Change + Applicant's Signature (matches image placement) */}
                            <tr style={{ fontSize: "13px", }}>
                                <td colSpan={40} style={{ padding: 0 }}>
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            paddingTop: "6px",
                                            paddingBottom: "6px",
                                            boxSizing: "border-box",

                                        }}
                                    >
                                        {/* Label + underline */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: "700",
                                                    whiteSpace: "nowrap",
                                                    
                                                    marginRight: "6px",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                Reason's for Change:
                                            </span>

                                            {/* Underline that fills until signature block */}
                                            <div
                                                style={{
                                                    flexGrow: 1,
                                                    borderBottom: "1px solid #000",
                                                    height: "1.15em",
                                                    marginTop: "-4px",
                                                    marginRight: "260px", // space for signature block
                                                }}
                                            ></div>
                                        </div>

                                        {/* Signature block on the right */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                right: "6px",
                                                top: "6.50px",
                                                width: "240px",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "4px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    borderBottom: "1px solid #000",
                                                    height: "1.15em",
                                                    marginBottom: "-3px",
                                                }}
                                            ></div>
                                            <div
                                                style={{
                                                    fontSize: "11px",
                                                    whiteSpace: "nowrap",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Applicant's Signature
                                            </div>
                                        </div>

                                        {/* NEW LINE — 60% width (AFTER signature) */}
                                        <div
                                            style={{
                                                marginTop: "12px",
                                                width: "64.5%",
                                                borderBottom: "1px solid #000",
                                                height: "1.1em",
                                                marginLeft: "6px", // aligns with other left content
                                            }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>

                            {/* College Approval from Current Program Applied */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{

                                            fontWeight: "bold",
                                            textAlign: "left",
                                            fontSize: "14px"
                                        }}
                                    >
                                        College Approval from current program applied:
                                    </div>
                                </td>
                            </tr>
                            {/* College Code / Program Head / College Dean */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            marginTop: "5px",
                                        }}
                                    >
                                        {/* College Code */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>College Code</div>
                                        </div>

                                        {/* Program Head */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>Program Head</div>
                                        </div>

                                        {/* College Dean */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>College Dean</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{

                                            fontWeight: "bold",
                                            textAlign: "left",
                                            fontSize: "14px"
                                        }}
                                    >
                                        College Acceptance to new program applied:
                                    </div>
                                </td>
                            </tr>

                            {/* College Code / Program Head / College Dean (Approval Row) */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            marginTop: "5px",
                                        }}
                                    >
                                        {/* College Code */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>College Code</div>
                                        </div>

                                        {/* Program Head */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>Program Head</div>
                                        </div>

                                        {/* College Dean */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>College Dean</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>



                            {/* Accepted / Not Accepted / Others */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end", // aligns everything to the right
                                            alignItems: "center",
                                            gap: "20px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {/* Accepted */}
                                        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input type="checkbox" style={{ width: "25px", height: "25px" }} />
                                            Accepted
                                        </label>

                                        {/* Not Accepted */}
                                        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input type="checkbox" style={{ width: "25px", height: "25px" }} />
                                            Not Accepted
                                        </label>

                                        {/* Other/s + Line beside it */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <input type="checkbox" style={{ width: "25px", height: "25px" }} />
                                                Other/s:
                                            </label>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    width: "250px",
                                                    height: "1px",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>



                        </tbody>

                    </table>
                </Container>
                <div
                    className="student-table"
                    style={{
                        width: "8in", // matches table width assuming 8in for 40 columns
                        maxWidth: "100%",
                        margin: "0 auto",
                        boxSizing: "border-box",
                        padding: "10px 0",
                        
                    }}
                >
                    {/* Top solid line */}
                    <hr
                        style={{
                            width: "100%",
                            maxWidth: "100%",
                            borderTop: "1px solid black",
                            marginTop: "-5px",
                        }}
                    />

                    {/* College Dean's Copy aligned right */}
                    <div
                        style={{
                            width: "100%",
                            textAlign: "right", // aligns to the right side
                            fontWeight: "normal",
                            fontSize: "14px",
                            color: "black",
                            marginBottom: "0",
                            marginTop: "10px"
                        }}
                    >
                        College Dean's Copy
                    </div>

                    {/* Bottom dashed line */}
                    <hr
                        style={{
                            width: "100%",

                            border: "none",
                            borderTop: "1px dashed black",
                            margin: "10px auto",
                        }}
                    />
                </div>


                <Container>

                    <div
                        className="student-table2"
                        style={{
                            width: "8in", // matches table width assuming 8in for 40 columns
                            maxWidth: "100%",
                            margin: "0 auto",
                            marginTop: "-10px",

                            boxSizing: "border-box",
                            padding: "10px 0",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between", // spread logo, text, profile+QR
                                flexWrap: "nowrap",

                            }}
                        >
                            {/* Logo (Left Side) */}
                            <div style={{ flexShrink: 0 }}>
                                <img
                                    src={fetchedLogo}
                                    alt="School Logo"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        marginLeft: "10px",
                                        marginTop: "-25px",
                                        borderRadius: "50%", // ✅ Makes it perfectly circular

                                    }}
                                />
                            </div>

                            {/* Text Block (Center) */}
                            <div
                                style={{
                                    flexGrow: 1,
                                    textAlign: "center",
                                    fontSize: "14px",
                                    fontFamily: "Arial",
                                    letterSpacing: "5",
                                    lineHeight: 1.4,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                }}
                            >
                                <div
                                    style={{ fontFamily: "Arial", fontSize: "14px" }}
                                >
                                    Republic of the Philippines
                                </div>
                                <div
                                    style={{

                                        letterSpacing: "2px",
                                        fontFamily: "Times new roman",
                                        fontWeight: "bold",
                                        fontSize: "16px"
                                    }}
                                >
                                    {firstLine}
                                </div>
                                {secondLine && (
                                    <div
                                        style={{

                                            letterSpacing: "2px",
                                            fontWeight: "bold",
                                            fontFamily: "Times new roman",
                                            fontSize: "16px"
                                        }}
                                    >
                                        {secondLine}
                                    </div>
                                )}
                                {campusAddress && (
                                    <div style={{ fontSize: "14px", fontFamily: "Arial" }}>
                                        {campusAddress}
                                    </div>
                                )}

                                <div
                                    style={{ fontFamily: "Arial", letterSpacing: "1px" }}
                                >
                                    <b>OFFICE OF THE ADMISSION SERVICES</b>
                                </div>

                                <br />

                                <div
                                    style={{
                                        fontSize: "21px",
                                        fontFamily: "Arial",
                                        fontWeight: "bold",
                                        marginBottom: "5px",
                                        marginTop: "0",
                                        textAlign: "center",
                                    }}
                                >
                                    Applicant's Change Course Form
                                </div>
                            </div>

                            {/* Profile + QR Code (Right Side) */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",   // ✅ side by side
                                    alignItems: "center",
                                    marginRight: "10px",
                                    gap: "10px",            // ✅ 10px space between them
                                }}
                            >
                                {/* Profile Image (2x2) */}
                                <div
                                    style={{
                                        width: "1.3in",
                                        height: "1.3in",
                                        border: "1px solid black",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                        marginTop: "-15px"
                                    }}
                                >
                                    {person?.profile_img ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${person.profile_img}`}
                                            alt="Profile"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",

                                            }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: "12px", color: "#888" }}>No Image</span>
                                    )}
                                </div>



                            </div>

                        </div>
                    </div>


                    <br />
                    <br />
                    <table

                        style={{
                            borderCollapse: "collapse",
                            fontFamily: "Arial, Helvetica, sans-serif",
                            width: "8in",
                            margin: "0 auto",
                            marginTop: "-20px",


                            textAlign: "center",
                            tableLayout: "fixed",
                        }}
                    >

                        <tbody>
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end", // moves everything to the far right of the row
                                            alignItems: "center",
                                            width: "100%",
                                        }}
                                    >
                                        <label
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                marginRight: "10px",
                                                marginTop: "-10px",

                                                fontSize: "14px"
                                            }}
                                        >
                                            Applicant Id No.:
                                        </label>

                                        <span
                                            style={{
                                                width: "200px", // fixed width for the underline
                                                borderBottom: "1px solid black",
                                                height: "1.3em",
                                                fontSize: "14px",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div style={{ marginTop: "-3px" }} className="dataField">
                                                {person.applicant_numbers}
                                            </div>
                                        </span>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td
                                    colSpan={40}
                                    style={{

                                        fontSize: "13px",
                                        paddingTop: "5px",
                                        marginTop: 0,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                marginRight: "10px",
                                                fontSize: "14px"
                                            }}
                                        >
                                            Name of Student:
                                        </span>
                                        <div style={{ flexGrow: 1, display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                                                {person.last_name}
                                            </span>
                                            <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                                                {person.first_name}
                                            </span>
                                            <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                                                {person.middle_name}
                                            </span>
                                            <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                                                {person.extension}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* Labels Row */}
                            <tr>
                                <td
                                    colSpan={40}
                                    style={{

                                        fontSize: "12px",
                                        paddingTop: "2px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginLeft: "-30px",

                                        }}
                                    >
                                        <span style={{ width: "20%", textAlign: "center" }}>(Pls. PRINT)</span>
                                        <span style={{ width: "20%", textAlign: "center" }}>Last Name</span>
                                        <span style={{ width: "20%", textAlign: "center" }}>Given Name</span>
                                        <span style={{ width: "20%", textAlign: "center" }}>Middle Name</span>
                                        <span style={{ width: "20%", textAlign: "center" }}>Ext. Name</span>
                                    </div>
                                </td>
                            </tr>

                            {/* Email & Applicant ID */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={20}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px", fontSize: "14px" }}>Date Applied</label>
                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "14px" }}>
                                            <div style={{ marginTop: "-3px" }} className="dataField"></div>
                                        </span>
                                    </div>
                                </td>
                                <td colSpan={20}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px", fontSize: "14px" }}>Date Examination:</label>
                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "14px" }}>
                                            <div style={{ marginTop: "-3px" }} className="dataField"></div>
                                        </span>
                                    </div>
                                </td>
                            </tr>

                            {/* Email & Applicant ID */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "10px" }}>
                                        <label
                                            style={{
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                                fontSize: "14px",
                                                marginRight: "10px",
                                            }}
                                        >
                                            ECAT Examination Result/Score:
                                        </label>

                                        {/* 25px inline block space */}
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: "100px",
                                                height: "1px",
                                                marginRight: "15px",
                                                borderBottom: "1px solid black",
                                            }}
                                        ></span>

                                        {/* PASSED checkbox */}
                                        <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
                                            <input
                                                type="checkbox"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    marginRight: "8px",
                                                }}
                                            />
                                            <span style={{ fontSize: "14px", fontWeight: "bold" }}>Passed</span>
                                        </div>

                                        {/* FAILED checkbox */}
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <input
                                                type="checkbox"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    marginRight: "8px",
                                                }}
                                            />
                                            <span style={{ fontSize: "14px", fontWeight: "bold" }}>Failed</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={40} style={{ padding: 0 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            gap: "0px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {/* LEFT HALF */}
                                        <div style={{ width: "50%" }}>
                                            <span
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: "bold",
                                                    display: "block",
                                                    marginBottom: "3px",
                                                    textAlign: "left",
                                                }}
                                            >
                                                FROM DEGREE/PROGRAM APPLIED
                                            </span>

                                            <div
                                                style={{
                                                    border: "1px solid black",
                                                    width: "100%",
                                                    height: "50px",
                                                    padding: "8px",
                                                    fontSize: "12px",
                                                }}
                                            ></div>
                                        </div>

                                        {/* RIGHT HALF */}
                                        <div style={{ width: "50%" }}>
                                            <span
                                                style={{
                                                    fontSize: "15px",

                                                    display: "block",
                                                    textAlign: "left",
                                                    marginBottom: "3px",
                                                }}
                                            >
                                                Change to <b>NEW DEGREE/PROGRAM</b>
                                            </span>

                                            <div
                                                style={{
                                                    border: "1px solid black",
                                                    width: "100%",
                                                    height: "50px",
                                                    padding: "8px",
                                                    fontSize: "12px",
                                                    marginBottom: "5px"
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>



                            {/* Reason for Change + Applicant's Signature (matches image placement) */}
                            <tr style={{ fontSize: "13px", }}>
                                <td colSpan={40} style={{ padding: 0 }}>
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            paddingTop: "6px",
                                            paddingBottom: "6px",
                                            boxSizing: "border-box",

                                        }}
                                    >
                                        {/* Label + underline */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: "700",
                                                    whiteSpace: "nowrap",
                                                    marginLeft: "6px",
                                                    marginRight: "6px",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                Reason's for Change:
                                            </span>

                                            {/* Underline that fills until signature block */}
                                            <div
                                                style={{
                                                    flexGrow: 1,
                                                    borderBottom: "1px solid #000",
                                                    height: "1.15em",
                                                    marginTop: "-4px",
                                                    marginRight: "260px", // space for signature block
                                                }}
                                            ></div>
                                        </div>

                                        {/* Signature block on the right */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                right: "6px",
                                                top: "6px",
                                                width: "240px",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "4px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    borderBottom: "1px solid #000",
                                                    height: "1.15em",
                                                    marginBottom: "-2px",
                                                }}
                                            ></div>
                                            <div
                                                style={{
                                                    fontSize: "11px",
                                                    whiteSpace: "nowrap",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Applicant's Signature
                                            </div>
                                        </div>

                                        {/* NEW LINE — 60% width (AFTER signature) */}
                                        <div
                                            style={{
                                                marginTop: "12px",
                                                width: "64.5%",
                                                borderBottom: "1px solid #000",
                                                height: "1.1em",
                                                marginLeft: "6px", // aligns with other left content
                                            }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>

                            {/* College Approval from Current Program Applied */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{

                                            fontWeight: "bold",
                                            textAlign: "left",
                                            fontSize: "14px"
                                        }}
                                    >
                                        College Approval from current program applied:
                                    </div>
                                </td>
                            </tr>
                            {/* College Code / Program Head / College Dean */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            marginTop: "5px",
                                        }}
                                    >
                                        {/* College Code */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>College Code</div>
                                        </div>

                                        {/* Program Head */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>Program Head</div>
                                        </div>

                                        {/* College Dean */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>College Dean</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{

                                            fontWeight: "bold",
                                            textAlign: "left",
                                            fontSize: "14px"
                                        }}
                                    >
                                        College Acceptance to new program applied:
                                    </div>
                                </td>
                            </tr>

                            {/* College Code / Program Head / College Dean (Approval Row) */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            marginTop: "5px",
                                        }}
                                    >
                                        {/* College Code */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>College Code</div>
                                        </div>

                                        {/* Program Head */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>Program Head</div>
                                        </div>

                                        {/* College Dean */}
                                        <div style={{ width: "30%" }}>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    height: "1.2em",
                                                }}
                                            ></div>
                                            <div style={{ marginTop: "3px" }}>College Dean</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>



                            {/* Accepted / Not Accepted / Others */}
                            <tr style={{ fontSize: "13px" }}>
                                <td colSpan={40}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end", // aligns everything to the right
                                            alignItems: "center",
                                            gap: "20px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {/* Accepted */}
                                        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input type="checkbox" style={{ width: "25px", height: "25px" }} />
                                            Accepted
                                        </label>

                                        {/* Not Accepted */}
                                        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <input type="checkbox" style={{ width: "25px", height: "25px" }} />
                                            Not Accepted
                                        </label>

                                        {/* Other/s + Line beside it */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <input type="checkbox" style={{ width: "25px", height: "25px" }} />
                                                Other/s:
                                            </label>
                                            <div
                                                style={{
                                                    borderBottom: "1px solid black",
                                                    width: "250px",
                                                    height: "1px",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>



                        </tbody>

                    </table>

                </Container>
                <div
                    className="student-table"
                    style={{
                        width: "8in", // matches table width assuming 8in for 40 columns
                        maxWidth: "100%",
                        margin: "0 auto",
                        boxSizing: "border-box",
                        padding: "10px 0",
                    }}
                >
                    {/* Top solid line */}
                    <hr
                        style={{
                            width: "100%",
                            maxWidth: "100%",
                            borderTop: "1px solid black",
                            marginTop: "-5px",
                        }}
                    />

                    {/* College Dean's Copy aligned right */}
                    <div
                        style={{
                            width: "100%",
                            textAlign: "right", // aligns to the right side
                            fontWeight: "normal",
                            fontSize: "14px",
                            color: "black",
                            marginBottom: "0",
                            marginTop: "10px"
                        }}
                    >
                        Admission Services Copy
                    </div>


                </div>

            </div>

        </Box >
    );
};

export default ApplicantChangeCourseForm;
