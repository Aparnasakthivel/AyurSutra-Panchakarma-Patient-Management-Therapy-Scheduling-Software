import React from 'react';

export default function FormInput({label, name, type = 'text', value, onChange, error, placeholder}){
  return (
    <div style={{marginBottom:12}}>
      <label style={{display:'block',fontSize:12,marginBottom:6}}>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e)=>onChange(name, e.target.value)}
        style={{width:'100%',padding:10,borderRadius:8,border:error? '1px solid #e11d48':'1px solid #ddd'}}
      />
      {error && <div style={{color:'#e11d48',fontSize:12,marginTop:6}}>{error}</div>}
    </div>
  )
}
