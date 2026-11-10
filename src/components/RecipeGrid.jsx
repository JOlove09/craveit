import RecipeCard from "./RecipeCard";
import EmptyState from "./EmptyState";

export default function RecipeGrid({ recipes }) {
  if (!recipes.length) return <EmptyState title="No recipes found" message="Try a different keyword or choose another category." />;
  return (
    <div className="row g-4">
      {recipes.map((recipe, index) => (
        <div className="col-sm-6 col-lg-4 col-xl-3" key={recipe.idMeal}>
          <RecipeCard recipe={recipe} index={index} />
        </div>
      ))}
    </div>
  );
}
