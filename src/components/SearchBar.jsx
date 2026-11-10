import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search recipes, ingredients..." }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <Search size={20} className="search-icon" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label="Search recipes" />
      {value && <button type="button" className="clear-search" onClick={() => onChange("")} aria-label="Clear search"><X size={17} /></button>}
      <button type="submit" className="btn btn-brand search-submit">Search</button>
    </form>
  );
}
