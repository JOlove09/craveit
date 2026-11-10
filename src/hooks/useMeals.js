import { useEffect, useState } from "react";
import { searchMeals } from "../services/mealApi";

export default function useMeals(query) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await searchMeals(query);
        if (active) setMeals(result);
      } catch (err) {
        if (active) setError(err.message || "Could not load recipes.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [query]);

  return { meals, loading, error };
}
