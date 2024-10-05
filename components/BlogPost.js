"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
export default function BlogPost() {
  const [posted, setPost] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [hasResults, setHasResults] = useState(true);
  const [showBackButton, setShowBackButton] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/blogs")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setFilteredPosts(data);
        setHasResults(data.length > 0);
        const uniqueCategories = [...new Set(data.map(post => post.category))];
        setCategories(uniqueCategories);
      });
  }, []);

  useEffect(() => {
    let filtered = posted;

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.Details.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setShowBackButton(true); 
    } else {
      setShowBackButton(false); 
    }

    setFilteredPosts(filtered);
    setHasResults(filtered.length > 0);
  }, [selectedCategory, searchQuery, posted]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSearchQuery(''); 
    setShowBackButton(false); 
  };

  const handleBack = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setFilteredPosts(posted);
    setHasResults(posted.length > 0);
    setShowBackButton(false);
  };




  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
          <h1 className="text-4xl text-black font-bold mb-4 md:mb-0">Blog Posts</h1>
          <div className="flex flex-col md:flex-row md:space-x-2 w-full md:w-auto items-center">
            <div className="relative mb-4">
              <select
                onChange={handleCategoryChange}
                value={selectedCategory}
                className="bg-black border border-gray-600 mt-4 rounded-lg py-2 px-4  text-white focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
              >
                <option value="" className="text-gray-400">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="text-black">
                    {category}
                  </option>
                ))}
              </select>

            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="bg-black border-gray-600 rounded-lg p-2 flex-1 mb-2 md:mb-0  text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
            />

            {showBackButton && (
              <button
                onClick={handleBack}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mb-2 md:mb-0 md:mr-2 hover:bg-blue-500 transition duration-200"
              >
                Back
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hasResults ? (
            filteredPosts.map(data => (
              <Link href={`/post/${data._id}`} key={data._id}>
                <article className="p-6  border border-gray-400 rounded-lg shadow-lg transition-transform transform hover:scale-105 max-w-md mx-auto lg:max-w-lg">
                  <img src={data.image} alt="Post Image" className="w-full h-48 object-cover mb-6 rounded-lg" />
                  <h2 className="text-2xl text-slate-800 font-bold mb-3">{data.title}</h2>
                  <p className="text-black mb-5 text-justify">{data.short}</p>
                </article>
              </Link>
            ))
          ) : (
            <h1 className="text-white text-2xl mt-36 font-bold text-center col-span-full">No results found</h1>
          )}
        </div>
      </div>
    </div>
  );
}