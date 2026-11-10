import RecipePhoto from "./RecipePhoto";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecipeCard({ recipe, index = 0 }) {

  return (
    <article className="recipe-card" style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}>
      <div className="recipe-card-image-wrap">
        <Link to={`/recipe/${recipe.idMeal}`} aria-label={`View ${recipe.strMeal}`}>
          <RecipePhoto className="recipe-card-image" recipe={recipe} />
        </Link>
      </div>
      <div className="recipe-card-content">
        <span className="eyebrow">CRAVEIT COLLECTION</span>
        <h3><Link to={`/recipe/${recipe.idMeal}`}>{recipe.strMeal}</Link></h3>
        <div className="recipe-card-bottom">
          <span>{recipe.strArea || recipe.strCategory || "Recipe inspiration"}</span>
          <Link className="card-arrow" to={`/recipe/${recipe.idMeal}`} aria-label={`See ${recipe.strMeal}`}><ArrowUpRight size={18} /></Link>
        </div>
      </div>
    </article>
  );
}
