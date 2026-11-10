# CraveIt – Asian Cuisine Explorer (MCA assignment)

## Run
```bash
npm install
npm run dev
```
Open http://localhost:5175. No API key needed.

## Assignment requirements
- React, JSX, components and props: `src/pages` and `src/components`
- State and event handling: `Explore.jsx`, `RecipeCard.jsx`, `FavoritesContext.jsx`
- Public REST API: `GET https://dummyjson.com/recipes?limit=0` in `src/services/recipeRepository.js`; live Asian recipes are shown in Explore under **All** and marked LIVE PUBLIC API. Recipe detail uses `GET /recipes/:id`.
- Bootstrap 5: imported in `src/main.jsx` and used for layout, grids, buttons.
- Local curated recipes: `src/data/asianRecipes.json` ensure Indian and Korean options remain available when the public API fails.
- Favourites persist via localStorage.

## Limitations
- Local recipes are original simplified educational recipes, not an exhaustive collection. Check ingredients for dietary needs.
- DummyJSON is a demo API and can change or become unavailable; local recipes remain available.
- Public API recipes without verified dietary labels are shown only in All, to avoid unsafe classification.
- Recipe photos use external Unsplash URLs and require an internet connection; illustrative images may not match the exact dish.
- Old favourites from the previous TheMealDB/Spoonacular version may contain incompatible IDs; remove and re-save them.

## Expanded curated recipe collection

The Explore page now contains **80 local recipes: 10 each** for Indian, Korean,
Japanese, Chinese, Thai, Vietnamese, Malaysian and Filipino cuisines, in addition
to any live DummyJSON recipes. Each local recipe has ingredients and cooking steps.

**Image note:** Three original recipes use locally stored food photographs. The
other 77 use *distinct, labeled illustrated previews*, not food photographs. These
previews avoid inaccurate repeated photos and work offline. Replace them with
licensed, dish-specific photographs if photographic coverage is required.

**Diet note:** Dietary classifications are provisional ingredient-based estimates;
check sauces, broths, garnishes and packaging before relying on a vegetarian or
vegan label. Recipes are educational examples; adjust seasoning and cooking time
as needed, and follow food safety guidance.
