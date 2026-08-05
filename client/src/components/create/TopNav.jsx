import { NavLink } from "react-router-dom";

export default function TopNav({
  label = "SETUP",
  backLabel = "Discover Communities",
  backHref = "/student-discover-communities",
}) {
  return (
    <nav className="topnav">
      <span className="topnav__label">{label}</span>

      <NavLink to={backHref} className="topnav__back">
        &#8592; {backLabel}
      </NavLink>
    </nav>
  );
}