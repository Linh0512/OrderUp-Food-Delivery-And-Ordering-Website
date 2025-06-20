import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

export default function CustomSelect({ options,selected,handleChange }) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

    useEffect(() => {
    if (selected) {
      const index = options.findIndex(option => option.value === selected);
      setSelectedOption(index >= 0 ? index : 0);
    } 
  }, [selected, options]);

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
    <div className="relative w-max font-inter ease-in-out" ref={selectRef}>
      {/* The custom button/trigger for the select */}
      <button
        className={`
              flex items-center space-x-3 rounded p-1 px-3 bg-gray-400
              ${isOpen ? "bg-black/20" : "hover:bg-black/20"}
              transition-colors duration-200
            `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options[selectedOption].name}</span>
        <FontAwesomeIcon icon={faAngleDown} className={`transition-transform duration-200 ${isOpen?'rotate-180':''}`}/>
      </button>

      {/* Dropdown options list */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-20 min-w-[150px]">
          {options.map((option,index) => (
            <div
              key={index}
              className="p-2 text-lg cursor-pointer hover:bg-blue-100 transition-colors duration-150 rounded"
              onClick={() => {
                setSelectedOption(index);
                setIsOpen(false); 
                handleChange(option.value)
              }}
            >
              <p>{option.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
