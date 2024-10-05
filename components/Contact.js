"use client"; 
import { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function Contact() {
  const [input, setInput] = useState({});
  const [message, setMessage] = useState("");

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const inputSubmit = async (e) => {
    e.preventDefault();
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(input),
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData: encrypted })
      });
      
      const response = await res.json();
      setMessage(response.message);
      setInput({});
      setTimeout(() => { setMessage(""); }, 1000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    
    <div className=" flex items-center justify-center min-h-screen">

      <div className=" p-8 rounded-lg border border-gray-400 shadow-lg -mt-28 w-96">
        <form onSubmit={inputSubmit}>
          <center><h1 className="text-4xl text-black font-bold mb-6">Contact Us</h1></center>
          <div className="mb-4">
            <label htmlFor="name" className="block font-serif text-black mb-2">Name</label>
            <input 
              type="text" 
              onChange={inputHandler} 
              id="name" 
              name="name" 
              value={input.name ?? ""} 
              className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-serif text-black mb-2">Email</label>
            <input 
              type="email" 
              onChange={inputHandler} 
              id="email" 
              name="email" 
              value={input.email ?? ""} 
              className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block font-serif text-black mb-2">Message</label>
            <textarea 
              id="message" 
              onChange={inputHandler} 
              name="message" 
              value={input.message ?? ""} 
              rows="2" 
              className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Send
          </button>
          <center><p className="text-black text-lg pt-6 font-bold">{message}</p></center> 
        </form>
      </div>
    </div>
  );
}