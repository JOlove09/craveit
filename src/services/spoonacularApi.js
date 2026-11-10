
const BASE_URL = "https://api.spoonacular.com";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

async function request(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error("Spoonacular API key is missing.");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    if (response.status === 402) {
      throw new Error("Spoonacular API quota exceeded.");
    }

    if (response.status === 401) {
      throw new Error("Invalid Spoonacular API key.");
    }

    throw new Error("Unable to load recipes.");
  }

  return response.json();
}

export async function getRecipesByCuisine(
  cuisine,
  diet = "All"
) {
  const params = {
    cuisine,
    number: 12,
    addRecipeInformation: true,
    instructionsRequired: true,
  };

  if (diet === "Vegetarian") {
    params.diet = "vegetarian";
  } else if (diet === "Vegan") {
    params.diet = "vegan";
  }

  const data = await request(
    "/recipes/complexSearch",
    params
  );

  return data.results || [];
}

export async function searchRecipes(query) {
  const data = await request(
    "/recipes/complexSearch",
    {
      query,
      number: 12,
      addRecipeInformation: true,
    }
  );

  return data.results || [];
}

export async function getRecipeById(id) {
  return request(
    `/recipes/${encodeURIComponent(id)}/information`
  );
}

export async function testIndianRecipes() {
  return getRecipesByCuisine("Indian");
}

export async function testKoreanRecipes() {
  return getRecipesByCuisine("Korean");
}