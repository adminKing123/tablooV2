/**
 * Badge — small status indicator pill.
 *
 * @param {'green'|'red'|'yellow'|'blue'|'slate'} color
 */
const colors = {
  green:  'bg-green-100 text-green-800 ring-green-600/20',
  red:    'bg-red-100 text-red-800 ring-red-600/20',
  yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
  blue:   'bg-indigo-100 text-indigo-800 ring-indigo-600/20',
  slate:  'bg-slate-100 text-slate-700 ring-slate-600/20',
};

export default function Badge({ children, color = 'slate', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
