import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={hasError:false,error:null}; }
  static getDerivedStateFromError(error){ return {hasError:true,error}; }
  render(){
    if(this.state.hasError){
      return (
        <div style={{padding:20,fontFamily:'Inter,sans-serif',background:'#070c18',minHeight:'100vh',color:'#e8edf5',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
          <div style={{fontSize:18,fontWeight:'bold',color:'#ff4757',marginBottom:8}}>Game failed to load</div>
          <div style={{fontSize:13,color:'#6b7fa0',marginBottom:16,textAlign:'center',maxWidth:300}}>
            {this.state.error?.message || 'Unknown error'}
          </div>
          <button onClick={()=>window.location.reload()} style={{padding:'12px 24px',background:'#00e5ff',color:'#003d42',border:'none',borderRadius:8,fontWeight:'bold',fontSize:14,cursor:'pointer'}}>
            Reload Game
          </button>
        </div>
      )
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
