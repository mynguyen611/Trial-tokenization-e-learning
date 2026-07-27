import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignedIn>
        <App />
        <div style={{position:'fixed',top:11,right:16,zIndex:9999}}>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <div style={{
          minHeight:'100vh',
          background:'#09101C',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          fontFamily:'system-ui,-apple-system,sans-serif',
          padding:24,
        }}>
          <div style={{textAlign:'center',marginBottom:36}}>
            <div style={{fontSize:32,fontWeight:800,color:'white',letterSpacing:'-.02em',marginBottom:8}}>
              datavant
            </div>
            <div style={{color:'rgba(255,255,255,.4)',fontSize:14}}>
              Trial Tokenization · Sales Enablement
            </div>
          </div>
          <SignIn routing="hash" />
          <p style={{color:'rgba(255,255,255,.2)',fontSize:12,marginTop:24}}>
            Internal use only · Datavant sales team
          </p>
        </div>
      </SignedOut>
    </ClerkProvider>
  </React.StrictMode>,
)
