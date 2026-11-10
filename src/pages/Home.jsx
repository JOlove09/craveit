import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RecipeGrid from '../components/RecipeGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import CuisineList from '../components/CuisineList';
import { curatedRecipes } from '../services/recipeRepository';

export default function Home() {
  const [query,setQuery]=useState('');
  const [meals,setMeals]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const navigate=useNavigate();
  useEffect(()=>{
    let alive=true;
    Promise.resolve(curatedRecipes.filter(r=>['Indian','Japanese','Korean','Thai'].includes(r.strArea)).slice(0,9))
      .then(items=>{if(alive) setMeals(items);})
      .catch(()=>{if(alive)setError('Recipes could not load. Check your connection.');})
      .finally(()=>{if(alive)setLoading(false);});
    return ()=>{alive=false;};
  },[]);
  function handleSearch(e){e.preventDefault();navigate(query.trim()?`/explore?q=${encodeURIComponent(query.trim())}`:'/explore');}
  return <>
    <section className="hero-section"><div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
      <div className="container hero-content"><div className="row align-items-center g-5"><div className="col-lg-6">
        <div className="hero-kicker"><Sparkles size={15}/> A JOURNEY THROUGH ASIAN FLAVOURS</div>
        <h1>Good food.<br/><em>Great moods.</em></h1>
        <p className="hero-copy">From Indian comfort food to Japanese favourites and Thai delights — explore a world of Asian recipes, your way.</p>
        <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch}/>
        <div className="hero-actions"><Link to="/explore" className="btn btn-brand btn-lg">Explore Asia <ArrowRight size={17}/></Link><Link to="/explore?area=Indian&diet=Vegetarian" className="btn btn-outline-light btn-lg">Vegetarian picks 🌿</Link></div>
        <div className="hero-caption">Explore countries · Choose your diet · Cook something lovely</div>
      </div><div className="col-lg-6"><div className="hero-image-frame">
        <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1100&auto=format&fit=crop&q=85" alt="Colourful Asian-inspired meal"/>
        <div className="floating-note"><span>♡</span><div><strong>Made with love</strong><small>One recipe at a time</small></div></div><div className="hero-sticker">LET'S<br/>EAT!</div>
      </div></div></div></div>
    </section>
    <section className="section-space"><div className="container"><div className="section-heading"><div><span className="eyebrow">YOUR FOOD PASSPORT</span><h2>Where shall we eat today?</h2><p>Pick a country to discover its flavours.</p></div><Link to="/explore" className="text-link">Explore all <ArrowRight size={16}/></Link></div><CuisineList selected="" onSelect={name=>navigate(`/explore?area=${encodeURIComponent(name)}`)}/></div></section>
    <section className="section-space featured-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">FROM ASIAN KITCHENS</span><h2>Recipes to discover</h2><p>Fresh inspiration from India, Japan and Thailand.</p></div><Link to="/explore" className="text-link">See more <ArrowRight size={16}/></Link></div>{loading?<LoadingSpinner/>:error?<div className="alert alert-warning">{error}</div>:<RecipeGrid recipes={meals}/>}</div></section>
  </>;
}
