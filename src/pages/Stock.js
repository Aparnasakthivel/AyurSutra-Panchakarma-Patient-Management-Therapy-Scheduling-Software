import React, {useState} from 'react';
import FormInput from '../components/FormInput';
import { required, isNumber, runValidators } from '../validation/validators';

export default function Stock(){
  const [form, setForm] = useState({itemName:'', category:'', quantity:'', unit:'', unitCost:'', supplier:'', expiryDate:'', minimumStock:''});
  const [errors, setErrors] = useState({});
  const onChange = (name, value) => setForm(f=>({ ...f, [name]: value }));

  const validate = ()=>{
    const e = {};
    e.itemName = runValidators(form.itemName, [required]);
    e.category = runValidators(form.category, [required]);
    e.quantity = runValidators(form.quantity, [required, isNumber]);
    e.unit = runValidators(form.unit, [required]);
    e.unitCost = runValidators(form.unitCost, [required, isNumber]);
    e.supplier = runValidators(form.supplier, [required]);
    e.expiryDate = runValidators(form.expiryDate, [required]);
    e.minimumStock = runValidators(form.minimumStock, [required, isNumber]);
    setErrors(e);
    return Object.values(e).every(x=>!x);
  }

  const submit = async (ev)=>{
    ev.preventDefault();
    if(!validate()) return;
    try{
      const res = await fetch('/api/stock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await res.json();
      if(res.ok) alert('Stock item created'); else alert(data.error||'Failed');
    }catch(err){alert('Network error')}
  }

  return (
    <div className="page">
      <h2>Create Stock Item</h2>
      <form onSubmit={submit}>
        <FormInput label="Item Name" name="itemName" value={form.itemName} onChange={onChange} error={errors.itemName} />
        <FormInput label="Category" name="category" value={form.category} onChange={onChange} error={errors.category} />
        <FormInput label="Quantity" name="quantity" value={form.quantity} onChange={onChange} error={errors.quantity} type="number" />
        <FormInput label="Unit" name="unit" value={form.unit} onChange={onChange} error={errors.unit} />
        <FormInput label="Unit Cost" name="unitCost" value={form.unitCost} onChange={onChange} error={errors.unitCost} type="number" />
        <FormInput label="Supplier" name="supplier" value={form.supplier} onChange={onChange} error={errors.supplier} />
        <FormInput label="Expiry Date" name="expiryDate" value={form.expiryDate} onChange={onChange} error={errors.expiryDate} type="date" />
        <FormInput label="Minimum Stock" name="minimumStock" value={form.minimumStock} onChange={onChange} error={errors.minimumStock} type="number" />
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}
