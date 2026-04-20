import React, { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import { required, isNumber, maxLength, runValidators } from '../validation/validators';

export default function Therapy(){
  const [form, setForm] = useState({name:'', description:'', duration:'', cost:'', patientId:'', doctorId:'', startDate:'', endDate:'', status:'Scheduled', notes:''});
  const [errors, setErrors] = useState({});
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientError, setPatientError] = useState('');

  const onChange = (name, value) => setForm(f=>({ ...f, [name]: value }));

  useEffect(() => {
    let cancelled = false;

    const loadPatients = async () => {
      try {
        setLoadingPatients(true);
        setPatientError('');

        // Prefer localStorage data (used by the current Patient page) so the dropdown shows existing patients.
        const stored = localStorage.getItem('patients');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length) {
            if (!cancelled) return setPatients(parsed);
          }
        }

        // Fallback to backend API (if using a server-backed patient list)
        const res = await fetch('/api/patients');
        if (!res.ok) throw new Error(`Failed to load patients (${res.status})`);
        const data = await res.json();
        if (!cancelled) setPatients(data);
      } catch (err) {
        if (!cancelled) setPatientError(err.message || 'Failed to load patients');
      } finally {
        if (!cancelled) setLoadingPatients(false);
      }
    };

    loadPatients();

    return () => {
      cancelled = true;
    };
  }, []);

  const validate = ()=>{
    const e={};
    e.name = runValidators(form.name, [required, maxLength(200)]);
    e.description = runValidators(form.description, [required]);
    e.duration = runValidators(form.duration, [required, isNumber]);
    e.cost = runValidators(form.cost, [required, isNumber]);
    e.patientId = runValidators(form.patientId, [required]);
    e.doctorId = runValidators(form.doctorId, [required]);
    e.startDate = runValidators(form.startDate, [required]);
    e.endDate = runValidators(form.endDate, [required]);
    setErrors(e);
    return Object.values(e).every(x=>!x);
  }

  const submit = async (ev)=>{
    ev.preventDefault();
    if(!validate()) return;
    try{
      const res = await fetch('/api/therapies',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();
      if(res.ok) alert('Therapy created'); else alert(data.error||'Failed');
    }catch(err){alert('Network error')}
  }

  return (
    <div className="page">
      <h2>Create Therapy</h2>
      <form onSubmit={submit}>
        <FormInput label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} />
        <FormInput label="Description" name="description" value={form.description} onChange={onChange} error={errors.description} />
        <FormInput label="Duration (minutes)" name="duration" value={form.duration} onChange={onChange} error={errors.duration} type="number" />
        <FormInput label="Cost" name="cost" value={form.cost} onChange={onChange} error={errors.cost} type="number" />
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:12,marginBottom:6}}>Patient</label>
          {loadingPatients ? (
            <div>Loading patients…</div>
          ) : patientError ? (
            <div style={{color:'#e11d48',fontSize:12,marginTop:6}}>{patientError}</div>
          ) : (
            <select
              name="patientId"
              value={form.patientId}
              onChange={(e)=>onChange('patientId', e.target.value)}
              style={{width:'100%',padding:10,borderRadius:8,border:errors.patientId? '1px solid #e11d48':'1px solid #ddd'}}
            >
              <option value="">Select a patient</option>
              {patients.map(p=> {
                const id = p._id || p.id || '';
                return (
                  <option key={id || Math.random()} value={id}>
                    {p.name || 'Unknown'} {id ? `(${id})` : ''}
                  </option>
                );
              })}
            </select>
          )}
          {errors.patientId && <div style={{color:'#e11d48',fontSize:12,marginTop:6}}>{errors.patientId}</div>}
        </div>
        <FormInput label="Doctor ID" name="doctorId" value={form.doctorId} onChange={onChange} error={errors.doctorId} />
        <FormInput label="Start Date" name="startDate" value={form.startDate} onChange={onChange} error={errors.startDate} type="date" />
        <FormInput label="End Date" name="endDate" value={form.endDate} onChange={onChange} error={errors.endDate} type="date" />
        <FormInput label="Notes" name="notes" value={form.notes} onChange={onChange} error={errors.notes} />
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}
