import { Link } from "react-router-dom";

export default function TopNav({
  label = "SETUP",
  backLabel = "Discover Communities",
}) {
  return (
    <nav className="topnav">
      <span className="topnav__label">{label}</span>

      <Link to="/discover" className="topnav__back">
        &#8592; {backLabel}
      </Link>
    </nav>
  );
}