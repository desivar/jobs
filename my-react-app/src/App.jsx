import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State for mock user login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // State for fetched data
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [pipelines, setPipelines] = useState([]);

  // State for loading indicators
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingPipelines, setLoadingPipelines] = useState(false);

  // State for error messages
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorCustomers, setErrorCustomers] = useState(null);
  const [errorJobs, setErrorJobs] = useState(null);
  const [errorPipelines, setErrorPipelines] = useState(null);

  // Base URL for your backend API.
  // IMPORTANT: This is now hardcoded to http://localhost:5500/api.
  // Your Node.js backend MUST be running on port 5500 for this to work.
  const API_BASE_URL = 'http://localhost:5500/api'; 

  // --- Debugging Log: Check isLoggedIn state on every render ---
  // Open your browser's developer console (F12) to see these logs.
  console.log('App component rendered. Current isLoggedIn state:', isLoggedIn);

  // Mock login function
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
      console.log(`User '${username}' logged in (mock).`);
      // --- Debugging Log: Confirm state change immediately after setting ---
      console.log('isLoggedIn set to TRUE. Next render should show dashboard.'); 
    } else {
      console.log('Login failed: Please enter a username.'); 
      // For a proper UI, you'd show an error message in the app, not just console.log.
    }
  };

  // Mock logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    // Clear fetched data on logout to reset the view
    setUsers([]);
    setCustomers([]);
    setJobs([]);
    setPipelines([]);
    console.log('User logged out (mock).');
  };

  // Function to fetch data from the backend
  const fetchData = async (endpoint, setData, setLoading, setError) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        // Provide more detailed error if backend sends non-200 status
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText || 'Unknown Error'}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      setError(`Failed to load data from ${endpoint}: ${error.message}. Ensure your backend is running and accessible at ${API_BASE_URL.split('/api')[0]}.`);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when the user logs in
  useEffect(() => {
    // --- Debugging Log: Check isLoggedIn inside useEffect ---
    console.log('useEffect triggered. isLoggedIn:', isLoggedIn);
    if (isLoggedIn) {
      console.log('isLoggedIn is TRUE, attempting to fetch dashboard data...');
      fetchData('/users', setUsers, setLoadingUsers, setErrorUsers);
      fetchData('/customers', setCustomers, setLoadingCustomers, setErrorCustomers);
      fetchData('/jobs', setJobs, setLoadingJobs, setErrorJobs);
      fetchData('/pipelines', setPipelines, setLoadingPipelines, setErrorPipelines);
    }
  }, [isLoggedIn]); // This effect runs only when isLoggedIn state changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8 font-inter text-gray-800">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-800 drop-shadow-lg animate-fade-in-down">
          Frontend Data Dashboard
        </h1>
        <p className="mt-3 text-lg text-indigo-600 animate-fade-in-up">
          Connecting to your Node.js/Express/MongoDB Backend
        </p>
      </header>

      {/* Login/User Display Section */}
      <section className="bg-white p-8 rounded-2xl shadow-xl mb-10 max-w-2xl mx-auto border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">User Management</h2>
        {/* Conditional rendering: show welcome/logout if logged in, else show login form */}
        {isLoggedIn ? (
          <div className="flex flex-col items-center">
            <p className="text-xl mb-4 text-green-600">
              Welcome back, <span className="font-semibold">{username}</span>!
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full max-w-sm p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login (Mock)
            </button>
          </form>
        )}
      </section>

      {/* Data Display Sections - ONLY RENDERED IF isLoggedIn IS TRUE */}
      {isLoggedIn && ( // This condition controls whether the entire dashboard content is visible
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Users</h2>
            {loadingUsers && <p className="text-center text-indigo-500">Loading users...</p>}
            {errorUsers && <p className="text-center text-red-500">Error: {errorUsers}</p>}
            {!loadingUsers && !errorUsers && users.length === 0 && (
              <p className="text-center text-gray-500">No users found or logged out.</p>
            )}
            <div className="grid grid-cols-1 gap-4">
              {users.map((user, index) => (
                <div key={index} className="bg-indigo-50 p-4 rounded-xl shadow-md border border-indigo-200">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Customers Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Customers</h2>
            {loadingCustomers && <p className="text-center text-indigo-500">Loading customers...</p>}
            {errorCustomers && <p className="text-center text-red-500">Error: {errorCustomers}</p>}
            {!loadingCustomers && !errorCustomers && customers.length === 0 && (
              <p className="text-center text-gray-500">No customers found or logged out.</p>
            )}
            <div className="grid grid-cols-1 gap-4">
              {customers.map((customer, index) => (
                <div key={index} className="bg-purple-50 p-4 rounded-xl shadow-md border border-purple-200">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(customer, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Jobs</h2>
            {loadingJobs && <p className="text-center text-indigo-500">Loading jobs...</p>}
            {errorJobs && <p className="text-center text-red-500">Error: {errorJobs}</p>}
            {!loadingJobs && !errorJobs && jobs.length === 0 && (
              <p className="text-center text-gray-500">No jobs found or logged out.</p>
            )}
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-xl shadow-md border border-blue-200">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(job, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Pipelines Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pipelines</h2>
            {loadingPipelines && <p className="text-center text-indigo-500">Loading pipelines...</p>}
            {errorPipelines && <p className="text-center text-red-500">Error: {errorPipelines}</p>}
            {!loadingPipelines && !errorPipelines && pipelines.length === 0 && (
              <p className="text-center text-gray-500">No pipelines found or logged out.</p>
            )}
            <div className="grid grid-cols-1 gap-4">
              {pipelines.map((pipeline, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-xl shadow-md border border-green-200">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(pipeline, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tailwind CSS and Font Import */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          .animate-fade-in-down {
            animation: fadeInDown 1s ease-out forwards;
            opacity: 0;
            transform: translateY(-20px);
          }
          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
            animation-delay: 0.2s; /* Delay for a staggered effect */
          }
          @keyframes fadeInDown {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default App;
