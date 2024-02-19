import React, { useRef, useState } from "react";
import axios from "axios";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const CustomFileInput = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isMalware, setIsMalware] = useState<boolean | null>(null); // Track prediction result

  const handleClick = () => {
    ref.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files ?? []);
    setSelectedFiles(files);

    if (files.length) {
      // Send the first selected file to the backend
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("/predict", formData);
        const { is_malware } = response.data;
        setIsMalware(is_malware); // Update state with prediction result
      } catch (error) {
        console.error("Error sending file:", error);
        // Handle errors gracefully in UI (e.g., display error message)
        setIsMalware(null); // Reset prediction state
      }
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="p-40 flex flex-col items-center gap-2 bg-gray-50 text-blue-700 rounded-lg outline-dashed outline-1 outline-gray-300 hover:bg-gray-100 cursor-pointer"
      >
        <CloudArrowUpIcon className="w-10 h-10" />
        <span>Choose a file to upload</span>
        <input
          type="file"
          ref={ref}
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {!!selectedFiles.length && (
        <div className="p-4 mt-4 bg-gray-50 rounded overflow-hidden text-ellipsis">
          <p>Selected File:</p>
          {selectedFiles.map((file, i) => (
            <span key={i} className="text-blue-700 whitespace-nowrap">
              {file.name}
            </span>
          ))}
        </div>
      )}

      {/* Display prediction result if available */}
      {isMalware !== null && (
        <div className="p-4 mt-4 bg-gray-50 rounded overflow-hidden text-ellipsis">
          <p>Prediction:</p>
          <span className={isMalware ? "text-red-500" : "text-green-500"}>
            {isMalware ? "Malware" : "Not Malware"}
          </span>
        </div>
      )}
    </div>
  );
};

export default CustomFileInput;
