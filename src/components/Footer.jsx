import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="footer-brand">CraveIt<span>.</span></Link>
          <p className="mb-0">A little inspiration for every plate.</p>
        </div>
        <div className="footer-note">Made with <Heart size={14} fill="currentColor" /> for food lovers</div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} CraveIt · Recipes from CraveIt Collection and DummyJSON API</div>
    </footer>
  );
}
