import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignedIn>
        <div style={{position:'relative'}}>
          <App />
          <div style={{position:'fixed',top:11,right:16,zIndex:9999}}>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div style={{minHeight:'100vh',background:'#09101C',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'system-ui'}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <div style={{fontSize:32,fontWeight:800,color:'white',letterSpacing:'-.02em',marginBottom:8}}>datavant</div>
            <div style={{color:'rgba(255,255,255,.45)',fontSize:14}}>Trial Tokenization · Sales Course</div>
          </div>
          <SignIn routing="hash" />
        </div>
      </SignedOut>
    </ClerkProvider>
  </React.StrictMode>
)
