import {
  faPlus,
  faTrash,
  faX
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const OptionsManager = ({ isEditing }) => {
  const [options, setOptions] = useState([
    {
      id: 1,
      name: "Màu sắc",
      choices: [
        { id: 1, value: "Đỏ" },
        { id: 2, value: "Xanh" },
        { id: 3, value: "Vàng" },
      ],
    },
    {
      id: 2,
      name: "Kích thước",
      choices: [
        { id: 1, value: "S" },
        { id: 2, value: "M" },
        { id: 3, value: "L" },
        { id: 4, value: "XL" },
      ],
    },
  ]);

  // Thêm option mới
  const addOption = () => {
    const newOption = {
      id: Date.now(),
      name: "",
      choices: [],
    };
    setOptions([...options, newOption]);
  };

  // Xóa option
  const removeOption = (optionId) => {
    setOptions(options.filter((option) => option.id !== optionId));
  };

  // Cập nhật tên option
  const updateOptionName = (optionId, newName) => {
    setOptions(
      options.map((option) =>
        option.id === optionId ? { ...option, name: newName } : option
      )
    );
  };

  // Thêm choice cho option
  const addChoice = (optionId) => {
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              choices: [...option.choices, { id: Date.now(), value: "" }],
            }
          : option
      )
    );
  };

  // Xóa choice
  const removeChoice = (optionId, choiceId) => {
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              choices: option.choices.filter(
                (choice) => choice.id !== choiceId
              ),
            }
          : option
      )
    );
  };

  // Cập nhật choice value
  const updateChoiceValue = (optionId, choiceId, newValue) => {
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              choices: option.choices.map((choice) =>
                choice.id === choiceId ? { ...choice, value: newValue } : choice
              ),
            }
          : option
      )
    );
  };

  const EditView = () => (
    <div className="space-y-6">
      {options.map((option) => (
        <div
          key={option.id}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          {/* Option Header */}
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={option.name}
              onChange={(e) => updateOptionName(option.id, e.target.value)}
              placeholder="Tên lựa chọn (VD: Màu sắc, Kích thước...)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => removeOption(option.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Xóa option"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>

          {/* Choices */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Các lựa chọn:
            </label>
            {option.choices.map((choice) => (
              <div key={choice.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={choice.value}
                  onChange={(e) =>
                    updateChoiceValue(option.id, choice.id, e.target.value)
                  }
                  placeholder="Nhập lựa chọn..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeChoice(option.id, choice.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Xóa lựa chọn"
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addChoice(option.id)}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Thêm lựa chọn</span>
            </button>
          </div>
        </div>
      ))}

      {/* Add Option Button */}
      <button
        onClick={addOption}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <FontAwesomeIcon icon={faPlus} />
        <span>Thêm option mới</span>
      </button>
    </div>
  );

  const ViewMode = () => (
    <div className="space-y-4">
      {options.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Chưa có lựa chọn nào. Bấm "Chỉnh sửa" để thêm.
        </div>
      ) : (
        options.map((option) => (
          <div
            key={option.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <h4 className="font-medium text-gray-800 mb-2">
              {option.name || "Chưa đặt tên"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {option.choices.length === 0 ? (
                <span className="text-gray-400 text-sm">Chưa có lựa chọn</span>
              ) : (
                option.choices.map((choice) => (
                  <span
                    key={choice.id}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {choice.value || "Trống"}
                  </span>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <div className="flex space-x-4 mb-6">
        <label className="font-medium text-gray-700 w-30">Các lựa chọn:</label>
        {isEditing ? <EditView /> : <ViewMode />}
      </div>
    </div>
  );
};

export default OptionsManager;
