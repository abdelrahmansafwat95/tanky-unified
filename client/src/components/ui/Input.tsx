interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; }
export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600 font-medium">{label}</label>
      <input className={`border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition ${className}`} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
