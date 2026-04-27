interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'outline' | 'danger'; loading?: boolean; }
export default function Button({ children, variant = 'primary', loading, className = '', ...props }: ButtonProps) {
  const v = { primary: 'bg-green-600 text-white hover:bg-green-700', outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50', danger: 'bg-red-500 text-white hover:bg-red-600' };
  return <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 cursor-pointer ${v[variant]} ${className}`} disabled={loading} {...props}>{loading ? 'Loading...' : children}</button>;
}
