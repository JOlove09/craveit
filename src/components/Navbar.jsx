import { ChefHat, Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark crave-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand brand-mark" to="/">
          <span className="brand-icon"><ChefHat size={23} /></span>
          CraveIt<span className="brand-dot">.</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/explore"><Search size={15} className="me-1" />Explore</NavLink>
            <Link to="/explore" className="btn btn-nav-cta ms-lg-2">Find a recipe</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
