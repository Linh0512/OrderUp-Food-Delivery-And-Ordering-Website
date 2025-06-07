import { faList, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomIconButtonSelect() {
  const navigate = useNavigate();
  // State to manage the visibility of the dropdown options
  const [isOpen, setIsOpen] = useState(false);
  // Ref to detect clicks outside the dropdown, closing it
  const selectRef = useRef(null);
  // Define the options for the select dropdown
  const options = [
    { label: "Profile", value: "profile" },
    { label: "History", value: "history" },
  ];

  const handleMove=(value)=>{
    navigate(`/${value}`)
    setIsOpen(false)
  }

  // Effect to handle clicks outside the component to close the dropdown
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
          flex items-center space-x-2 border rounded-2xl p-4 
          ${isOpen ? "bg-black/20" : "hover:bg-black/20"}
          transition-colors duration-200
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faList} />
        <FontAwesomeIcon icon={faUser} />

        {/* <FontAwesomeIcon icon={faAngleDown} className={`transition-transform duration-200 ${isOpen?'rotate-180':''}`}/> */}
      </button>

      {/* Dropdown options list */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-20 min-w-[150px]">
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 text-lg cursor-pointer hover:bg-blue-100 transition-colors duration-150 rounded-xl"
              onClick={() => handleMove(option.value)}
            >
              <p>{option.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
