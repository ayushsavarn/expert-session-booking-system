import { Link } from 'react-router-dom';

const ExpertCard = ({ expert }) => {
  const categoryColors = {
    Career: 'bg-blue-100 text-blue-800',
    Design: 'bg-pink-100 text-pink-800',
    Finance: 'bg-green-100 text-green-800',
    Fitness: 'bg-red-100 text-red-800',
    HR: 'bg-yellow-100 text-yellow-800',
    Legal: 'bg-gray-100 text-gray-800',
    Marketing: 'bg-orange-100 text-orange-800',
    'Mental Health': 'bg-teal-100 text-teal-800',
    Startup: 'bg-purple-100 text-purple-800',
    Tech: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {expert.name}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                categoryColors[expert.category] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {expert.category}
            </span>
          </div>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <svg
              className="w-4 h-4 text-yellow-500 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-yellow-700">
              {expert.rating?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {expert.bio}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {expert.experience} years
            </span>{' '}
            experience
          </div>
          <Link
            to={`/expert/${expert._id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium cursor-pointer"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;