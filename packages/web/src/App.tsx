import { Routes, Route } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎼</span>
            <h1 className="text-3xl font-bold text-gray-900">
              DevPattern Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Welcome to DevPattern
              </h2>
              <p className="text-gray-500 mb-6">
                Your projects will appear here once connected.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">📁</div>
                  <h3 className="font-medium text-gray-800">Projects</h3>
                  <p className="text-sm text-gray-500">Discover & manage</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="font-medium text-gray-800">Documents</h3>
                  <p className="text-sm text-gray-500">View & edit markdown</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-medium text-gray-800">Tracks</h3>
                  <p className="text-sm text-gray-500">Monitor progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
