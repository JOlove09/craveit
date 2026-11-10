import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({ title = "Nothing on the menu yet", message = "Try another search or explore something new." }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><ChefHat size={30} /></span>
      <h3>{title}</h3>
      <p>{message}</p>
      <Link to="/explore" className="btn btn-brand">Explore recipes</Link>
    </div>
  );
}
