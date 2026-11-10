import {useEffect,useState} from 'react';
import {findRecipePhoto,initialPhoto} from '../services/recipePhotos';
export default function RecipePhoto({recipe,className='',loading='lazy'}) {
  const [src,setSrc] = useState(()=>initialPhoto(recipe));
  useEffect(()=>{
    let active = true;
    setSrc(initialPhoto(recipe));
    findRecipePhoto(recipe).then(photo=>{if(active && photo?.url)setSrc(photo.url)});
    return ()=>{active=false};
  },[recipe.idMeal,recipe.strMeal,recipe.strMealThumb]);
  return <img className={className} src={src} alt={recipe.strMeal} loading={loading}
    onError={()=>{if(src!==recipe.strMealThumb)setSrc(recipe.strMealThumb)}}/>;
}
