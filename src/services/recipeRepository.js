import localRecipes from "../data/asianRecipes.json";
const API = "https://dummyjson.com/recipes";
const ASIAN = ["Indian", "Korean", "Japanese", "Chinese", "Thai", "Vietnamese", "Malaysian", "Filipino", "Indonesian"];
export const curatedRecipes = localRecipes;
function normalize(r) {
  return {idMeal:`dummy-${r.id}`,strMeal:r.name,strMealThumb:r.image,strArea:r.cuisine||"Other",strCategory:r.mealType?.[0]||"Recipe",source:"dummyjson",readyInMinutes:(r.prepTimeMinutes||0)+(r.cookTimeMinutes||0),servings:r.servings,ingredients:(r.ingredients||[]).map(ingredient=>({ingredient,measure:""})),steps:r.instructions||[],tags:r.tags||[],vegetarian:undefined,vegan:undefined};
}
export async function fetchPublicRecipes(signal) {
  const res=await fetch(`${API}?limit=0`,{signal});
  if(!res.ok) throw new Error(`Public API returned ${res.status}`);
  const data=await res.json();
  return (data.recipes||[]).filter(r=>ASIAN.some(a=>(r.cuisine||"").toLowerCase()===a.toLowerCase())).map(normalize);
}
export async function fetchPublicRecipe(id,signal) {
  const res=await fetch(`${API}/${encodeURIComponent(id)}`,{signal});
  if(!res.ok) throw new Error("Recipe unavailable from public API.");
  return normalize(await res.json());
}
export function getLocalRecipe(id){return localRecipes.find(r=>r.idMeal===id)||null;}
export function matchesDiet(recipe,diet){
 if(diet==='All')return true;
 if(recipe.source==='dummyjson')return false; // API does not provide verified dietary labels
 if(diet==='Vegetarian')return recipe.vegetarian===true;
 if(diet==='Vegan')return recipe.vegan===true;
 return recipe.vegetarian===false;
}
