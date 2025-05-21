export const getVIPStatusColor = (status: string) => {
	switch (status?.toLowerCase()) {
		case 'platinum':
			return 'bg-purple-100 text-purple-800';
		case 'gold':
			return 'bg-yellow-100 text-yellow-800';
		case 'silver':
			return 'bg-gray-100 text-gray-800';
		case 'bronze':
			return 'bg-orange-100 text-orange-800';
		case 'diamond':
			return 'bg-blue-100 text-blue-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
};
