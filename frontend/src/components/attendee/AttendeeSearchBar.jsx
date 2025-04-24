import React from 'react';

const AttendeeSearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="mb-6 text-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Search for Events to Book</h3>
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="Search for Events with name or ID"
          className="p-2 border rounded-md w-full max-w-md mr-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={onSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default AttendeeSearchBar;
