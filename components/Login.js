"use client";
import { useState} from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';

export default function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState({});
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const Router = useRouter();

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(users),
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData: encrypted }),
      });

      const data = await response.json();
      if (response.ok) { 
        setUsers({});
        setMessage(data.message);
        showLogin();
      } else {
        setMessage(data.message || 'Registration failed');
      }
      setTimeout(() => { setMessage(""); }, 2000);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleChangeRegister = (e) => {
    const { id, value } = e.target;
    setUsers((state) => ({
      ...state,
      [id]: value,
    }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const encryptedemail = CryptoJS.AES.encrypt(
      JSON.stringify(email),
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();
    const encryptedpassword = CryptoJS.AES.encrypt(
      JSON.stringify(password),
      process.env.NEXT_PUBLIC_SECRET_KEY
    ).toString();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedemail,encryptedpassword }),
      });

      const data = await response.json();
      if (response.ok) {
        Router.push('/Home');
      } 
      else {
        setEmail("");
        setPassword("");
        setMessage(data.message || 'Login failed');
        setTimeout(() => { setMessage(""); }, 2000);
      }
      
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setTimeout(() => { setMessage(""); }, 2000);
    }
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const showLogin = () => setIsLogin(true);
  const showRegister = () => setIsLogin(false);

  return (
    <div className='min-h-screen'>
     <center> <h1 className="mx-2  mt-16  text-xl ">Welcome to our blog! Please register as a new user or log in if you already have an account.</h1></center>
    <div className="flex items-center mt-10 justify-center ">
      <div className="p-8 rounded-lg shadow-lg border border-gray-400 w-96">
      {message && <h1 className='text-black font-bold text-center'>{message}</h1>}
        <div className="flex justify-between mb-4 ">
        
          <button
            className={`w-full py-2 text-white ${isLogin ? 'animated-bg' : 'bg-gray-700'} rounded focus:outline-none`}
            onClick={showLogin}
          >
            Login
          </button>
          <button
            className={`w-full py-2 text-white ${!isLogin ? 'animated-bg' : 'bg-gray-700'} rounded focus:outline-none`}
            onClick={showRegister}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <div id="login-form">
            <form onSubmit={handleSubmitLogin}>
              <div className="mb-4">
                <label className="block font-serif text-black mb-2" htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={email}
                  onChange={handleChangeLogin}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block font-serif text-black mb-2" htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={password}
                  onChange={handleChangeLogin}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="w-full animated-bg hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none">
                Login
              </button>
            </form>
            <p className="text-black text-center mt-4">
              Don't have an account? <button onClick={showRegister} className="text-blue-900 hover:underline">Sign up</button>
            </p>
            
          </div>
        ) : (
          <div id="register-form">
            <form onSubmit={handleSubmitRegister}>
              <div className="mb-4">
                <label className="block font-serif text-black mb-2" htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={users.username || ''}
                  onChange={handleChangeRegister}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-serif text-black mb-2" htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={users.email || ''}
                  onChange={handleChangeRegister}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-serif text-black mb-2" htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={users.bio || ''}
                  onChange={handleChangeRegister}
                  rows="2"
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-serif text-black mb-2" htmlFor="register-password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={users.password || ''}
                  onChange={handleChangeRegister}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="w-full animated-bg hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none">
                Register
              </button>
            </form>
            <p className="text-black text-center mt-4">
              Already have an account? <button onClick={showLogin} className="text-blue-900  hover:underline">Login</button>
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
