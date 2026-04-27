"use client";

interface StatusIndicatorProps {
  status: string;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          color: 'green',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-400',
          label: 'Paid',
          pulse: false
        };
      case 'pending':
        return {
          color: 'yellow',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-400',
          label: 'Pending',
          pulse: true
        };
      case 'failed':
        return {
          color: 'red',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-400',
          label: 'Failed',
          pulse: false
        };
      case 'cancelled':
        return {
          color: 'gray',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-400',
          label: 'Cancelled',
          pulse: false
        };
      default:
        return {
          color: 'blue',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-400',
          label: status,
          pulse: false
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.bgColor} ${config.textColor} text-xs font-medium uppercase tracking-widest rounded-full border ${config.borderColor}`}>
      {config.pulse && <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>}
      {config.label}
    </span>
  );
}
