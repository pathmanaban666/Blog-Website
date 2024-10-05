"use client"; 
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

const Profile = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profileFetch`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setUser(data.updatedUser);
        setFormData(data.updatedUser);
      } catch (error) {
        console.error(error); 
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFormData(user); 
  }, [user]);

  const handleToggle = (formType) => {
    setActiveForm(activeForm === formType ? null : formType);
    if (formType === 'edit' && activeForm === 'edit') {
      setFormData(user);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      const result = await response.json();
      setMessage(result.message);
      setTimeout(() => { setMessage("") }, 1000);
      setUser(prevUser => ({
        ...prevUser,
        ...result.updatedUser
      }));

      setActiveForm(null);
    } catch (error) {
      console.error(error); 
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const passwordData1 = CryptoJS.AES.encrypt(
      JSON.stringify(passwordData),
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedPassword: passwordData1 }),
      });

      const result = await response.json();
      if (result.message === "Password changed successfully") {
        setPasswordData({ oldPassword: '', newPassword: '' });
        setMessage(result.message);
        setTimeout(() => { setMessage("") }, 1000);
        setActiveForm(null);
      }
      else{
        setPasswordData({ oldPassword: '', newPassword: '' });
        setMessage(result.message);
        setTimeout(() => { setMessage("") }, 1000);
      }
    } catch (error) {
      console.error(error); 
    }
  };

  return (
    <div className=" min-h-screen p-6 text-black"> 
      <div className="max-w-md mx-auto my-10 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
        <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="100" 
    height="100" 
    viewBox="0 0 24 24" 
    fill="none"
>
    
    <circle cx="12" cy="12" r="12" fill="#000308" /> 

    
    <path 
        d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12z" 
        fill="white" 
        strokeWidth="0"
    />
    <path 
        d="M19.5 21c-1-2-3.5-3-7.5-3s-6.5 1-7.5 3" 
        fill="none" 
        stroke="white" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
</svg>

          <div>
            <h1 className="text-2xl text-black font-bold">{user.username}</h1>
            <p className="text-black">{user.email}</p>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl text-black font-semibold">Bio</h2>
          <p className="text-black">{user.bio}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl text-black font-semibold">Settings</h2>
          <button
            onClick={() => handleToggle('edit')}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {activeForm === 'edit' ? "Cancel" : "Edit Profile"}
          </button>
          <button
            onClick={() => handleToggle('changePassword')}
            className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {activeForm === 'changePassword' ? "Cancel" : "Change Password"}
          </button>
        </div>
        <br/>
        {message && <h1 className='text-black text-center'>{message}</h1>}
        
        {activeForm === 'edit' && (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <label className="w-1/4 text-black font-medium" htmlFor="username">Name:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData?.username || ''}
                  onChange={handleChange}
                  className="border bg-black text-white rounded p-2 w-2/3"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-black font-medium" htmlFor="bio">Bio:</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData?.bio || ''}
                  onChange={handleChange}
                  className="border bg-black text-white rounded p-2 w-2/3"
                  required
                />
              </div>
              <button
                type="submit"
                className="mx-auto px-12 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {activeForm === 'changePassword' && (
          <form onSubmit={handlePasswordSubmit} className="mt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <label className="w-1/4 text-black font-medium" htmlFor="oldPassword">Old Password:</label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="border bg-black text-white rounded p-2 w-2/3"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-black font-medium" htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="border bg-black text-white rounded p-2 w-2/3"
                  required
                />
              </div>
              <button
                type="submit"
                className="mx-auto px-12 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
