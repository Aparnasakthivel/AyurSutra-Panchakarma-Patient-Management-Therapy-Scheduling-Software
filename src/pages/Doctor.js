import React, {useState} from 'react';
import FormInput from '../components/FormInput';
import { required, isEmail, isPhone, isNumber, maxLength, runValidators } from '../validation/validators';

export default function Doctor(){
  const [form, setForm] = useState({name:'', email:'', phone:'', specialization:'', qualifications:'', licenseNumber:'', yearsOfExperience:'', consultationFee:''});
  const [errors, setErrors] = useState({});
  const onChange = (name, value) => setForm(f=>({ ...f, [name]: value }));

  const validate = () =>{
    const e = {};
    e.name = runValidators(form.name, [required, maxLength(100)]);
    e.email = runValidators(form.email, [required, isEmail]);
    e.phone = runValidators(form.phone, [required, isPhone]);
    e.specialization = runValidators(form.specialization, [required]);
    e.qualifications = runValidators(form.qualifications, [required]);
    e.licenseNumber = runValidators(form.licenseNumber, [required]);
    e.yearsOfExperience = runValidators(form.yearsOfExperience, [required, isNumber]);
    e.consultationFee = runValidators(form.consultationFee, [required, isNumber]);
    setErrors(e);
    return Object.values(e).every(x=>!x);
  }

  const submit = async (ev)=>{
    ev.preventDefault();
    if(!validate()) return;
    try{
      const res = await fetch('/api/doctors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();
      if(res.ok) alert('Doctor created'); else alert(data.error||'Failed');
    }catch(err){alert('Network error')}
  }

  return (
    <div className="page">
      <h2>Create Doctor</h2>
      <form onSubmit={submit}>
        <FormInput label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} />
        <FormInput label="Email" name="email" value={form.email} onChange={onChange} error={errors.email} type="email" />
        <FormInput label="Phone" name="phone" value={form.phone} onChange={onChange} error={errors.phone} />
        <FormInput label="Specialization" name="specialization" value={form.specialization} onChange={onChange} error={errors.specialization} />
        <FormInput label="Qualifications" name="qualifications" value={form.qualifications} onChange={onChange} error={errors.qualifications} />
        <FormInput label="License Number" name="licenseNumber" value={form.licenseNumber} onChange={onChange} error={errors.licenseNumber} />
        <FormInput label="Years of Experience" name="yearsOfExperience" value={form.yearsOfExperience} onChange={onChange} error={errors.yearsOfExperience} type="number" />
        <FormInput label="Consultation Fee" name="consultationFee" value={form.consultationFee} onChange={onChange} error={errors.consultationFee} type="number" />
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}
