import oslbRegister from "../assets/visitors-reg.png";
import oslbStaffLogin from "../assets/staff-login.png";
import oslbVisitHistory from "../assets/visit-history.png";
import oslbReports from "../assets/report.png";

const projects = [
    {
        id: "oslb-visitors-register",

        title: "Visitors Register",

        category: "WINDOWS DESKTOP APPLICATION",

        description:
            "A desktop visitor management system developed for the Osun State Library Board to digitize visitor registration, records, visit history, and reporting.",

        meta: [
            {
                label: "TYPE",
                value: "Desktop Application",
            },
            {
                label: "PLATFORM",
                value: "Windows",
            },
            {
                label: "TECHNOLOGY",
                value: "React · Electron · SQLite",
            },
            {
                label: "ROLE",
                value: "Design & Development",
            },
        ],

        overview: [
            "The OSLB Visitors Register is a desktop application designed to provide a centralized digital workflow for managing library visitors.",

            "The system combines visitor registration with a secure staff administration area, allowing visitor information and visit records to be managed digitally.",
        ],

        features: [
            "Public visitor registration",
            "Staff authentication",
            "Visitor records management",
            "Visit history tracking",
            "Reports and data management",
            "Application settings",
            "Local SQLite database",
            "Windows desktop packaging",
        ],

        screenshots: [
            {
                image: oslbRegister,
                title: "Visitors Registration",
            },
            {
                image: oslbStaffLogin,
                title: "Staff Login",
            },
            {
                image: oslbVisitHistory,
                title: "Visit History",
            },
            {
                image: oslbReports,
                title: "Reports",
            },
        ],

        technologies: [
            {
                name: "React",
                role: "Interface",
            },
            {
                name: "Electron",
                role: "Desktop Runtime",
            },
            {
                name: "SQLite",
                role: "Local Database",
            },
            {
                name: "Node.js",
                role: "Application Logic",
            },
        ],

        endText:
            "Built as a Windows desktop application.",

        technologyLabel:
            "REACT · ELECTRON · SQLITE",
    },
];

export default projects;
