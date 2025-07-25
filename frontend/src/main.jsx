import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authprovider } from "../context/authcontext.jsx";
import { Provider } from "./ui/provider.jsx";
import { Chatprovider } from "../context/chatcontext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <Authprovider>
        <Chatprovider>
          <App />
        </Chatprovider>
      </Authprovider>
    </Provider>
  </StrictMode>,
)
