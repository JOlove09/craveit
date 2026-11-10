import { CUISINES } from '../services/asianCuisine';
export default function CuisineList({ selected, onSelect }) {
  return <div className="cuisine-grid" aria-label="Choose Asian cuisine">
    {CUISINES.map(c => <button type="button" key={c.name} className={`cuisine-tile ${selected===c.name?'selected':''}`} onClick={()=>onSelect(c.name)} aria-pressed={selected===c.name}>
      <span className="cuisine-flag" aria-hidden="true">{c.flag}</span><strong>{c.name}</strong><small>{c.subtitle}</small>
    </button>)}
  </div>;
}
