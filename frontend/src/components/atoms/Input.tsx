/**
 * Input component
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Input({
  label,
  error,
  helpText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors ${className} ${
          error ? 'border-red-500 focus:border-red-500' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1 text-sm text-slate-500">{helpText}</p>}
    </div>
  );
}
