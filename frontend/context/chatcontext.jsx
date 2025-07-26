import { createContext, useContext, useState } from "react";
import { Authcontext } from "./authcontext";
import { useEffect } from "react";
import toast from 'react-hot-toast';

export const Chatcontext = createContext();

export const Chatprovider = ({ children }) => {
    const [msgs, setmsgs] = useState([]);
    const [users, setusers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenmsg, setunseenmsg] = useState({});

    const { socket, axios, authuser } = useContext(Authcontext);

    const getusers = async () => {
        try {
            const { data } = await axios.get('https://chat-app-backend-w6b6.onrender.com/api/chat/users');
            if (data.success) {
                setusers(data.users)
                setunseenmsg(data.unseenmsg)
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || error.message);
        }
    }

    const getmsg = async (userId) => {
        try {
            const { data } = await axios.get(`https://chat-app-backend-w6b6.onrender.com/api/chat/msgs/${userId}`);
            if (data.success) {
                setmsgs(data.msgs)
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || error.message);
        }
    }

    const sendmsg = async (msgData) => {
        try {
            const { data } = await axios.post(`https://chat-app-backend-w6b6.onrender.com/api/chat/send/${selectedUser._id}`, msgData);
            if (data.success) {
                setmsgs(prevMsg => [...prevMsg, data.newmsg])
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const subtomsg = async () => {
        if (!socket) return;

        socket.on('newmsg', (newmsg) => {
            if (selectedUser &&
                (newmsg.sender === selectedUser._id || newmsg.sender === authuser._id && newmsg.receiver === selectedUser._id)
            ) {
                newmsg.seen = true;
                setmsgs((prevMsg) => {
                    if (prevMsg.some(m => m._id === newmsg._id)) return prevMsg;
                    return [...prevMsg, newmsg];
                });
                axios.put(`https://chat-app-backend-w6b6.onrender.com/api/chat/mark/${newmsg._id}`);
            } else {
                setunseenmsg((prevMsg) => ({
                    ...prevMsg, [newmsg.sender]: prevMsg[newmsg.sender] ? prevMsg[newmsg.sender] + 1 : 1
                }))
            }
        })
    }

    const unsubtomsg = async () => {
        if (socket) socket.off('newmsg');
    }

    useEffect(() => {
        subtomsg();
        return () => {
            unsubtomsg();
        }
    }, [socket, selectedUser])

    const value = {
        msgs, users, selectedUser, getusers, sendmsg, setmsgs, setSelectedUser, unseenmsg, setunseenmsg, getmsg
    }
    return (
        <Chatcontext.Provider value={value}>
            {children}
        </Chatcontext.Provider>
    )
}