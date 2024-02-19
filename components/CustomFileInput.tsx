"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const CustomFileInput = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);

  const cuckooUrl = "http://ip:8090"; // Replace with your Cuckoo Sandbox URL

  const handleClick = () => {
    ref.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] || null;
    setSelectedFile(file);
  };

  const uploadFileAndRunAnalysis = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        // Upload the file to create a new analysis task
        const response = await axios.post(
          `${cuckooUrl}/tasks/create/file`,
          formData
        );

        if (response.status === 200) {
          const taskId = response.data.task_id;

          // Poll for task status until it's completed or reported
          let status = "";
          do {
            await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait for 30 seconds before checking again
            const statusResponse = await axios.get(
              `${cuckooUrl}/tasks/view/${taskId}`
            );
            status = statusResponse.data.task.status;
            setTaskStatus(status);
          } while (status === "pending" || status === "running");

          // Fetch and set the analysis report
          const reportResponse = await axios.get(
            `${cuckooUrl}/tasks/report/${taskId}`
          );
          setReport(JSON.stringify(reportResponse.data));
        }
      } catch (error) {
        console.error("Error uploading file and running analysis:", error);
      }
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="px-96 py-40 flex flex-col items-center justify-center mx-auto bg-gray-50 text-blue-700 rounded-lg outline-dashed outline-2 outline-gray-300 hover:bg-gray-100 cursor-pointer"
>
        <CloudArrowUpIcon className="w-10 h-10" />
        <span>Choose a file to upload and analyze</span>
        <input
          type="file"
          ref={ref}
          className="hidden"
          onChange={handleChange}
          // multiple
        />
      </div>

      {!!selectedFile && (
        <div className="p-4 mt-4 mb-4 bg-gray-50 rounded overflow-hidden text-ellipsis">
          <p className=" font-semibold">Selected File:</p>
          <div className="grid grid-flow-row auto-rows-max">
            <span className="text-blue-700 whitespace-nowrap">
              {selectedFile.name}
            </span>
            <button
              onClick={uploadFileAndRunAnalysis}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Analyze File
            </button>
          </div>
        </div>
      )}

      {!!taskStatus && (
        <div className="p-4 mt-4  mb-4 bg-gray-50 rounded overflow-hidden text-ellipsis">
          <p>Task Status:</p>
          <span className="text-blue-700 whitespace-nowrap">{taskStatus}</span>
        </div>
      )}

      {!!report && (
        <div className="p-4 mt-4 mb-4 bg-gray-50 rounded overflow-hidden text-ellipsis">
          <p>Analysis Report:</p>
          <pre className="text-blue-700 whitespace-pre-wrap">{report}</pre>
        </div>
      )}
    </div>
  );
};

export default CustomFileInput;
