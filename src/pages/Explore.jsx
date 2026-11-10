import {useEffect,useMemo,useState} from "react";
import {useSearchParams} from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CuisineList from "../components/CuisineList";
import DietFilters from "../components/DietFilters";
import RecipeGrid from "../components/RecipeGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import {curatedRecipes,fetchPublicRecipes,matchesDiet} from "../services/recipeRepository";
export default function Explore(){
 const [params,setParams]=useSearchParams(); const area=params.get('area')||'Indian';const diet=params.get('diet')||'All';const q=params.get('q')||'';
 const [searchInput,setSearchInput]=useState(q);const [live,setLive]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>setSearchInput(q),[q]);
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');fetchPublicRecipes(controller.signal).then(setLive).catch(e=>{if(e.name!=='AbortError')setError('Live API recipes are temporarily unavailable. Your curated recipes are still ready to explore.');}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});return ()=>controller.abort()},[]);
 const results=useMemo(()=>[...curatedRecipes,...live].filter(r=>(q?r.strMeal.toLowerCase().includes(q.toLowerCase()):r.strArea.toLowerCase()===area.toLowerCase())&&matchesDiet(r,diet)),[area,q,diet,live]);
 function chooseArea(name){setSearchInput('');setParams({area:name,...(diet!=='All'?{diet}:{})})}
 function submitSearch(e){e.preventDefault();setParams({...((searchInput.trim())?{q:searchInput.trim()}:{area}),...(diet!=='All'?{diet}:{})})}
 function changeDiet(value){const next=new URLSearchParams(params);if(value==='All')next.delete('diet');else next.set('diet',value);setParams(next)}
 return <section className="section-space"><div className="container">
 <div className="page-intro"><span className="eyebrow">A TASTE OF ASIA</span><h1>Explore Asian <em>flavours.</em></h1><p>Travel through Asian kitchens, one delicious recipe at a time.</p></div>
 <div className="explore-toolbar"><SearchBar value={searchInput} onChange={setSearchInput} onSubmit={submitSearch}/><div className="filter-label">CHOOSE A CUISINE</div><CuisineList selected={q?'':area} onSelect={chooseArea}/><div className="filter-label mt-4">DIETARY PREFERENCE</div><DietFilters value={diet} onChange={changeDiet}/><p className="diet-note">Dietary filters apply to curated recipes with reviewed ingredient lists. Public API recipes without verified dietary information appear under All only.</p></div>
 <div className="results-heading"><h2>{q?`Search: “${q}”`:`${area} recipes`}</h2><span>{results.length} recipes</span></div>
 {error&&<div className="alert alert-info" role="status">{error}</div>}
 {loading&&<LoadingSpinner label="Checking the public recipe API..."/>}
 {results.length?<RecipeGrid recipes={results}/>:!loading&&<div className="empty-state"><h3>No matching recipes</h3><p>Try a different cuisine, search term or dietary preference.</p><button className="btn btn-brand" onClick={()=>setParams({area:'Indian'})}>Reset filters</button></div>}
 </div></section>;
}
