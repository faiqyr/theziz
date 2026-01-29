'use client';
import { useChat } from 'ai/react';
import { useState } from 'react';

export default function WorkspacePage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/text',
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Editor */}
      <div className="w-1/2 p-6 border-r bg-white overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Editor Skripsi Theziz</h1>
        <textarea 
          className="w-full h-[80%] p-4 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Tulis draf skripsimu di sini..."
        />
      </div>

      {/* AI Assistant Panel */}
      <div className="w-1/2 flex flex-col p-6">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map(m => (
            <div key={m.id} className={`p-4 rounded-xl ${m.role === 'user' ? 'bg-blue-600 text-white ml-8' : 'bg-gray-200 text-black mr-8'}`}>
              <p className="text-sm font-semibold mb-1">{m.role === 'user' ? 'Mahasiswa' : 'Theziz AI'}</p>
              {m.content}
            </div>
          ))}
          {isLoading && <p className="text-gray-400 animate-pulse">Theziz sedang berfikir...</p>}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <input
            className="w-full p-4 pr-12 rounded-full border shadow-lg focus:outline-none"
            value={input}
            onChange={handleInputChange}
            placeholder="Tanyakan referensi atau bantu tulis Bab 1..."
          />
          <button type="submit" className="absolute right-3 top-3 bg-blue-600 text-white p-2 rounded-full">
            🚀
          </button>
        </form>
      </div>
    </div>
  );
}