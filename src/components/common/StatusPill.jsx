const statusConfig = {
  'submitted': { bg: 'bg-blue-500/15 border-blue-500/30', text: 'text-blue-600 dark:text-blue-400', label: 'Submitted' },
  'under-review': { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-700 dark:text-amber-300', label: 'Under Review' },
  'sanctioned': { bg: 'bg-green-500/15 border-green-500/30', text: 'text-green-700 dark:text-green-300', label: 'Sanctioned' },
  'disbursed': { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-700 dark:text-emerald-300', label: 'Disbursed' },
  'deficiency': { bg: 'bg-red-500/15 border-red-500/30', text: 'text-red-600 dark:text-red-400', label: 'Deficiency' },
  'rejected': { bg: 'bg-red-500/15 border-red-500/30', text: 'text-red-600 dark:text-red-400', label: 'Rejected' },
  'pending': { bg: 'bg-gray-500/15 border-gray-500/30', text: 'text-gray-600 dark:text-gray-400', label: 'Pending' },
  'completed': { bg: 'bg-green-500/15 border-green-500/30', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  'current': { bg: 'bg-saffron/15 border-saffron/30', text: 'text-saffron-dark dark:text-saffron-light', dot: 'bg-saffron' },
};

export default function StatusPill({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig['pending'];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold border ${config.bg} ${config.text} ${sizeClasses}`}>
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label || status}
    </span>
  );
}
