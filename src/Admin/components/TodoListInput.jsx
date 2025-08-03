import React, { useState } from "react";
import { HiOutlineTrash, HiPlusSm } from "react-icons/hi";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedList = todoList.filter((todo, idx) => index !== idx);
    setTodoList(updatedList);
  };

  return (
    <div>
      {todoList.map((todo, index) => (
        <div
          key={index}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-xs text-gray-400 font-semibold mr-2">{todo}</p>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <input
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
        />

        <button className="card-btn text-nowrap">
          <HiPlusSm className="text-lg" onClick={handleAddOption} />
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
