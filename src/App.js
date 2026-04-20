  import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { requestNotificationPermission } from "./utils/notificationService";
import { required, isEmail, isPhone, isNumber, minValue, maxValue, minLength, maxLength, onlyLetters, pincodeValidation, isDate, isFutureDate, isGender, isAddress } from "./validation/validators";

export default function App() {
  const [dark,setDark]=useState(false);
  const [logged,setLogged]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [userRole,setUserRole]=useState(null);

  useEffect(() => {
    // Request notification permission on app load
    if (logged) {
      requestNotificationPermission().then(granted => {
        if (granted) {
          console.log('✅ Browser notifications enabled');
        } else {
          console.log('ℹ️ Browser notifications disabled');
        }
      });
    }
  }, [logged]);

  return(
    <Router>
      <div className="bg-figure" />
      {!logged ? <Login setLogged={setLogged} setUserRole={setUserRole}/> :
      <div className={dark?"layout dark":"layout"}>
        <Sidebar isOpen={sidebarOpen}/>
        <div className="main">
          <header className="header">
            <button className="btn" onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:'none',color:'#0f766e',boxShadow:'none',fontSize:'1.5rem',padding:'0'}}>☰</button>
            🌿 Panchakarma System
            <button className="btn" onClick={()=>setDark(!dark)}>{dark?'🌞':'🌚'}</button>
          </header>
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/patient" element={<Patient isAdmin={userRole==='admin'}/>}/>
            <Route path="/therapy" element={<Therapy isAdmin={userRole==='admin'}/>}/>
            <Route path="/doctor" element={<Doctor isAdmin={userRole==='admin'}/>}/>
            <Route path="/stock" element={<Stock isAdmin={userRole==='admin'}/>}/>
            <Route path="/billing" element={<Billing/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/reminders" element={<RemindersPage/>}/>
            <Route path="/admin" element={<Admin/>}/>
          </Routes>
        </div>
      </div>}
    </Router>
  )
}

/* LOGIN */
function Login({setLogged, setUserRole}){
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const [showPass,setShowPass]=useState(false);
  const login=()=>{
    if(u==="admin" && p==="1234") {
      setLogged(true);
      setUserRole('admin');
    }
    else alert("Invalid Login");
  }
  return(
    <div className="login">
      <h2>Login</h2>
      <input placeholder="Username" onChange={e=>setU(e.target.value)}/>
      <div style={{position:'relative',marginBottom:'6px'}}>
        <input placeholder="Password" type={showPass?"text":"password"} value={p} onChange={e=>setP(e.target.value)} style={{width:'100%'}}/>
        <button onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'18px'}}>{showPass?'🙈':'🙊'}</button>
      </div>
      <button className="btn" onClick={login}>Login</button>
      <p>admin / 1234</p>
    </div>
  )
}

/* SIDEBAR */
function Sidebar({isOpen}){
  return(
    <div className={isOpen?"sidebar open":"sidebar closed"}>
      <Link to="/">Dashboard</Link>
      <Link to="/patient">Patient</Link>
      <Link to="/therapy">Therapy</Link>
      <Link to="/doctor">Doctor</Link>
      <Link to="/stock">Stock</Link>
      <Link to="/billing">Billing</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/reminders"> Reminders</Link>
      <Link to="/admin">Admin</Link>
    </div>
  )
}

/* DASHBOARD */
function Dashboard(){
  return(
    <div className="container">
      <Card title="Patient" link="/patient"/>
      <Card title="Therapy" link="/therapy"/>
      <Card title="Doctor" link="/doctor"/>
      <Card title="Stock"   link="/stock"/>
      <Card title="Billing" link="/billing"/>
      <Card title="Reports" link="/reports"/>
    </div>
  )
}
function Card({title,link}){
  return(
    <div className="card">
      <h2>{title}</h2>
      <Link to={link}><button className="btn">Open</button></Link>
    </div>
  )
}

