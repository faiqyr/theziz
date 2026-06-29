"use client";

import React, { useState } from "react";

export default function ResearchDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus("Uploading...");

    // Simulate API Call to FastAPI Backend
    // const formData = new FormData();
    // formData.append("file", file);
    // const res = await fetch("http://localhost:8000/api/v1/documents/upload", {
    //   method: "POST",
    //   body: formData,
    // });
    // const data = await res.json();
    
    setTimeout(() => {
      setUploadStatus("Upload complete. Processing document...");
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight">Theziz Research Assistant</h1>
      <p className="text-muted-foreground text-lg">
        Upload academic papers, chat with RAG, and compare model evaluations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Document Upload Section */}
        <div className="border rounded-xl p-6 bg-card shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>
          <div className="space-y-4">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button 
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              disabled={!file}
            >
              Upload PDF
            </button>
            {uploadStatus && <p className="text-sm text-green-600 mt-2">{uploadStatus}</p>}
          </div>
        </div>

        {/* Model Performance Metrics */}
        <div className="border rounded-xl p-6 bg-card shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Model Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Faithfulness</span>
              <span className="text-blue-600">92%</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Context Precision</span>
              <span className="text-blue-600">88%</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Answer Relevancy</span>
              <span className="text-blue-600">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Avg Latency</span>
              <span className="text-blue-600">1.2s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section Placeholder */}
      <div className="border rounded-xl p-6 bg-card shadow-sm h-96 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Chat with Papers</h2>
        <div className="flex-1 bg-gray-50 rounded-md p-4 mb-4 flex items-center justify-center text-gray-400">
          Chat interface will appear here after document upload...
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask a question about the document..." 
            className="flex-1 border rounded-md px-4 py-2"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
