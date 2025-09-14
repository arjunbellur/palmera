export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Palmera Admin Console</h1>
        <p className="text-gray-600 mb-8">Welcome to the admin dashboard</p>
        <a 
          href="/dashboard" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
