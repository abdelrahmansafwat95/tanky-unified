const colors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  rejected:  'bg-red-100 text-red-700',
  expired:   'bg-gray-100 text-gray-500',
  active:    'bg-green-100 text-green-700',
  inactive:  'bg-gray-100 text-gray-400',
};
export default function Badge({ status }: { status: string }) {
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] ?? 'bg-gray-100 text-gray-500'}`}>{status}</span>;
}
