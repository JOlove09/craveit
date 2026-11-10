/**
 * Optional, browser-side Commons photo lookup for curated recipes.
 * Existing downloaded photographs always take priority. Commons results are
 * suggestions, not guaranteed depictions; see PHOTO_REVIEW.md.
 */
const API = 'https://commons.wikimedia.org/w/api.php';
const cache = new Map();
const pending = new Map();
const ALLOWED = ['cc0', 'cc by', 'cc-by', 'public domain', 'pd-'];
const IGNORE = new Set(['vegetable','chicken','rice','noodles','soup','fried','fresh','with','and','the','balls','bowl']);
const words = value => (value.toLowerCase().match(/[a-z]+/g) || []).filter(w => !IGNORE.has(w));
const clean = value => (value || '').replace(/<[^>]*>/g,'').replace(/&[^;]+;/g,' ').trim();
const storedKey = meal => `craveit-commons-v2:${meal}`;
const hasLocalPhoto = recipe => /\.(webp|jpe?g|png)$/i.test(recipe.strMealThumb || '') || (recipe.strMealThumb || '').includes('commons.wikimedia.org/wiki/Special:Redirect/file/');
export function initialPhoto(recipe) { return recipe.strMealThumb; }
export async function findRecipePhoto(recipe) {
  if (hasLocalPhoto(recipe) || !recipe?.strMeal) return null;
  const name = recipe.strMeal;
  if (cache.has(name)) return cache.get(name);
  if (pending.has(name)) return pending.get(name);
  try {
    const saved = JSON.parse(sessionStorage.getItem(storedKey(name)) || 'null');
    if (saved?.url && saved?.source) { cache.set(name, saved); return saved; }
  } catch { /* private browsing can block storage */ }
  const task = (async () => {
    const terms = words(name);
    if (!terms.length) return null;
    const params = new URLSearchParams({action:'query',format:'json',origin:'*',generator:'search',
      gsrsearch:`filetype:bitmap ${name}`,gsrnamespace:'6',gsrlimit:'20',prop:'imageinfo',
      iiprop:'url|extmetadata|size',iiurlwidth:'1000'});
    const response = await fetch(`${API}?${params}`);
    if (!response.ok) return null;
    const json = await response.json();
    const matches = Object.values(json?.query?.pages || {}).map(page => {
      const info = page.imageinfo?.[0];
      const license = clean(info?.extmetadata?.LicenseShortName?.value).toLowerCase();
      const title = page.title?.replace(/^File:/,'').replace(/[_-]/g,' ') || '';
      const titleWords = new Set(words(title));
      const overlap = terms.filter(term => titleWords.has(term)).length;
      const score = overlap * 10 + (title.toLowerCase().includes(name.toLowerCase()) ? 20 : 0);
      return {score,info,title,license};
    }).filter(x => x.info?.thumburl && x.info?.width >= 450 &&
      ALLOWED.some(allowed => x.license.includes(allowed)) && x.score >= 10)
      .sort((a,b)=>b.score-a.score);
    if (!matches.length) return null;
    const best = matches[0];
    const photo = {url:best.info.thumburl,source:best.info.descriptionurl,
      license:best.license,title:best.title};
    cache.set(name,photo);
    try { sessionStorage.setItem(storedKey(name),JSON.stringify(photo)); } catch { /* optional */ }
    return photo;
  })().catch(()=>null).finally(()=>pending.delete(name));
  pending.set(name,task);
  return task;
}
