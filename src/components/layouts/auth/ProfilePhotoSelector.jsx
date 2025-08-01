import React, { useRef, useState } from "react";
import { LuTrash, LuUpload, LuUser } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // generate preview URL to preview it before uploading to database
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        className="hidden"
        type="file"
        id="profilePicture"
        ref={imageRef}
        onChange={(e) => handleImageChange(e)}
      />

      {!image ? (
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-100/50 relative cursor-pointer">
          <LuUser className="text-4xl text-primary" />

          <button
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-3 cursor-pointer outline-none "
            type="button"
            onClick={() => {
              imageRef.current.click();
            }}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer outline-none"
            type="button"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
