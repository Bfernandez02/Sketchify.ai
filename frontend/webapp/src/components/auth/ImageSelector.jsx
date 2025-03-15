import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";

function ImageSelector({ type, setFormData, image }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [] },
    onDrop: (files) => {
      console.log(files);
      const newImgs = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      if (type === "profile") {
        setFormData((prev) => ({
          ...prev,
          profile: newImgs[0],
        }));
      } else if (type === "banner") {
        setFormData((prev) => ({
          ...prev,
          banner: newImgs[0],
        }));
      }
    },
  });

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.preview);
    };
  }, [image]);

  const removeImage = () => {
    if (type === "profile") {
      setFormData((prev) => ({
        ...prev,
        profile: null,
      }));
    } else if (type === "banner") {
      setFormData((prev) => ({
        ...prev,
        banner: null,
      }));
    }
  };

  return (
    <section className="flex flex-col gap-4 p-1 md:w-[450px]">
      <div
        {...getRootProps()}
        className={`relative flex p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-all 
               items-center justify-center ${
                 type === "profile"
                   ? "h-[120px] w-[200px] rounded-full"
                   : "h-[120px] w-full rounded-full"
               }`}
      >
        <input {...getInputProps()} />
        {image ? ( 
          <div className="flex justify-center relative">
            {type === "profile" ? (
              <img
                src={image.preview}
                alt="image"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <img
                src={image.preview}
                alt="image"
                style={{ width: "100%", height: "100px", objectFit: "cover" }}
              />
            )}

            {/* Delete button for each image */}

            <button
              onClick={() => removeImage()}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-[5px] text-xs px-[5px] py-[1.2px] "
            >
              X
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center justify-center">
            <i className="fa-regular fa-image fa-2x"></i>
            <p className="text-gray-500 text-[14px]">
              Drag-drop or click here to select a {type} image
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ImageSelector;
