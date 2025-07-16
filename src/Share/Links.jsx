import React from "react";
import { NavLink } from "react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/allclass", label: "All Classes" },
  { to: "/apply_Teacher", label: "Teach-on-BPI" },
];

const NavLinks = ({ onLinkClick }) => {
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
