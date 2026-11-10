import { getMealById, searchMeals } from './mealApi';

export const CUISINES = [
  { name: 'Indian', flag: '🇮🇳', subtitle: 'Spices & comfort' },
  { name: 'Japanese', flag: '🇯🇵', subtitle: 'Fresh & delicate' },
  { name: 'Chinese', flag: '🇨🇳', subtitle: 'Bold & savoury' },
  { name: 'Thai', flag: '🇹🇭', subtitle: 'Sweet, sour & spicy' },
  { name: 'Vietnamese', flag: '🇻🇳', subtitle: 'Herbs & freshness' },
  { name: 'Malaysian', flag: '🇲🇾', subtitle: 'Rich & aromatic' },
  { name: 'Filipino', flag: '🇵🇭', subtitle: 'Homestyle favourites' },
  { name: 'Korean', flag: '🇰🇷', subtitle: 'Explore Korean flavours' },
];
const BASE = 'https://www.themealdb.com/api/json/v1/1/';
export async function getAsianMeals(area) {
  const res = await fetch(`${BASE}filter.php?a=${encodeURIComponent(area)}`);
  if (!res.ok) throw new Error('Could not load cuisine recipes.');
  const data = await res.json();
  return (data.meals || []).map(meal => ({ ...meal, strArea: area }));
}
// A cautious ingredient-based classification for demonstration. Unknown recipes stay unclassified.
const animal = /\b(chicken|beef|pork|lamb|mutton|fish|salmon|tuna|anchov|shrimp|prawn|crab|lobster|squid|oyster|clam|mussel|bacon|ham|sausage|gelatin|gelatine|lard|stock|broth|meat|duck|turkey|veal|chorizo|prosciutto|worcestershire|fish sauce|oyster sauce)\b/i;
const dairyEgg = /\b(egg|milk|cream|butter|cheese|yogurt|yoghurt|ghee|honey|paneer|mayonnaise|mayo|whey|casein)\b/i;
export function classifyDiet(meal) {
  if (!meal || !Object.keys(meal).some(k => k.startsWith('strIngredient'))) return 'Unknown';
  const ingredients = Array.from({length:20}, (_,i)=>meal[`strIngredient${i+1}`] || '').filter(Boolean).join(' ');
  if (!ingredients.trim()) return 'Unknown';
  if (animal.test(ingredients)) return 'Non-Vegetarian';
  if (dairyEgg.test(ingredients)) return 'Vegetarian';
  return 'Vegan';
}
export async function loadFullMeals(previews) {
  // TheMealDB area-filter response has no ingredient information; fetch details in small batches.
  const full = [];
  for (let i=0; i<previews.length; i+=6) {
    const batch = await Promise.all(previews.slice(i,i+6).map(async p => {
      try { return await getMealById(p.idMeal) || p; } catch { return p; }
    }));
    full.push(...batch);
  }
  return full;
}
export async function searchAsianMeals(term) {
  const meals = await searchMeals(term);
  return meals.filter(m => CUISINES.some(c => c.name.toLowerCase() === (m.strArea || '').toLowerCase()));
}
