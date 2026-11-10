import { useEffect, useState } from "react";
import { getCategories } from "../services/mealApi";
import LoadingSpinner from "./LoadingSpinner";

export default function CategoryList({ selected, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="category-loading"><LoadingSpinner label="Loading categories..." /></div>;
  return (
    <div className="category-pills">
      <button className={`category-pill ${selected === "" ? "active" : ""}`} onClick={() => onSelect("")}>All recipes</button>
      {categories.map((category) => (
        <button key={category.idCategory} className={`category-pill ${selected === category.strCategory ? "active" : ""}`} onClick={() => onSelect(category.strCategory)}>
          {category.strCategory}
        </button>
      ))}
    </div>
  );
}
