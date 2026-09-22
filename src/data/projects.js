const projects = [
  {
    id: "oslb-visitors-register",
    name: "OSLB VISITORS REGISTER",
    category: "WINDOWS DESKTOP APPLICATION",
    description:
      "A visitor management system developed for the Osun State Library Board to digitize visitor registration, records, visit history, and reporting.",

    type: "Desktop Application",
    platform: "Windows",
    technology: "React · Electron · SQLite",
    role: "Design & Development",

    overview: [
      "A desktop application designed to provide a centralized digital workflow for managing library visitors.",
      "The system combines visitor registration with a secure staff administration area, allowing visitor information and visit records to be managed digitally."
    ],

    features: [
      "Public visitor registration",
      "Staff authentication",
      "Visitor records management",
      "Visit history tracking",
      "Reports and data management",
      "Application settings",
      "Local SQLite database",
      "Windows desktop packaging"
    ],

    technologies: [
      {
        name: "React",
        role: "Interface"
      },
      {
        name: "Electron",
        role: "Desktop Runtime"
      },
      {
        name: "SQLite",
        role: "Local Database"
      },
      {
        name: "Node.js",
        role: "Application Logic"
      }
    ],

    screenshots: [
      {
        image: "/projects/oslb/register.png",
        title: "Visitor Registration"
      },
      {
        image: "/projects/oslb/dashboard.png",
        title: "Staff Dashboard"
      },
      {
        image: "/projects/oslb/records.png",
        title: "Visitor Records"
      },
      {
        image: "/projects/oslb/reports.png",
        title: "Reports"
      }
    ]
  }
];

export default projects;
