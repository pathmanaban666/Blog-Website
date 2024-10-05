'use client';
import Link from "next/link";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const Router = useRouter();
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev); 
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                Router.push('/Login')
                
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('An error occurred while logging out:', error);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('.user-icon')) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {

            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="text-black">
            <div className="container mx-auto px-6 space-y-5 flex justify-between items-center">
                <div className="text-xl mt-4 font-bold">BlogSite</div>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link href="/Home" className="font-bold hover:text-blue-800">Home</Link></li>
                        <li><Link href="/About" className="font-bold hover:text-blue-800">About</Link></li>
                        <li><Link href="/BlogPost" className="font-bold hover:text-blue-800">Blog</Link></li>
                        <li><Link href="/Contact" className="font-bold hover:text-blue-800">Contact</Link></li>
                        <button className="user-icon" onClick={toggleDropdown}>
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        >
                    <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12z"/>
                    <path d="M19.5 21c-1-2-3.5-3-7.5-3s-6.5 1-7.5 3"/>
                </svg>

            </button>
                    </ul>
                    {isOpen && (
                        <div ref={dropdownRef} className="absolute right-10 z-10 mt-4 w-26 rounded-md shadow-lg bg-black ring-1 ring-black ring-opacity-5 lg:right-14">
                            <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <Link href="/Profile" className="block px-4 py-2 text-sm font-sans text-white hover:bg-neutral-700" role="menuitem">View Profile</Link>
                                <button onClick={handleLogout} className="block px-4 py-2 font-sans w-28 text-start text-sm text-white hover:bg-neutral-700">Log Out</button>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
}