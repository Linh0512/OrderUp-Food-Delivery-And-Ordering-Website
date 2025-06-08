import React, { useState } from 'react';

export default function Category({header,items}) {

  const [activeCategory, setActiveCategory] = useState(items[0].name);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-2xl shadow-xl font-inter caret-transparent">
      <div className="flex items-center text-lg font-semibold text-gray-800 mb-4">
        <span>{header}</span>
      </div>

      <div className="space-y-3">
        {items.map((category) => (
          <div
            key={category.name} 
            className={`
              flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
              ${activeCategory === category.name
                ? 'bg-green-100 border border-green-500 text-green-700' 
                : 'bg-gray-100 hover:bg-gray-200 border border-transparent text-gray-700' 
              }
            `}  
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
              <span className="text-base">{category.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}