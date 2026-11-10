import RecipePhoto from "../components/RecipePhoto";
import {useEffect,useState} from "react";
import {ArrowLeft,Clock3,MapPin} from "lucide-react";
import {Link,useParams} from "react-router-dom";
import {getLocalRecipe,fetchPublicRecipe} from "../services/recipeRepository";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
export default function RecipeDetails(){
 const {id}=useParams();const [meal,setMeal]=useState(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');setMeal(null);
 const local=getLocalRecipe(id);
 const task=local?Promise.resolve(local):id.startsWith('dummy-')?fetchPublicRecipe(id.slice(6),controller.signal):Promise.resolve(null);
 task.then(data=>{if(!controller.signal.aborted)setMeal(data)}).catch(e=>{if(!controller.signal.aborted)setError(e.message)}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});
 return ()=>controller.abort();},[id]);
 if(loading)return <LoadingSpinner label="Getting the recipe ready..."/>;
 if(error)return <div className="container section-space"><div className="alert alert-warning">{error}</div></div>;
 if(!meal)return <div className="container section-space"><EmptyState title="Recipe not found"/></div>;
 const ingredients=meal.ingredients||[];const steps=meal.steps||[];
 return <section className="section-space"><div className="container"><Link to="/explore" className="back-link"><ArrowLeft size={17}/> Back to explore</Link>
 <div className="recipe-detail-hero row g-5 align-items-center"><div className="col-lg-6"><RecipePhoto className="detail-image" recipe={meal} loading="eager"/></div><div className="col-lg-6"><span className="eyebrow">{meal.strCategory||'A CRAVEIT RECIPE'}</span><h1 className="detail-title">{meal.strMeal}</h1><p className="detail-description">Gather your ingredients and cook something wonderful.</p><div className="detail-meta"><span><MapPin size={16}/>{meal.strArea}</span>{meal.readyInMinutes>0&&<span><Clock3 size={16}/>{meal.readyInMinutes} minutes</span>}{meal.servings>0&&<span>{meal.servings} servings</span>}</div></div></div>
 <div className="row g-5 mt-4"><div className="col-lg-5"><div className="detail-panel"><span className="eyebrow">WHAT YOU'LL NEED</span><h2>Ingredients</h2><ul className="ingredient-list">{ingredients.map((item,i)=><li key={i}><span>{item.ingredient}</span><strong>{item.measure||'To taste'}</strong></li>)}</ul></div></div><div className="col-lg-7"><div className="detail-panel"><span className="eyebrow">LET'S GET COOKING</span><h2>Instructions</h2><div className="instructions">{steps.length?steps.map((step,i)=><p key={i}><span>{String(i+1).padStart(2,'0')}</span>{step}</p>):<p>Instructions unavailable.</p>}</div></div></div></div>
 </div></section>;
}
