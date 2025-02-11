
export const getStatusColor = (status: string = 'active') => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
    case 'pending':
      return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
    case 'expired':
      return 'bg-red-50 text-red-700 ring-red-600/20';
    default:
      return 'bg-gray-50 text-gray-700 ring-gray-600/20';
  }
};
