import React, { useContext } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../AuthProvider/AuthProvider";



const NavLinks = ({ onLinkClick }) => {
    const { user } = useContext(AuthContext); 
const links = [
  { to: "/", label: "Home" },
  { to: "/allclass", label: "All Classes" },
   ...(user ? [{ to: "/apply_Teacher", label: "Teach-on-BPI" }] : []),
  { to: "/about", label: "AboutUs" },
   ...(user ? [{ to: "/contact", label: "ContactUs" }] : []),
];


  return (
    <>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onLinkClick}
          className={({ isActive }) =>
            isActive
              ? "text-blue-600  font-bold "
              : "hover:text-blue-600"
          }
          style={{ margin: "0 10px" }}
        >
          {label}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;
