
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

// Common API request function
async function request(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      "The recipe service is temporarily unavailable."
    );
  }

  return response.json();
}

// Search recipes by name
export async function searchMeals(query) {
  const data = await request(
    `search.php?s=${encodeURIComponent(query)}`
  );

  return data.meals || [];
}

// Get all recipe categories
export async function getCategories() {
  const data = await request("categories.php");

  return data.categories || [];
}

// Get recipes by category
export async function getMealsByCategory(category) {
  const data = await request(
    `filter.php?c=${encodeURIComponent(category)}`
  );

  return data.meals || [];
}

// Get available cuisines / countries
export async function getAreas() {
  const data = await request("list.php?a=list");

  return data.meals || [];
}

// Get recipes by country / cuisine
export async function getMealsByArea(area) {
  if (!area || area === "All") {
    return [];
  }

  const data = await request(
    `filter.php?a=${encodeURIComponent(area)}`
  );

  return data.meals || [];
}

// Get complete recipe details by ID
export async function getMealById(id) {
  const data = await request(
    `lookup.php?i=${encodeURIComponent(id)}`
  );

  return data.meals?.[0] || null;
}

// Get a random recipe
export async function getRandomMeal() {
  const data = await request("random.php");

  return data.meals?.[0] || null;
}

// Extract ingredients and measurements
export function getIngredients(meal) {
  if (!meal) return [];

  return Array.from({ length: 20 }, (_, index) => {
    const ingredient = meal[
      `strIngredient${index + 1}`
    ]?.trim();

    const measure = meal[
      `strMeasure${index + 1}`
    ]?.trim();

    return ingredient
      ? { ingredient, measure }
      : null;
  }).filter(Boolean);
}
