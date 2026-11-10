const OPTIONS = ['All', 'Vegetarian', 'Vegan', 'Non-Vegetarian'];
export default function DietFilters({ value, onChange }) {
  return <div className="diet-filter" aria-label="Dietary preference">
    {OPTIONS.map(option => <button type="button" key={option} className={`category-pill ${value===option?'active':''}`} onClick={()=>onChange(option)} aria-pressed={value===option}>{option}</button>)}
  </div>;
}
