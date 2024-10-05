"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
export default function Post({ params }) {
    const [post, setPost] = useState({});
    const [comments, setComments] = useState({});
    const [userComments, setUserComments] = useState([]);
    const [change, setChange] = useState(0);
    const [visibleComments, setVisibleComments] = useState(5);
    const router = useRouter();
    const formatDateTime = (dateString) => {
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };

        const date = new Date(dateString);
        const formattedDate = date.toLocaleString('en-IN', options);
        const [time, datePart] = formattedDate.split(', ');
        return `${time} ${datePart}`;
    };

    const loadMoreComments = () => {
        setVisibleComments(prevVisible => prevVisible + 5);
    };

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/commentFetch/${params.id}`)
            .then((res) => res.json())
            .then((data) => setUserComments(data));
    }, [params.id, change]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/postpage/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data || Object.keys(data).length === 0) {
                    router.replace('/404');
                } else {
                    setPost(data);
                }
            });
    }, [params.id]);

    const inputSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${params.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({comments})
        })
        .then((res) => res.json())
        .then((response) => {
            setUserComments(prevComments => 
                Array.isArray(prevComments) ? 
                [{ username: response.username, comment: response.comment, createdAt: new Date().toISOString() }, ...prevComments] : 
                []
            );
            setChange(prev => prev + 1);
            setComments({})
        });
    };

    const inputHandler = (e) => {
        let field = e.target.name;
        let value = e.target.value;
        setComments({ [field]: value });
    };

    return (
        <div className=" min-h-screen text-black">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                    <p className="text-sm">by {post.author} | {post.date}</p>
                </header>

                <figure className="mb-6">
                    <img
                        src="https://picsum.photos/1200/600"
                        alt="Featured"
                        className="w-full h-auto object-cover"
                    />
                </figure>

                <section className="mb-8">
                    <p className="text-lg">{post.Details}</p>
                </section>

                <section>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-sm font-bold mb-1">Comment</label>
                        <textarea
                            id="message"
                            onChange={inputHandler}
                            name="comments"
                            value={comments.comments ?? ""}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-400  rounded text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        onClick={inputSubmit}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Add Comment
                    </button>
                </section>
                         
                <div className="p-4">
                    {userComments.length > 0 ? (
                        userComments.slice(0, visibleComments).map((comment, index) => (
                            <div key={index} className="flex text-black justify-end my-4">
                                <div className="w-96 rounded-3xl bg-purple-300 h-auto max-h-screen overflow-auto break-words p-4 shadow-lg transition-transform duration-200 ">
                                    <div className="flex flex-row  justify-between items-center mb-2">
                                        <div className="flex flex-row" >  <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="24" 
                                            height="24" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" >
                                            <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12z"/>
                                            <path d="M19.5 21c-1-2-3.5-3-7.5-3s-6.5 1-7.5 3"/>
                                        </svg> {comment.username} </div>
                                        <p className="text-sm text-gray-500">{formatDateTime(comment.createdAt)}</p>
                                    </div>
                                    <p className="text-justify text-gray-800">{comment.comment}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center mt-4">No comments yet. Be the first to comment!</p>
                    )}

                    {visibleComments < userComments.length && (
                        <div className="flex justify-center mt-4">
                            <button 
                                onClick={loadMoreComments} 
                                className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
                            >
                                Read More Comments
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}