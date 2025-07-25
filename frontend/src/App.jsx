import { useState, useContext } from 'react'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home.jsx'
import Chat from './components/chat.jsx'
import {Toaster} from 'react-hot-toast';
import {Authcontext} from '../context/authcontext.jsx';

function App() {
  const {authuser} = useContext(Authcontext)
  return (
    <div>
      <BrowserRouter>
          <Toaster/>
          <Routes>
            <Route path='/' element={!authuser ? <Home /> : <Navigate to='/chat'/>}>Home</Route>
            <Route path='/chat' element={authuser ? <Chat /> : <Navigate to='/'/>}>Chat</Route>
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App