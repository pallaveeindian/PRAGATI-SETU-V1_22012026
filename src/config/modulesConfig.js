import tmsLogo from "../assets/TMS/tms_logo.png";
import esmLogo from "../assets/ems_logo.png";
import ldmsLogo from "../assets/ldms_logo.png";
import prernaLogo from "../assets/prernaHd.png";
import BDOLogo from "../assets/BDOLogo.png";

export const MODULES_CONFIG = [
  // 2026-07-23T13:00:00

  {
    id: "tms",
    logo: tmsLogo,
    title: "TMS Portal",
    subtitle: "Training Management System",
    desc: "Manage training programs, capacity building, and skill development workflows efficiently.",
    color: "#2a56cf",
    path: "/module-login?module=tms",
    level: "All",
    maintenanceUntil: null,
  },
  {
    id: "crp",
    logo: esmLogo,
    title: "CRP-EP Mapping",
    subtitle: "Enterprise Tracking",
    desc: "Create Community Resource Person accounts and map their respective Panchayat coverage for Udhyam Sakhi App survey filling effectively.",
    color: "#f59e0b",
    path: "/module-login?module=crp",
    level: "District",
    maintenanceUntil: null,
  },
  {
    id: "ldms",
    logo: ldmsLogo,
    title: "LDMS Portal",
    subtitle: "Lakhpati Didi",
    desc: "Lakhpati Didi Management System is currently under development.",
    color: "#b91c1c",
    path: "#",
    level: "All",
    maintenanceUntil: "permanent", // "permanent" means ALWAYS INACTIVE
  },
  {
    id: "mou",
    logo: esmLogo,
    title: "Enterprise MOU",
    subtitle: "Memorandum of Understanding",
    desc: "Securely manage and monitor enterprise MOUs and related institutional agreements.",
    color: "#9333ea",
    path: "/module-login?module=mou",
    level: "Block",
    // Example of a module under maintenance. Change this date to test the countdown!
    // Format: "YYYY-MM-DDTHH:mm:ss"
    maintenanceUntil: "permanent",
  },
  {
    id: "epsms",
    logo: esmLogo,
    title: "EPSMS Portal",
    subtitle: "Enterprise Sakhi Management System",
    desc: "Securely manage and monitor enterprise Sakhi data submitted by field level CRPs using our Udhyam Sakhi Android App.",
    color: "#ea6733",
    path: "/module-login?module=epsms",
    level: "Block",
    maintenanceUntil: null,
  },
  {
    id: "prerna",
    logo: esmLogo,
    title: "Prerna Canteen Portal",
    subtitle: "Portal for Prerna Canteen Management",
    desc: "Portal for Prerna Canteen Management is currently under development.",
    color: "#ea3333",
    path: "/module-login?module=prerna",
    level: "Block",
    maintenanceUntil: "permanent",
  },
  {
    id: "pmuadmin",
    logo: BDOLogo,
    title: "PMU-IT Admin",
    subtitle: "PMU Login",
    desc: "PMU - IT Login",
    color: "#1a218ade",
    path: "/module-login?module=pmuadmin",
    level: "Block",
    maintenanceUntil: null,
  },
  {
    id: "masteradmin",
    logo: prernaLogo,
    title: "Master Admin",
    subtitle: "Master Login",
    desc: "MD - Master Login",
    color: "#1e8a1ade",
    path: "/module-login?module=admin",
    level: "Block",
    maintenanceUntil: "permanent",
  },
];
