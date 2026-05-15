export function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-ink-soft">{label}</label>
      {children}
    </div>
  );
}
