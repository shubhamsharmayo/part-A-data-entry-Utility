import React from 'react';

const PageNotFound = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md w-full">
        <h1 className="text-7xl md:text-9xl font-bold text-red-600 dark:text-red-400 leading-none mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 text-gray-700 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            ← Go Back
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Go Home
          </a>
        </div>
        <p className="mt-10 text-sm text-gray-500 dark:text-gray-500">
          If you think this is an error,{' '}
          <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
            contact support
          </a>
        </p>
      </div>
    </main>
  );
};

export default PageNotFound;