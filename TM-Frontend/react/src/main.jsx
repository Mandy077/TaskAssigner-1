
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthContext.jsx'
import AdminProvider from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
    <AdminProvider>
 <AuthProvider>
           <App />
 </AuthProvider>
 </AdminProvider>
   
  
)
