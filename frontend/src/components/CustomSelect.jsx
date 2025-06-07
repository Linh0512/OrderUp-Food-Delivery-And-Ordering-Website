import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

export default function CustomSelect({ options,head }) {
    const [selectedOption, setSelectedOption] = useState(head);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative w-max font-inter" ref={selectRef}>
      {/* The custom button/trigger for the select */}
      <button
        className={`
              flex items-center space-x-3 border rounded-2xl p-3 px-5 
              ${isOpen ? "bg-black/20" : "hover:bg-black/20"}
              transition-colors duration-200
            `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption}</span>
        <FontAwesomeIcon icon={faAngleDown} className={`transition-transform duration-200 ${isOpen?'rotate-180':''}`}/>
      </button>

      {/* Dropdown options list */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-20 min-w-[150px]">
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 text-lg cursor-pointer hover:bg-blue-100 transition-colors duration-150 rounded"
              onClick={() => {
                setSelectedOption(option.label);
                setIsOpen(false);
              }}
            >
              <p>{option.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
