import React, { useState } from "react";
import { HiOutlineTrash, HiPlusSm } from "react-icons/hi";
import { LuPaperclip } from "react-icons/lu";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedList = attachments.filter((attachment, idx) => index !== idx);
    setAttachments(updatedList);
  };

  return (
    <div>
      {attachments.map((attachment, index) => (
        <div key={index} className="flex justify-between items-center mt-4">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3">
            <LuPaperclip className="text-gray-400" />

            <p className="text-xs text-black">{attachment}</p>
          </div>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-2">
        <div className="flex-1 flex items-center gap-3 px-3 py-2 mb-3">
          <LuPaperclip className="text-gray-400" />

          <input
            className="w-full text-[13px] text-black outline-none bg-white py-2"
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
          />
        </div>

        <button className="card-btn text-nowrap">
          <HiPlusSm className="text-lg" onClick={handleAddOption} />
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