/* PATIENT */
function Patient({isAdmin}){
  const [list,setList]=useState([]);
  const [form,setForm]=useState({
    id:"",
    name:"",
    age:"",
    gender:"",
    bloodGroup:"",
    disease:"",
    mobile:"",
    email:"",
    address:"",
    pincode:"",
    city:"",
    state:"",
    country:"",
    occupation:"",
    firstVisit:"",
    nextVisit:"",
    notes:""
  });
  const [errors,setErrors]=useState({});
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");
  const [reminderInfo,setReminderInfo]=useState(null);
  
  // compute next patient id based on existing patients (safe across reloads)
  const computeNextId = (patients) => {
    let max = 0;
    (patients || []).forEach(p => {
      if(!p || !p.id) return;
      const m = String(p.id).match(/(\d+)$/);
      if(m){
        const num = parseInt(m[1],10);
        if(!isNaN(num) && num > max) max = num;
      }
    });
    return 'P' + String(max + 1).padStart(4,'0');
  };

  useEffect(()=>{setList(JSON.parse(localStorage.getItem("patients"))||[])},[]);
  useEffect(()=>{localStorage.setItem("patients",JSON.stringify(list))},[list]);

  // keep form.id populated with an auto-generated id whenever the patient list changes
  useEffect(()=>{
    const nextId = computeNextId(list);
    setForm(f => ({...f, id: nextId, firstVisit: f.firstVisit || new Date().toLocaleString()}));
  },[list]);

  const handleChange=(e)=>{
    setError("");
    setSuccess("");
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setForm({...form,[e.target.name]:e.target.value});
  };

  const validatePatient = () => {
    const e = {};
    e.name = required(form.name) || minLength(2)(form.name) || maxLength(253)(form.name) || onlyLetters(form.name);
    e.age = required(form.age) || isNumber(form.age) || minValue(1)(form.age) || maxValue(120)(form.age);
    e.gender = required(form.gender) || isGender(form.gender);
    e.bloodGroup = required(form.bloodGroup) || (['A+','A-','B+','B-','AB+','AB-','O+','O-'].includes(form.bloodGroup) ? '' : 'Select a valid blood group');
    e.disease = required(form.disease) || minLength(2)(form.disease) || maxLength(200)(form.disease);
    e.mobile = required(form.mobile) || isPhone(form.mobile);
    e.email = required(form.email) || isEmail(form.email);
    e.address = required(form.address) || isAddress(form.address);
    e.pincode = required(form.pincode) || pincodeValidation(form.pincode);
    e.city = required(form.city) || onlyLetters(form.city);
    e.state = required(form.state) || onlyLetters(form.state);
    e.country = required(form.country) || onlyLetters(form.country);
    e.occupation = required(form.occupation) || minLength(2)(form.occupation) || maxLength(100)(form.occupation);
    e.nextVisit = required(form.nextVisit) || isDate(form.nextVisit) || isFutureDate(form.nextVisit);
    e.notes = required(form.notes) || minLength(5)(form.notes) || maxLength(1000)(form.notes);

    setErrors(e);
    return Object.values(e).every(v => !v);
  }

  const deletePatient = (index) => {
    const updated = list.filter((_,i) => i !== index);
    setList(updated);
  };

  const handleAddPatient = async ()=>{
    setError("");
    setSuccess("");
    setReminderInfo(null);

    if (!validatePatient()) {
      setError('Please fix errors in the form before submitting.');
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const parseDate = (value)=>{
      if(!value) return null;
      const d = new Date(value);
      d.setHours(0,0,0,0);
      return d;
    };

    const nextVisit = parseDate(form.nextVisit);

    // next appointment: only future dates allowed (not today or past)
    if(nextVisit && !(nextVisit > today)){
      setError("Next appointment must be a future date (no today or past).");
      return;
    }

    const newPatient = {...form, firstVisit: form.firstVisit || new Date().toLocaleString()};
    setList([...list,newPatient]);

    // call backend to send reminder if a next visit is set
    if(nextVisit){
      try{
        const res = await fetch(`http://localhost:4000/api/reminders`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            email:form.email,
            phone:form.mobile,
            patientId: form.id,
            patientName:form.name,
            appointmentDate:form.nextVisit,
          })
        });

        const text = await res.text();
        let data = {};
        if(text){
          try{
            data = JSON.parse(text);
          }catch(parseErr){
            console.warn('Could not parse /api/reminders response as JSON:', parseErr, text);
            data = { message: text || '' };
          }
        }

        if(!res.ok){
          throw new Error(data.error || 'Failed to send reminder');
        }

        setSuccess(data.message || 'Patient saved and reminder queued successfully.');
        setReminderInfo(data.reminders || null);
      }catch(err){
        console.error(err);
        setError(`Patient saved but failed to send reminder. ${err.message || ''}`);
        setReminderInfo(null);
      }
    }else{
      setSuccess("Patient saved successfully.");
      setReminderInfo(null);
    }

    setForm({
      id:"",
      name:"",
      age:"",
      gender:"",
      bloodGroup:"",
      disease:"",
      mobile:"",
      email:"",
      address:"",
      pincode:"",
      city:"",
      state:"",
      country:"",
      occupation:"",
      firstVisit:"",
      nextVisit:"",
      notes:""
    });
  };

  return(
    <div className="page">
      <h2>Patient</h2>
      <p className="subtitle">Register patients (first visit auto-recorded) and fix next appointment with automatic reminders.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {reminderInfo && (
        <div className="alert alert-info" style={{textAlign:'left', padding: '10px'}}>
          <strong>Reminder info:</strong>
          <ul style={{margin:'8px 0 0 16px'}}>
            {reminderInfo.map(r => (
              <li key={r.id || `${r.type}-${r.scheduledFor}`}>
                {r.type} scheduled for {new Date(r.scheduledFor).toLocaleString()} &mdash; {r.sent ? 'sent' : 'pending'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label className="field-label">ID</label>
          <input name="id" placeholder="ID" value={form.id} onChange={handleChange} readOnly title="Automatically generated ID"/>
        </div>

        <div className="form-group">
          <label className="field-label">Name</label>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange}/>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Age</label>
          <input name="age" placeholder="Age" value={form.age} onChange={handleChange}/>
          {errors.age && <span className="field-error">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="field-error">{errors.gender}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Blood Group</label>
          <input name="bloodGroup" placeholder="Blood Group" value={form.bloodGroup} onChange={handleChange}/>
          {errors.bloodGroup && <span className="field-error">{errors.bloodGroup}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Disease / Complaint</label>
          <input name="disease" placeholder="Disease / Complaint" value={form.disease} onChange={handleChange}/>
          {errors.disease && <span className="field-error">{errors.disease}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Mobile</label>
          <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange}/>
          {errors.mobile && <span className="field-error">{errors.mobile}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Email</label>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Address</label>
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange}/>
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Pincode</label>
          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange}/>
          {errors.pincode && <span className="field-error">{errors.pincode}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">City</label>
          <input name="city" placeholder="City" value={form.city} onChange={handleChange}/>
          {errors.city && <span className="field-error">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">State</label>
          <input name="state" placeholder="State" value={form.state} onChange={handleChange}/>
          {errors.state && <span className="field-error">{errors.state}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Country</label>
          <input name="country" placeholder="Country" value={form.country} onChange={handleChange}/>
          {errors.country && <span className="field-error">{errors.country}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Occupation</label>
          <input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange}/>
          {errors.occupation && <span className="field-error">{errors.occupation}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">First Visit (auto)</label>
          <input name="firstVisit" type="text" value={form.firstVisit} disabled style={{backgroundColor:'#e9f7ff'}} />
        </div>

        <div className="form-group">
          <label className="field-label">Next Appointment (future dates only)</label>
          <input name="nextVisit" type="date" value={form.nextVisit} onChange={handleChange}/>
          {errors.nextVisit && <span className="field-error">{errors.nextVisit}</span>}
        </div>

        <div className="form-group" style={{gridColumn:'1/-1'}}>
          <label className="field-label">Notes</label>
          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} rows={3}></textarea>
          {errors.notes && <span className="field-error">{errors.notes}</span>}
        </div>
      </div>

      <button className="btn primary" onClick={handleAddPatient}>Save & Send Reminder</button>

      <h3 className="section-title">Registered Patients</h3>
      {list.length===0 && <p className="muted">No patients added yet.</p>}
      <ul className="patient-list">
        {list.map((p,i)=>(
          <li key={i} className="patient-item">
            <div className="patient-main">
              <span className="patient-name">{p.name}</span>
              <span className="patient-contact">{p.mobile} · {p.email}</span>
            </div>
            <div className="patient-meta">
              {p.firstVisit && <span>First: {p.firstVisit}</span>}
              {p.nextVisit && <span>Next: {p.nextVisit}</span>}
              {isAdmin && <button className="btn" onClick={() => deletePatient(i)} style={{marginLeft:'8px',padding:'4px 8px',fontSize:'12px'}}>Delete</button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
/* THERAPY */
function Therapy({isAdmin}){

  const treatments = [
    { id: 1, name: 'Vamana (Therapeutic Emesis)' },
    { id: 2, name: 'Virechana (Purgation Therapy)' },
    { id: 3, name: 'Basti (Enema Therapy)' },
    { id: 4, name: 'Nasya (Nasal Administration)' },
    { id: 5, name: 'Raktamokshana (Bloodletting Therapy)' },
  ];

  const [form, setForm] = useState({
    id:"",
    patient: "",
    therapy: "",
    duration: "",
    cost: "",
    date: "",
    time: "",
    notes: "",
    therapist: "",
    mobile: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [list, setList] = useState([]);

  useEffect(()=>{setList(JSON.parse(localStorage.getItem("therapies"))||[])},[]);
  useEffect(()=>{localStorage.setItem("therapies",JSON.stringify(list))},[list]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const schedule = () => {
    setError(""); setSuccess("");
    if(!form.patient || !form.therapy || !form.date || !form.time || !form.therapist){
      setError("Please fill Patient, Therapy, Date, Time and Therapist.");
      return;
    }
    if(form.cost){
      const c = parseFloat(form.cost);
      if(isNaN(c) || c < 0){ setError("Cost must be a non-negative number."); return; }
    }

    const newEntry = {...form, id: Date.now()};
    setList([...list, newEntry]);

    // auto allocate doctor & therapist for this therapy
    const assignments = JSON.parse(localStorage.getItem("doctorAssignments")) || [];
    assignments.push({
      doctor:"Dr. Ayurveda",
      patient:newEntry.patient,
      therapy:newEntry.therapy,
      therapist:newEntry.therapist,
      date:newEntry.date,
      time:newEntry.time
    });
    localStorage.setItem("doctorAssignments",JSON.stringify(assignments));

    setSuccess("Therapy scheduled, doctor & therapist allocated.");

    setForm({
      id:"",
      patient:"",
      therapy: "",
      duration: "",
      cost: "",
      date: "",
      time: "",
      notes: "",
      therapist: "",
      mobile: ""
    });
  };

  const deleteTherapy = (index) => {
    const updated = list.filter((_,i) => i !== index);
    setList(updated);
  };

  return(
    <div className="page">
      <h2>Therapy</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <select name="therapy" value={form.therapy} onChange={handleChange}>
        <option value="">Select Therapy</option>
        {treatments.map(t => (
          <option key={t.id} value={t.name}>{t.name}</option>
        ))}
      </select>
      <input name="patient" placeholder="Patient" value={form.patient} onChange={handleChange}/>
      <input name="duration" placeholder="Duration" value={form.duration} onChange={handleChange}/>
      <input name="cost" placeholder="Cost" value={form.cost} onChange={handleChange}/>
      <input type="date" name="date" value={form.date} onChange={handleChange}/>
      <input type="time" name="time" value={form.time} onChange={handleChange}/>
      <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange}/>
      <input name="therapist" placeholder="Therapist" value={form.therapist} onChange={handleChange}/>
      <input name="mobile" placeholder="Therapist Mobile" value={form.mobile} onChange={handleChange}/>

      <button className="btn" onClick={schedule}>Schedule</button>

      {list.map((x,i)=>(
        <p key={i}>
          {x.therapy} | {x.patient} | {x.date} {x.time}
          {isAdmin && <button className="btn" onClick={() => deleteTherapy(i)} style={{marginLeft:'8px',padding:'4px 8px',fontSize:'12px'}}>Delete</button>}
        </p>
      ))}
    </div>
  )
}

/* DOCTOR */
function Doctor({isAdmin}){
  const [doctor,setDoctor]=useState("");
  const [patient,setPatient]=useState("");
  const [list,setList]=useState([]);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  useEffect(()=>{
    setList(JSON.parse(localStorage.getItem("doctorAssignments"))||[]);
  },[]);

  useEffect(()=>{
    localStorage.setItem("doctorAssignments",JSON.stringify(list));
  },[list]);

  const saveAssignment = () => {
    setError(""); setSuccess("");
    if(!doctor || !patient){
      setError("Doctor and Patient are required to save an allocation.");
      return;
    }
    setList([...list,{doctor,patient}]);
    setDoctor("");
    setPatient("");
    setSuccess("Assignment saved.");
  };

  const deleteDoctor = (index) => {
    const updated = list.filter((_,i) => i !== index);
    setList(updated);
  };

  return(
    <div className="page">
      <h2>Doctor Prescription</h2>
      <p className="subtitle">View automatic allocations from Therapy or manually link doctor and patient.</p>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="form-grid">
        <div className="form-group">
          <label className="field-label">Doctor Name</label>
          <input placeholder="Doctor Name" value={doctor} onChange={e=>setDoctor(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="field-label">Patient Name</label>
          <input placeholder="Patient Name" value={patient} onChange={e=>setPatient(e.target.value)}/>
        </div>
      </div>
      <button className="btn primary" onClick={saveAssignment}>Save Allocation</button>
      <h3 className="section-title">Doctor → Patient</h3>
      {list.length===0 && <p className="muted">No doctor allocations yet.</p>}
      {list.map((x,i)=><p key={i}>{x.doctor} → {x.patient} {isAdmin && <button className="btn" onClick={() => deleteDoctor(i)} style={{marginLeft:'8px',padding:'4px 8px',fontSize:'12px'}}>Delete</button>}</p>)}
    </div>
  )
}

/* STOCK */
function Stock({isAdmin}){
  const [med,setMed]=useState("");
  const [qty,setQty]=useState("");
  const [list,setList]=useState([]);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  useEffect(()=>{setList(JSON.parse(localStorage.getItem("stock"))||[])},[]);
  useEffect(()=>{localStorage.setItem("stock",JSON.stringify(list))},[list]);

  const addMedicine = () => {
    setError(""); setSuccess("");
    if(!med){ setError("Medicine name is required."); return; }
    const quantity = parseInt(qty,10);
    if(isNaN(quantity) || quantity <= 0){ setError("Qty must be a positive integer."); return; }

    const existingIndex = list.findIndex(x=>x.med.toLowerCase()===med.toLowerCase());
    let updated = [...list];
    if(existingIndex>=0){
      updated[existingIndex] = {...updated[existingIndex], qty:(parseInt(updated[existingIndex].qty,10)||0)+quantity};
    }else{
      updated.push({med,qty:quantity});
    }
    setList(updated);
    setMed("");
    setQty("");
    setSuccess("Stock updated successfully.");
  };

  const deleteMedicine = (index) => {
    const updated = list.filter((_,i) => i !== index);
    setList(updated);
  };

  return(
    <div className="page">
      <h2>Medicine Stock</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="form-grid">
        <div className="form-group">
          <label className="field-label">Medicine</label>
          <input placeholder="Medicine" value={med} onChange={e=>setMed(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="field-label">Qty</label>
          <input placeholder="Qty" value={qty} onChange={e=>setQty(e.target.value)}/>
        </div>
      </div>
      <button className="btn primary" onClick={addMedicine}>Add / Update Stock</button>
      {list.map((x,i)=><p key={i}>{x.med} - {x.qty} {isAdmin && <button className="btn" onClick={() => deleteMedicine(i)} style={{marginLeft:'8px',padding:'4px 8px',fontSize:'12px'}}>Delete</button>}</p>)}
    </div>
  )
} 

/* BILLING */
function Billing(){
  const [patient,setPatient]=useState("");
  const [therapy,setTherapy]=useState("");
  const [therapyCost,setTherapyCost]=useState("");
  const [medicine,setMedicine]=useState("");
  const [medicineCost,setMedicineCost]=useState("");
  const [total,setTotal]=useState(0);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  const generateBill = async ()=>{
    setError(""); setSuccess("");
    if(!patient){ setError("Patient is required to generate a bill."); return; }
    const tCost = parseFloat(therapyCost);
    if(isNaN(tCost) || tCost < 0){ setError("Therapy cost must be a non-negative number."); return; }
    const mCost = parseFloat(medicineCost);
    if(isNaN(mCost) || mCost < 0){ setError("Medicine cost must be a non-negative number."); return; }

    const sum = tCost + mCost;
    setTotal(sum);

    // reduce stock for the medicine by 1 unit
    if(medicine){
      const stock = JSON.parse(localStorage.getItem("stock"))||[];
      const idx = stock.findIndex(x=>x.med.toLowerCase()===medicine.toLowerCase());
      if(idx>=0){
        const currentQty = parseInt(stock[idx].qty,10)||0;
        const newQty = currentQty - 1;
        stock[idx].qty = newQty;
        localStorage.setItem("stock",JSON.stringify(stock));

        // if stock low, trigger vendor order
        if(newQty <= 50 && newQty >= 0){
          try{
            await fetch("http://localhost:4000/api/vendor-orders",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({medicine:stock[idx].med,currentQty:newQty})
            });
            setSuccess(`Bill generated. Stock low for ${stock[idx].med}, vendor order sent.`);
          }catch(err){
            console.error(err);
            setError(`Bill generated. Stock low for ${stock[idx].med}, but vendor order failed.`);
          }
          // persist bill even if vendor order path was used
          try{
            const bills = JSON.parse(localStorage.getItem('bills'))||[];
            bills.push({patient,therapy,medicine,total:sum});
            localStorage.setItem('bills',JSON.stringify(bills));
          }catch(e){console.error(e)}
          return;
        }
      }
    }

    setSuccess("Bill generated successfully.");
    // persist bill for admin view
    try{
      const bills = JSON.parse(localStorage.getItem('bills'))||[];
      bills.push({patient,therapy,medicine,total:sum});
      localStorage.setItem('bills',JSON.stringify(bills));
    }catch(e){console.error(e)}
  };

  return(
    <div className="page">
      <h2>Billing</h2>
      <p className="subtitle">Generate bill from therapy and medicine cost. Stock updates automatically.</p>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="form-grid">
        <div className="form-group">
          <label className="field-label">Patient Name</label>
          <input placeholder="Patient Name" value={patient} onChange={e=>setPatient(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="field-label">Therapy</label>
          <input placeholder="Therapy" value={therapy} onChange={e=>setTherapy(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="field-label">Therapy Cost</label>
          <input placeholder="Therapy Cost" value={therapyCost} onChange={e=>setTherapyCost(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="field-label">Medicine</label>
          <input placeholder="Medicine" value={medicine} onChange={e=>setMedicine(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="field-label">Medicine Cost</label>
          <input placeholder="Medicine Cost" value={medicineCost} onChange={e=>setMedicineCost(e.target.value)}/>
        </div>
      </div>
      <button className="btn primary" onClick={generateBill}>Generate Bill</button>
      <button className="btn" style={{marginLeft:"8px"}} onClick={()=>window.print()}>Print Bill</button>

      <h3 className="section-title">Bill Summary</h3>
      <p className="muted">Patient: {patient || "-"}</p>
      <p className="muted">Therapy: {therapy || "-"} (₹{therapyCost || 0})</p>
      <p className="muted">Medicine: {medicine || "-"} (₹{medicineCost || 0})</p>
      <h2>₹{total}</h2>
    </div>
  )
}

/* REPORTS */
function Reports(){
  const [view, setView] = useState("main");
  const [reports, setReports] = useState(JSON.parse(localStorage.getItem("reports")) || []);
  const [patients, setPatients] = useState(JSON.parse(localStorage.getItem("patients")) || []);
  const [searchPatientId, setSearchPatientId] = useState("");
  const [searchPatientName, setSearchPatientName] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Save reports to localStorage
  const saveReports = (data) => {
    localStorage.setItem("reports", JSON.stringify(data));
    setReports(data);
  };

  // Validate patient exists in registration
  const validatePatient = (patientId, patientName) => {
    const patient = patients.find(p => 
      (patientId && p.id === patientId) || 
      (patientName && p.name.toLowerCase() === patientName.toLowerCase())
    );
    return patient;
  };

  // Search reports
  const handleSearch = () => {
    if (!searchPatientId && !searchPatientName) {
      alert("Please enter Patient ID or Patient Name");
      return;
    }

    // Validate patient exists in registration
    const validPatient = validatePatient(searchPatientId, searchPatientName);
    if (!validPatient) {
      alert("Patient not found in registration. Please register patient first.");
      return;
    }

    const result = reports.find(r => 
      (searchPatientId && r.patientId === searchPatientId) ||
      (searchPatientName && r.patientName.toLowerCase() === searchPatientName.toLowerCase())
    );
    if (result) {
      setSearchResult(result);
      setView("view");
    } else {
      alert("No report found for this registered patient");
      setSearchResult(null);
    }
  };

  if (view === "main") {
    return (
      <div className="page">
        <h2>Reports Management</h2>
        <div className="button-group" style={{ marginBottom: "20px" }}>
          <button className="btn primary" onClick={() => setView("add")}>➕ Add Report</button>
          <button className="btn primary" onClick={() => setView("search")}>🔍 View Report</button>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h3>Total Reports: {reports.length}</h3>
          <table style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Therapist</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <tr key={idx}>
                  <td>{report.patientId}</td>
                  <td>{report.patientName}</td>
                  <td>{report.doctor}</td>
                  <td>{report.therapist}</td>
                  <td>{report.date}</td>
                  <td>
                    <button className="btn small" onClick={() => {
                      setSearchResult(report);
                      setView("view");
                    }} style={{ marginRight: "5px" }}>View</button>
                    <button className="btn small" onClick={() => {
                      setSearchResult(report);
                      setView("edit");
                    }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === "add") {
    return <AddReport setView={setView} reports={reports} saveReports={saveReports} />;
  }

  if (view === "search") {
    return (
      <div className="page">
        <button className="btn" onClick={() => setView("main")} style={{ marginBottom: "15px" }}>← Back</button>
        <h2>Search Report</h2>
        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Select Registered Patient:</label>
            <select 
              onChange={(e) => {
                const patient = patients.find(p => p.id === e.target.value);
                if (patient) {
                  setSearchPatientId(patient.id);
                  setSearchPatientName(patient.name);
                }
              }}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">-- Or Search Manually --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Patient ID:</label>
            <input 
              type="text"
              placeholder="Enter Patient ID"
              value={searchPatientId}
              onChange={(e) => setSearchPatientId(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Patient Name:</label>
            <input 
              type="text"
              placeholder="Enter Patient Name"
              value={searchPatientName}
              onChange={(e) => setSearchPatientName(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <button className="btn primary" onClick={handleSearch}>Search</button>
        </div>
        {searchResult && (
          <div>
            <button className="btn small" onClick={() => setView("view")} style={{ marginBottom: "15px", marginRight: "5px" }}>View</button>
            <button className="btn small" onClick={() => setView("edit")} style={{ marginBottom: "15px" }}>Edit</button>
          </div>
        )}
      </div>
    );
  }

  if (view === "view") {
    return <ViewReport setView={setView} report={searchResult} />;
  }

  if (view === "edit") {
    return <EditReport setView={setView} report={searchResult} reports={reports} saveReports={saveReports} />;
  }
}

/* ADD REPORT COMPONENT */
function AddReport({setView, reports, saveReports}){
  const patients = JSON.parse(localStorage.getItem("patients")) || [];
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const therapies = JSON.parse(localStorage.getItem("therapies")) || [];

  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    doctor: "",
    therapist: "",
    date: new Date().toISOString().split('T')[0],
    visitTime: "",
    visitType: "Follow-up",
    therapiesConducted: "",
    treatmentDuration: "",
    vitalSigns: "",
    preVisitCondition: "",
    presentCondition: "",
    reportNotes: "",
    medicines: []
  });

  const [medicineInput, setMedicineInput] = useState("");

  const handlePatientSelect = (e) => {
    const selectedPatient = patients.find(p => p.id === e.target.value);
    if (selectedPatient) {
      setForm({
        ...form,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name
      });
    }
  };

  const handleAddMedicine = () => {
    if (medicineInput.trim()) {
      setForm({
        ...form,
        medicines: [...form.medicines, medicineInput]
      });
      setMedicineInput("");
    }
  };

  const handleRemoveMedicine = (idx) => {
    setForm({
      ...form,
      medicines: form.medicines.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = () => {
    if (!form.patientId || !form.patientName || !form.doctor || !form.therapist || !form.date) {
      alert("Please fill in all required fields");
      return;
    }
    
    const newReport = {
      ...form,
      id: Date.now()
    };
    
    saveReports([...reports, newReport]);
    alert("Report added successfully!");
    setView("main");
  };

  return (
    <div className="page">
      <button className="btn" onClick={() => setView("main")} style={{ marginBottom: "15px" }}>← Back</button>
      <h2>Add New Report</h2>
      
      <div className="form-group">
        <label>Select Patient *</label>
        <select 
          value={form.patientId}
          onChange={handlePatientSelect}
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="">-- Choose a Registered Patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} - {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Patient ID (Auto-populated)</label>
        <input 
          type="text"
          value={form.patientId}
          disabled
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      <div className="form-group">
        <label>Patient Name (Auto-populated)</label>
        <input 
          type="text"
          value={form.patientName}
          disabled
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      <div className="form-group">
        <label>Doctor Name *</label>
        <input 
          type="text"
          placeholder="Assign Doctor"
          value={form.doctor}
          onChange={(e) => setForm({...form, doctor: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Therapist Name *</label>
        <input 
          type="text"
          placeholder="Assign Therapist"
          value={form.therapist}
          onChange={(e) => setForm({...form, therapist: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Date *</label>
        <input 
          type="date"
          value={form.date}
          onChange={(e) => setForm({...form, date: e.target.value})}
        />
      </div>

      {/* VISIT DETAILS SECTION */}
      <div style={{ backgroundColor: "#f0f7ff", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
        <h3 style={{ marginTop: "0", marginBottom: "15px", color: "#1976d2" }}>📋 Visit Details</h3>
        
        <div className="form-group">
          <label>Visit Time</label>
          <input 
            type="time"
            value={form.visitTime}
            onChange={(e) => setForm({...form, visitTime: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Visit Type</label>
          <select 
            value={form.visitType}
            onChange={(e) => setForm({...form, visitType: e.target.value})}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="Initial">Initial Visit</option>
            <option value="Follow-up">Follow-up Visit</option>
            <option value="Review">Review Visit</option>
            <option value="Checkup">Checkup</option>
          </select>
        </div>

        <div className="form-group">
          <label>Therapies Conducted</label>
          <textarea 
            placeholder="List therapies conducted during this visit (e.g., Abhyanga, Shirodhara, etc.)"
            value={form.therapiesConducted}
            onChange={(e) => setForm({...form, therapiesConducted: e.target.value})}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Treatment Duration</label>
          <input 
            type="text"
            placeholder="e.g., 45 minutes, 1 hour"
            value={form.treatmentDuration}
            onChange={(e) => setForm({...form, treatmentDuration: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Vital Signs & Observations</label>
          <textarea 
            placeholder="Record any vital signs, observations, or patient feedback during visit"
            value={form.vitalSigns}
            onChange={(e) => setForm({...form, vitalSigns: e.target.value})}
            rows={3}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Pre-visit Condition</label>
        <textarea 
          placeholder="Describe patient condition before visit"
          value={form.preVisitCondition}
          onChange={(e) => setForm({...form, preVisitCondition: e.target.value})}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Present Condition</label>
        <textarea 
          placeholder="Describe patient current condition"
          value={form.presentCondition}
          onChange={(e) => setForm({...form, presentCondition: e.target.value})}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Report Notes</label>
        <textarea 
          placeholder="Additional notes about the patient and treatment"
          value={form.reportNotes}
          onChange={(e) => setForm({...form, reportNotes: e.target.value})}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Add Medicines</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input 
            type="text"
            placeholder="Enter medicine name"
            value={medicineInput}
            onChange={(e) => setMedicineInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn primary" onClick={handleAddMedicine}>Add</button>
        </div>
        <div>
          {form.medicines.map((med, idx) => (
            <div key={idx} style={{ 
              backgroundColor: "#e8f5e9", 
              padding: "8px", 
              borderRadius: "4px", 
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>💊 {med}</span>
              <button 
                className="btn small" 
                onClick={() => handleRemoveMedicine(idx)}
                style={{ backgroundColor: "#f44336", color: "white" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button className="btn primary" onClick={handleSubmit} style={{ marginRight: "10px" }}>Save Report</button>
        <button className="btn" onClick={() => setView("main")}>Cancel</button>
      </div>
    </div>
  );
}

/* VIEW REPORT COMPONENT */
function ViewReport({setView, report}){
  if (!report) {
    return <div className="page"><button className="btn" onClick={() => setView("main")}>← Back</button><p style={{marginTop: "20px"}}>No report selected</p></div>;
  }

  return (
    <div className="page">
      <button className="btn" onClick={() => setView("main")} style={{ marginBottom: "15px" }}>← Back</button>
      <h2>View Report</h2>
      
      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
        <div style={{ marginBottom: "15px" }}>
          <strong>Patient ID:</strong> {report.patientId}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Patient Name:</strong> {report.patientName}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Doctor:</strong> {report.doctor}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Therapist:</strong> {report.therapist}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Date:</strong> {report.date}
        </div>
        
        {/* VISIT DETAILS SECTION */}
        <div style={{ backgroundColor: "#e3f2fd", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
          <h3 style={{ marginTop: "0", marginBottom: "12px", color: "#1976d2" }}>📋 Visit Details</h3>
          <div style={{ marginBottom: "10px" }}>
            <strong>Visit Time:</strong> {report.visitTime || "N/A"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Visit Type:</strong> {report.visitType || "N/A"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Therapies Conducted:</strong>
            <p style={{ marginTop: "5px", whiteSpace: "pre-wrap", marginBottom: "0" }}>{report.therapiesConducted || "N/A"}</p>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Treatment Duration:</strong> {report.treatmentDuration || "N/A"}
          </div>
          <div style={{ marginBottom: "0" }}>
            <strong>Vital Signs & Observations:</strong>
            <p style={{ marginTop: "5px", whiteSpace: "pre-wrap", marginBottom: "0" }}>{report.vitalSigns || "N/A"}</p>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Pre-visit Condition:</strong>
          <p style={{ marginTop: "5px", whiteSpace: "pre-wrap" }}>{report.preVisitCondition || "N/A"}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Present Condition:</strong>
          <p style={{ marginTop: "5px", whiteSpace: "pre-wrap" }}>{report.presentCondition || "N/A"}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Report Notes:</strong>
          <p style={{ marginTop: "5px", whiteSpace: "pre-wrap" }}>{report.reportNotes || "N/A"}</p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Medicines:</strong>
          {report.medicines && report.medicines.length > 0 ? (
            <ul style={{ marginTop: "5px" }}>
              {report.medicines.map((med, idx) => (
                <li key={idx}>💊 {med}</li>
              ))}
            </ul>
          ) : (
            <p style={{ marginTop: "5px" }}>No medicines assigned</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button className="btn primary" onClick={() => setView("edit")} style={{ marginRight: "10px" }}>Edit Report</button>
        <button className="btn" onClick={() => setView("main")}>Back to List</button>
      </div>
    </div>
  );
}

/* EDIT REPORT COMPONENT */
function EditReport({setView, report, reports, saveReports}){
  const [form, setForm] = useState(report ? {...report} : {patientId:"", patientName:"", doctor:"", therapist:"", date:"", visitTime:"", visitType:"Follow-up", therapiesConducted:"", treatmentDuration:"", vitalSigns:"", preVisitCondition:"", presentCondition:"", reportNotes:"", medicines:[]});
  const [medicineInput, setMedicineInput] = useState("");
  
  if (!report) {
    return <div className="page"><button className="btn" onClick={() => setView("main")}>← Back</button><p style={{marginTop: "20px"}}>No report selected</p></div>;
  }
  const medicines = form.medicines || [];

  const handleAddMedicine = () => {
    if (medicineInput.trim()) {
      setForm({
        ...form,
        medicines: [...medicines, medicineInput]
      });
      setMedicineInput("");
    }
  };

  const handleRemoveMedicine = (idx) => {
    setForm({
      ...form,
      medicines: medicines.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = () => {
    const updatedReports = reports.map(r => 
      r.id === report.id ? form : r
    );
    saveReports(updatedReports);
    alert("Report updated successfully!");
    setView("main");
  };

  return (
    <div className="page">
      <button className="btn" onClick={() => setView("view")} style={{ marginBottom: "15px" }}>← Back</button>
      <h2>Edit Report</h2>
      
      <div className="form-group">
        <label>Patient ID (Read-only)</label>
        <input 
          type="text"
          value={form.patientId}
          disabled
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      <div className="form-group">
        <label>Patient Name (Read-only)</label>
        <input 
          type="text"
          value={form.patientName}
          disabled
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      <div className="form-group">
        <label>Doctor Name (Read-only)</label>
        <input 
          type="text"
          value={form.doctor}
          disabled
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      <div className="form-group">
        <label>Therapist Name (Read-only)</label>
        <input 
          type="text"
          value={form.therapist}
          disabled
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      <div className="form-group">
        <label>Date (Read-only)</label>
        <input 
          type="date"
          value={form.date}
          disabled
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      {/* VISIT DETAILS SECTION - EDITABLE */}
      <div style={{ backgroundColor: "#f0f7ff", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
        <h3 style={{ marginTop: "0", marginBottom: "15px", color: "#1976d2" }}>📋 Visit Details</h3>
        
        <div className="form-group">
          <label>Visit Time</label>
          <input 
            type="time"
            value={form.visitTime || ""}
            onChange={(e) => setForm({...form, visitTime: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Visit Type</label>
          <select 
            value={form.visitType || "Follow-up"}
            onChange={(e) => setForm({...form, visitType: e.target.value})}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="Initial">Initial Visit</option>
            <option value="Follow-up">Follow-up Visit</option>
            <option value="Review">Review Visit</option>
            <option value="Checkup">Checkup</option>
          </select>
        </div>

        <div className="form-group">
          <label>Therapies Conducted</label>
          <textarea 
            placeholder="List therapies conducted during this visit"
            value={form.therapiesConducted || ""}
            onChange={(e) => setForm({...form, therapiesConducted: e.target.value})}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Treatment Duration</label>
          <input 
            type="text"
            placeholder="e.g., 45 minutes, 1 hour"
            value={form.treatmentDuration || ""}
            onChange={(e) => setForm({...form, treatmentDuration: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Vital Signs & Observations</label>
          <textarea 
            placeholder="Record vital signs, observations, or patient feedback"
            value={form.vitalSigns || ""}
            onChange={(e) => setForm({...form, vitalSigns: e.target.value})}
            rows={3}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Pre-visit Condition</label>
        <textarea 
          placeholder="Describe patient condition before visit"
          value={form.preVisitCondition}
          onChange={(e) => setForm({...form, preVisitCondition: e.target.value})}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Present Condition</label>
        <textarea 
          placeholder="Describe patient current condition"
          value={form.presentCondition}
          onChange={(e) => setForm({...form, presentCondition: e.target.value})}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Report Notes</label>
        <textarea 
          placeholder="Additional notes about the patient and treatment"
          value={form.reportNotes}
          onChange={(e) => setForm({...form, reportNotes: e.target.value})}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Add New Medicines (Previous medicines cannot be removed)</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input 
            type="text"
            placeholder="Enter medicine name"
            value={medicineInput}
            onChange={(e) => setMedicineInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn primary" onClick={handleAddMedicine}>Add</button>
        </div>
        <div>
          {medicines.map((med, idx) => (
            <div key={idx} style={{ 
              backgroundColor: "#e8f5e9", 
              padding: "8px", 
              borderRadius: "4px", 
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>💊 {med}</span>
              <span style={{ color: "#999", fontSize: "12px" }}>(Cannot be removed)</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button className="btn primary" onClick={handleSubmit} style={{ marginRight: "10px" }}>Save Changes</button>
        <button className="btn" onClick={() => setView("view")}>Cancel</button>
      </div>
    </div>
  );
}

/* ADMIN */
function Admin(){
  const [auth,setAuth]=useState(false);
  const [user,setUser]=useState("");
  const [pass,setPass]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = JSON.parse(localStorage.getItem("patients"))||[];
  const therapies = JSON.parse(localStorage.getItem("therapies"))||[];
  const doctors = JSON.parse(localStorage.getItem("doctorAssignments"))||[];
  const stock = JSON.parse(localStorage.getItem("stock"))||[];
  const bills = JSON.parse(localStorage.getItem("bills"))||[];

  const login = ()=>{
    if(user === "Aparna" && pass === "SGA@2006") setAuth(true);
    else alert("Invalid admin credentials");
  };

  if(!auth) return (
    <div className="page">
      <h2>Admin Login</h2>
      <input placeholder="Admin" value={user} onChange={e=>setUser(e.target.value)}/>
      <div style={{position:'relative',marginBottom:'6px'}}>
        <input placeholder="Password" type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%'}}/>
        <button onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'18px'}}>{showPass?'🙈':'🙊 '}</button>
      </div>
      <button className="btn primary" onClick={login}>Login</button>
      <p className="muted">Admin: Aparna / SGA@2006</p>
    </div>
  );

  return(
    <div className="page">
      <h2>Admin Dashboard</h2>
      <h3 className="section-title">Patients</h3>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Mobile</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody>
          {patients.map((p,i)=>(
            <tr key={i}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.mobile}</td>
              <td>{p.email}</td>
              <td><button className="btn" onClick={() => setSelectedPatient(p)}>Open</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="section-title">Therapies</h3>
      <table>
        <thead><tr><th>Therapy</th><th>Patient</th><th>Date</th><th>Time</th></tr></thead>
        <tbody>
          {therapies.map((t,i)=>(<tr key={i}><td>{t.therapy}</td><td>{t.patient}</td><td>{t.date}</td><td>{t.time}</td></tr>))}
        </tbody>
      </table>

      <h3 className="section-title">Doctor Allocations</h3>
      <table table>
        <thead><tr><th>Doctor</th><th>Patient</th></tr></thead>
        <tbody>
          {doctors.map((d,i)=>(<tr key={i}><td>{d.doctor}</td><td>{d.therapy}</td><td>{d.patient}</td></tr>))}
        </tbody>
      </table>

      <h3 className="section-title">Stock</h3>
      <table>
        <thead><tr><th>Medicine</th><th>Qty</th></tr></thead>
        <tbody>
          {stock.map((s,i)=>(<tr key={i}><td>{s.med}</td><td>{s.qty}</td></tr>))}
        </tbody>
      </table>

      <h3 className="section-title">Bills</h3>
      <table>
        <thead><tr><th>Patient</th><th>Therapy</th><th>Medicine</th><th>Total</th></tr></thead>
        <tbody>
          {bills.map((b,i)=>(<tr key={i}><td>{b.patient}</td><td>{b.therapy}</td><td>{b.medicine}</td><td>{b.total}</td></tr>))}
        </tbody>
      </table>
      {selectedPatient && (
        <div className="card" style={{marginTop:16}}>
          <h3>Patient Details</h3>
          <p><strong>ID:</strong> {selectedPatient.id || '-'}</p>
          <p><strong>Name:</strong> {selectedPatient.name || '-'}</p>
          <p><strong>Age:</strong> {selectedPatient.age || '-'}</p>
          <p><strong>Gender:</strong> {selectedPatient.gender || '-'}</p>
          <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup || '-'}</p>
          <p><strong>Disease / Complaint:</strong> {selectedPatient.disease || '-'}</p>
          <p><strong>Mobile:</strong> {selectedPatient.mobile || '-'}</p>
          <p><strong>Email:</strong> {selectedPatient.email || '-'}</p>
          <p><strong>Address:</strong> {selectedPatient.address || '-'}, {selectedPatient.city || '-'} {selectedPatient.pincode || ''}</p>
          <p><strong>State / Country:</strong> {selectedPatient.state || '-'} / {selectedPatient.country || '-'}</p>
          <p><strong>Occupation:</strong> {selectedPatient.occupation || '-'}</p>
          <p><strong>First Visit:</strong> {selectedPatient.firstVisit || '-'}</p>
          <p><strong>Next Visit:</strong> {selectedPatient.nextVisit || '-'}</p>
          <p><strong>Notes:</strong> {selectedPatient.notes || '-'}</p>
          <button className="btn" onClick={() => setSelectedPatient(null)}>Close</button>
        </div>
      )}
    </div>
  )
}

/* REMINDERS PAGE */
function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/reminders');
      const text = await response.text();
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.warn('Could not parse reminders response JSON:', parseErr, text);
          data = { reminders: [] };
        }
      }

      if (response.ok) {
        setReminders((data && data.reminders) || []);
        setError('');
      } else {
        setReminders([]);
        setError((data && data.error) || 'Failed to fetch reminders');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReminders = () => {
    if (filter === 'sent') return reminders.filter(r => r.sent);
    if (filter === 'pending') return reminders.filter(r => !r.sent);
    return reminders;
  };

  const getStatusBadge = (reminder) => {
    const now = new Date();
    const scheduledFor = new Date(reminder.scheduledFor);
    
    if (reminder.sent) {
      return <span style={{color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold'}}>✓ SENT</span>;
    } else if (scheduledFor > now) {
      return <span style={{color: '#f59e0b', fontSize: '0.85rem', fontWeight: 'bold'}}>⏰ PENDING</span>;
    } else {
      return <span style={{color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold'}}>✗ FAILED</span>;
    }
  };

  return (
    <div className="page">
      <div style={{ marginBottom: '20px' }}>
        <h2>📬 Appointment Reminders</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Total: {reminders.length} | Sent: {reminders.filter(r => r.sent).length} | Pending: {reminders.filter(r => !r.sent).length}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'all' ? '#0f766e' : '#e2e8f0',
            color: filter === 'all' ? 'white' : '#0f172a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: filter === 'all' ? 'bold' : 'normal'
          }}
        >
          All ({reminders.length})
        </button>
        <button
          onClick={() => setFilter('sent')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'sent' ? '#10b981' : '#e2e8f0',
            color: filter === 'sent' ? 'white' : '#0f172a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Sent ({reminders.filter(r => r.sent).length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'pending' ? '#f59e0b' : '#e2e8f0',
            color: filter === 'pending' ? 'white' : '#0f172a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Pending ({reminders.filter(r => !r.sent).length})
        </button>
        <button
          onClick={fetchReminders}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '12px',
          color: '#991b1b',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          ⏳ Loading reminders...
        </div>
      ) : getFilteredReminders().length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          📭 No reminders
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f0f9f8',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Patient</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Appointment</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Scheduled</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredReminders().map((reminder) => (
                <tr
                  key={reminder._id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: reminder.sent ? '#f0fdf4' : '#fefce8'
                  }}
                >
                  <td style={{ padding: '12px' }}><strong>{reminder.patientName}</strong></td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>{reminder.email || '—'}</td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>{reminder.phone || '—'}</td>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>{new Date(reminder.appointmentDate).toLocaleString()}</td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>{new Date(reminder.scheduledFor).toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{getStatusBadge(reminder)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f0f9f8',
        borderRadius: '8px',
        borderLeft: '4px solid #0f766e'
      }}>
        <h3 style={{ marginTop: 0 }}>📋 How it Works</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Reminders are automatically scheduled when you create a patient with a next visit date</li>
          <li>Two reminders per appointment: Immediate + 24 hours before</li>
          <li>Notifications sent via: Email + Telegram + Browser</li>
          <li>Page refreshes every 30 seconds automatically</li>
        </ul>
      </div>
    </div>
  )
}