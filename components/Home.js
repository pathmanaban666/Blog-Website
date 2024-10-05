"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`);
                if (!res.ok) throw new Error('Failed to fetch posts');
                const data = await res.json();
                setPosts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="font-sans leading-normal tracking-normal min-h-screen">
            <section className="relative bg-cover bg-center text-black py-32">
                <div className="absolute inset-0 opacity-50"></div>
                <div className="relative container mx-auto px-6 text-center z-10">
                    <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
                    <p className="text-lg mb-8"> Explore topics like technology, travel, and lifestyle. Here, you'll find articles and tips that inspire and inform.</p>
                    <Link href="/BlogPost" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500">Read All Posts</Link>
                </div>
            </section>

            <div>
            
                <main className="container mx-auto px-2 py-8">
                <h1 className="text-xl font-bold mb-4 mx-5 underline">Currently Trending:</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((data) => (
                            <Link href={`/post/${data._id}`} key={data._id}>
                                <article className="p-6 rounded-lg border border-gray-500 shadow-lg relative overflow-hidden transition-transform transform hover:scale-105 max-w-md mx-auto lg:max-w-lg">
                                    <img src={data.image} alt="Post Image" className="w-full h-48 object-cover mb-6 rounded-lg" />
                                    <h2 className="text-2xl text-slate-800 font-bold mb-3">{data.title}</h2>
                                    <p className="text-black text-justify mb-5">{data.short}</p>
                                </article>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
