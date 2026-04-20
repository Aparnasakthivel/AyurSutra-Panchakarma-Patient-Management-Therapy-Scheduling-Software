import React, {useState} from 'react';
import FormInput from '../components/FormInput';
import { required, isEmail, maxLength, runValidators } from '../validation/validators';

export default function Admin(){
  const [form, setForm] = useState({name:'', email:'', password:'', phone:'', role:'Admin', permissions:'', status:'Active'});
  const [errors, setErrors] = useState({});
  const [admins, setAdmins] = useState(JSON.parse(localStorage.getItem('admins') || '[]'));
  const onChange = (name, value) => setForm(f=>({ ...f, [name]: value }));

  const validate = ()=>{
    const e = {};
    e.name = runValidators(form.name, [required, maxLength(100)]);
    e.email = runValidators(form.email, [required, isEmail]);
    e.password = runValidators(form.password, [required]);
    e.phone = runValidators(form.phone, []);
    setErrors(e);
    return Object.values(e).every(x=>!x);
  }

  const submit = async (ev)=>{
    ev.preventDefault();
    if(!validate()) return;

    const newAdmin = { ...form, id: Date.now() };
    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));

    setForm({ name:'', email:'', password:'', phone:'', role:'Admin', permissions:'', status:'Active' });
    setErrors({});
    alert('Admin created successfully');

    // Optionally send to backend
    try{
      const res = await fetch('/api/admins',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newAdmin)});
      if(!res.ok){
        const data = await res.json();
        console.warn('Backend admin create failed:', data.error || 'unknown');
      }
    }catch(err){
      console.warn('Expected if no backend is available:', err);
    }
  }

  return (
    <div className="page">
      <h2>Create Admin</h2>
      <form onSubmit={submit}>
        <FormInput label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} />
        <FormInput label="Email" name="email" value={form.email} onChange={onChange} error={errors.email} type="email" />
        <FormInput label="Password" name="password" value={form.password} onChange={onChange} error={errors.password} type="password" />
        <FormInput label="Phone" name="phone" value={form.phone} onChange={onChange} error={errors.phone} />
        <FormInput label="Role" name="role" value={form.role} onChange={onChange} error={errors.role} />
        <FormInput label="Permissions (comma separated)" name="permissions" value={form.permissions} onChange={onChange} error={errors.permissions} />
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>

      <h2 style={{marginTop:'30px'}}>Admin List</h2>
      <div style={{overflowX:'auto'}}>
        <table className="data-table" style={{width:'100%',borderCollapse:'collapse',marginTop:'10px'}}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Permissions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign:'center',padding:'12px'}}>No admins added yet.</td></tr>
            ) : (
              admins.map(a => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                  <td>{a.role}</td>
                  <td>{a.permissions}</td>
                  <td>{a.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
