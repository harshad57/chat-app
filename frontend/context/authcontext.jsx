import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendurl = import.meta.env.BACKEND_URL || "https://chat-app-backend-w6b6.onrender.com";

export const Authcontext = createContext();

export const Authprovider = ({ children }) => {
  const [token, settoken] = useState(localStorage.getItem('token'));
  const [authuser, setauthuser] = useState(null);
  const [onlineuser, setonlineuser] = useState([]);
  const [socket, setsocket] = useState(null);

  const checkauth = async () => {
    try {
      const { data } = await axios.get('https://chat-app-backend-w6b6.onrender.com/api/user/check');
      if (data.success) {
        setauthuser(data.user)
        connectsocket(data.user)
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
    }
  }

  const signup = async (credentials) => {
    try {
      const { data } = await axios.post('https://chat-app-backend-w6b6.onrender.com/api/user', credentials);
      if (data.success) {
        setauthuser(data.userData);
        connectsocket(data.userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        settoken(data.token);
        localStorage.setItem('token', data.token);
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await axios.post('https://chat-app-backend-w6b6.onrender.com/api/user/login', credentials);
      if (data.success) {
        setauthuser(data.userData);
        connectsocket(data.userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        settoken(data.token);
        localStorage.setItem('token', data.token);
        toast.success(data.msg)
      } else {
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
    }
  }

  const logout = async () => {
    localStorage.removeItem('token');
    settoken(null);
    setauthuser(null);
    setonlineuser([]);
    axios.defaults.headers.common['token'] = null;
    toast.success('logout successful !');
    socket.disconnect();
  }

  const connectsocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendurl, {
      query: {
        userId: userData._id,
      }
    })
    newSocket.connect();
    setsocket(newSocket);
    newSocket.on('getOnlineUser', (userIds) => {
      setonlineuser(userIds);
    })
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    checkauth();
  }, [])


  const value = {
    axios,
    authuser,
    onlineuser,
    socket,
    signup,
    login,
    logout
  }
  return (
    <Authcontext.Provider value={value}>
      {children}
    </Authcontext.Provider>
  )
}