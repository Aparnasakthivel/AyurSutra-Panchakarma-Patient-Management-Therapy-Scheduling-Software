import React, {useState} from 'react';
import FormInput from '../components/FormInput';
import { required, isNumber, runValidators } from '../validation/validators';

export default function Billing(){
  const [form, setForm] = useState({patientId:'', invoiceNumber:'', description:'', amount:'', therapyId:'', paymentMethod:'Cash', paymentStatus:'Pending', dueDate:'', paidDate:''});
  const [errors, setErrors] = useState({});
  const onChange = (name, value) => setForm(f=>({ ...f, [name]: value }));

  const validate = ()=>{
    const e = {};
    e.patientId = runValidators(form.patientId, [required]);
    e.invoiceNumber = runValidators(form.invoiceNumber, [required]);
    e.description = runValidators(form.description, [required]);
    e.amount = runValidators(form.amount, [required, isNumber]);
    e.dueDate = runValidators(form.dueDate, [required]);
    setErrors(e);
    return Object.values(e).every(x=>!x);
  }

  const submit = async (ev)=>{
    ev.preventDefault();
    if(!validate()) return;
    try{
      const res = await fetch('/api/billing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();
      if(res.ok) alert('Billing created'); else alert(data.error||'Failed');
    }catch(err){alert('Network error')}
  }

  return (
    <div className="page">
      <h2>Create Billing</h2>
      <form onSubmit={submit}>
        <FormInput label="Patient ID" name="patientId" value={form.patientId} onChange={onChange} error={errors.patientId} />
        <FormInput label="Invoice Number" name="invoiceNumber" value={form.invoiceNumber} onChange={onChange} error={errors.invoiceNumber} />
        <FormInput label="Description" name="description" value={form.description} onChange={onChange} error={errors.description} />
        <FormInput label="Amount" name="amount" value={form.amount} onChange={onChange} error={errors.amount} type="number" />
        <FormInput label="Therapy ID" name="therapyId" value={form.therapyId} onChange={onChange} error={errors.therapyId} />
        <FormInput label="Payment Method" name="paymentMethod" value={form.paymentMethod} onChange={onChange} error={errors.paymentMethod} />
        <FormInput label="Payment Status" name="paymentStatus" value={form.paymentStatus} onChange={onChange} error={errors.paymentStatus} />
        <FormInput label="Due Date" name="dueDate" value={form.dueDate} onChange={onChange} error={errors.dueDate} type="date" />
        <FormInput label="Paid Date" name="paidDate" value={form.paidDate} onChange={onChange} error={errors.paidDate} type="date" />
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}
