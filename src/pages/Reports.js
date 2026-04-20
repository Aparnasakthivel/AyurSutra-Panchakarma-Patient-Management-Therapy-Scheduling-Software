import React, {useState} from 'react';
import FormInput from '../components/FormInput';
import { required, runValidators } from '../validation/validators';

export default function Reports(){
  const [form, setForm] = useState({patientId:'', doctorId:'', reportType:'', findings:'', recommendations:'', reportDate:'', fileUrl:'', status:'Pending'});
  const [errors, setErrors] = useState({});
  const onChange = (name, value) => setForm(f=>({ ...f, [name]: value }));

  const validate = ()=>{
    const e = {};
    e.patientId = runValidators(form.patientId, [required]);
    e.doctorId = runValidators(form.doctorId, [required]);
    e.reportType = runValidators(form.reportType, [required]);
    e.findings = runValidators(form.findings, [required]);
    e.recommendations = runValidators(form.recommendations, [required]);
    setErrors(e);
    return Object.values(e).every(x=>!x);
  }

  const submit = async (ev)=>{
    ev.preventDefault();
    if(!validate()) return;
    try{
      const res = await fetch('/api/reports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();
      if(res.ok) alert('Report created'); else alert(data.error||'Failed');
    }catch(err){alert('Network error')}
  }

  return (
    <div className="page">
      <h2>Create Report</h2>
      <form onSubmit={submit}>
        <FormInput label="Patient ID" name="patientId" value={form.patientId} onChange={onChange} error={errors.patientId} />
        <FormInput label="Doctor ID" name="doctorId" value={form.doctorId} onChange={onChange} error={errors.doctorId} />
        <FormInput label="Report Type" name="reportType" value={form.reportType} onChange={onChange} error={errors.reportType} />
        <FormInput label="Findings" name="findings" value={form.findings} onChange={onChange} error={errors.findings} />
        <FormInput label="Recommendations" name="recommendations" value={form.recommendations} onChange={onChange} error={errors.recommendations} />
        <FormInput label="Report Date" name="reportDate" value={form.reportDate} onChange={onChange} error={errors.reportDate} type="date" />
        <FormInput label="File URL" name="fileUrl" value={form.fileUrl} onChange={onChange} error={errors.fileUrl} />
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}
