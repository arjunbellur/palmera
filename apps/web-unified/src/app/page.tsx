import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🌴 Palmera
            </h1>
            <p className="text-gray-600">
              Premium Experiences Platform
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Choose Your Portal
            </h2>
            
            <Link 
              href="/provider/dashboard"
              className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>🏨</span>
                <span>Provider Dashboard</span>
              </div>
              <p className="text-teal-100 text-sm mt-1">
                Manage your experiences & bookings
              </p>
            </Link>

            <Link 
              href="/admin/dashboard"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>⚙️</span>
                <span>Admin Dashboard</span>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                Platform administration & analytics
              </p>
            </Link>

            <div className="pt-4 border-t border-gray-200">
              <Link 
                href="/auth/login"
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
              >
                Sign In →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
