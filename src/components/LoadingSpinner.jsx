export default function LoadingSpinner({ label = "Finding something delicious..." }) {
  return (
    <div className="loading-state" role="status">
      <div className="spinner-border text-brand" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
