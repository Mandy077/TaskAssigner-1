import React, { useContext, useState } from "react";

import styles from "./adminHeader.module.css";
import { AdminContext } from "../../context/AdminContext";
import { Link, useLocation } from "react-router-dom";
const AdminHeader = () => {
  const { admin, logout, darkMode, setDarkMode } = useContext(AdminContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  console.log("Admin Header log: ", admin.username);

  return (
    <div className={`${darkMode ? styles.container : styles.darkHeader}`}>
      <div className={styles.mainHeaderNav}>
        {/* Logo Section */}
        <div className={styles.navHead}>
          <img src="/logo.webp" alt="Logo" />
        </div>

        {/* Toggle Container (Centered) */}
        <div className={styles.toggleContainer2}>
          <input
            type="checkbox"
            id="darkmode-toggle"
            className={styles.toggleCheckbox2}
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <label htmlFor="darkmode-toggle" className={styles.toggleLabel2}>
            <span className={styles.toggleIcon2}>{darkMode ? "🌙" : "🔆"}</span>
          </label>
        </div>

        {/* Hamburger Menu */}
        <div
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </div>
      <div className={styles.button}>
        <ul>
          <li className={location.pathname === "/" ? styles.active : ""}>
            <Link to="/">Home</Link>
          </li>
          <li className={location.pathname === "/admin" ? styles.active : ""}>
            <Link to="/admin">dashboard</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/extensionRequests"
                ? styles.active
                : ""
            }
          >
            <Link to="/admin/extensionRequests">extensionRequests</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/meetings"
                ? styles.active
                : ""
            }
          >
            <Link to="/admin/meetings">Meetings</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/users" ? styles.active : ""
            }
          >
            <Link to="/admin/users">users</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/createTask" ? styles.active : ""
            }
          >
            <Link to="/admin/createTask">createTask</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/assignedTasks" ? styles.active : ""
            }
          >
            <Link to="/admin/assignedTasks">assignedTasks</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/allTasks" ? styles.active : ""
            }
          >
            <Link to="/admin/allTasks">allTasks</Link>
          </li>
        </ul>
        <button styles={styles.logout} onClick={() => logout()}>
          Logout
        </button>
      </div>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.showMenu : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <ul>
          <li className={location.pathname === "/" ? styles.active : ""}>
            <Link to="/">Home</Link>
          </li>
          <li
            className={location.pathname === "/admin" ? styles.active : ""}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Link to="/admin">dashboard</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/extensionRequests"
                ? styles.active
                : ""
            }
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Link to="/admin/extensionRequests">extensionRequests</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/users" ? styles.active : ""
            }
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Link to="/admin/users">users</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/createTask" ? styles.active : ""
            }
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Link to="/admin/createTask">createTask</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/assignedTasks" ? styles.active : ""
            }
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Link to="/admin/assignedTasks">assignedTasks</Link>
          </li>
          <li
            className={
              location.pathname === "/admin/allTasks" ? styles.active : ""
            }
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Link to="/admin/allTasks">allTasks</Link>
          </li>
        </ul>
        <button styles={styles.logout} onClick={() => logout()}>
          Logout
        </button>
      </div>
      {/* <button onClick={()=> logout()}>LogOut</button> */}
    </div>
  );
};

export default AdminHeader;
