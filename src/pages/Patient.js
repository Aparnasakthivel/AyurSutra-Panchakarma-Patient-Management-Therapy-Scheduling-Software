import React, {useState} from 'react';
import FormInput from '../components/FormInput';
import { required, isEmail, isPhone, isNumber, minValue, maxValue, minLength, maxLength, onlyLetters, pincodeValidation, runValidators } from '../validation/validators';

const countryData = {
  'India': {
    'states': {
      'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Tirupati', 'Rajahmundry', 'Nellore', 'Kadapa', 'Anantapur', 'Tenali', 'Guntur'],
      'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Ziro'],
      'Assam': ['Guwahati', 'Silchar', 'Dibrughar', 'Nagaon', 'Tinsukia', 'Barpeta', 'Golaghat', 'Bongaigaon'],
      'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Arrah', 'Purnia', 'Saharsa'],
      'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Korba'],
      'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Junagadh', 'Jamnagar', 'Anand', 'Kutch'],
      'Haryana': ['Gurgaon', 'Hisar', 'Rohtak', 'Faridabad', 'Panchkula', 'Ambala', 'Yamunanagar', 'Karnal'],
      'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Kangra', 'Kullu', 'Palampur', 'Rampur'],
      'Jharkhand': ['Ranchi', 'Dhanbad', 'Giridih', 'East Singhbhum', 'Hazaribagh', 'Koderma'],
      'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubballi', 'Belgaum', 'Davanagere', 'Shimoga', 'Gulbarga', 'Kolar'],
      'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Ernakulam', 'Thrissur', 'Pathanamthitta', 'Alappuzha'],
      'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ratlam', 'Khargone', 'Manjhanpur', 'Ujjain'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Ahmednagar'],
      'Manipur': ['Imphal', 'Bishnupur', 'Thoubal', 'Senapati'],
      'Meghalaya': ['Shillong', 'Tura', 'Nongpoh', 'Jowai'],
      'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai'],
      'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Wokha'],
      'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Balasore', 'Berhampur', 'Dhenkanal'],
      'Punjab': ['Chandigarh', 'Philadelphia', 'Amritsar', 'Jalandhar', 'Ludhiana', 'Patiala', 'Bathinda'],
      'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Ajmer', 'Kota', 'Bikaner', 'Alwar', 'Mount Abu'],
      'Sikkim': ['Gangtok', 'Namchi', 'Pelling', 'Mangan'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Erode', 'Thanjavur'],
      'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Ramagundam'],
      'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Ambassa'],
      'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Ghaziabad', 'Noida', 'Meerut', 'Agra', 'Indore', 'Allahabad'],
      'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Almora', 'Nainital', 'Mussoorie'],
      'West Bengal': ['Kolkata', 'Darjeeling', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Hooghly'],
      'Delhi': ['New Delhi', 'Delhi', 'East Delhi', 'West Delhi', 'North Delhi', 'South Delhi'],
      'Ladakh': ['Leh', 'Kargil'],
      'Puducherry': ['Puducherry', 'Yanam', 'Karaikal', 'Mahe'],
      'Lakshadweep': ['Kavaratti', 'Agatti'],
      'Andaman and Nicobar Islands': ['Port Blair', 'Car Nicobar', 'Campbell Bay'],
      'Chandigarh': ['Chandigarh', 'Panchkula', 'Mohali'],
      'Dadar and Nagar Haveli': ['Silvassa', 'Nagar Haveli'],
      'Daman and Diu': ['Daman', 'Diu']
    }
  }
};

export default function Patient(){
  const [form, setForm] = useState({
    name:'', email:'', phone:'', dob:'', age:'', gender:'', bloodGroup:'', address:'', country:'India', state:'', city:'', pincode:'', medicalHistory:'', allergies:'', nextVisitDate:'', nextVisitTime:'', status:'Active'
  });
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const onChange = (name, value) => {
    setForm(f=>({ ...f, [name]: value }));
    
    if(name === 'country') {
      const countryStates = countryData[value]?.states ? Object.keys(countryData[value].states) : [];
      setStates(countryStates);
      setCities([]);
      setForm(f=>({ ...f, [name]: value, state: '', city: '' }));
    }
    
    if(name === 'state') {
      const stateCities = countryData[form.country]?.states[value] || [];
      setCities(stateCities);
      setForm(f=>({ ...f, [name]: value, city: '' }));
    }
  };

  const validate = () => {
    const e = {};
    e.name = runValidators(form.name, [required, minLength(2), maxLength(253), onlyLetters]);
    e.email = runValidators(form.email, [required, isEmail]);
    e.phone = runValidators(form.phone, [required, isPhone]);
    e.dob = runValidators(form.dob, [required]);
    e.age = runValidators(form.age, [required, isNumber, minValue(1), maxValue(100)]);
    e.gender = runValidators(form.gender, [required]);
    e.bloodGroup = runValidators(form.bloodGroup, [required]);
    e.address = runValidators(form.address, [required]);
    e.country = runValidators(form.country, [required]);
    e.state = runValidators(form.state, [required]);
    e.city = runValidators(form.city, [required]);
    e.pincode = runValidators(form.pincode, [required, pincodeValidation]);
    e.nextVisitDate = runValidators(form.nextVisitDate, []);
    e.nextVisitTime = runValidators(form.nextVisitTime, []);
    // optional fields
    e.medicalHistory = runValidators(form.medicalHistory, []);
    e.allergies = runValidators(form.allergies, []);
    e.status = runValidators(form.status, [required]);
    setErrors(e);
    return Object.values(e).every(x=>!x);
  }

  const submit = async (ev) =>{
    ev.preventDefault();
    if(!validate()) return;
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Failed to create patient'); return; }

      const patient = data.patient || data;
      alert('✅ Patient created successfully!');

      // Schedule reminders if next visit provided
      if (form.nextVisitDate && form.email) {
        const datePart = form.nextVisitDate;
        const timePart = form.nextVisitTime || '09:00';
        const appointmentDate = new Date(`${datePart}T${timePart}:00`);
        
        try {
          console.log('Scheduling reminders for:', {
            patientName: form.name,
            email: form.email,
            phone: form.phone,
            appointmentDate: appointmentDate.toISOString()
          });

          const reminderRes = await fetch('http://localhost:4000/api/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: form.email,
              phone: form.phone,
              patientId: patient._id || patient.id,
              patientName: form.name,
              appointmentDate: appointmentDate.toISOString()
            })
          });

          const reminderData = await reminderRes.json();
          
          if (!reminderRes.ok) {
            console.error('❌ Reminder API failed:', reminderRes.status, reminderData);
            alert('⚠️ Patient created, but reminders failed to schedule:\n' + (reminderData.error || 'Unknown error'));
          } else {
            console.log('✅ Reminders scheduled:', reminderData);
            alert('✅ Patient created and reminders scheduled!\n\n📧 Email: ' + form.email + '\n📞 Phone: ' + (form.phone || 'Not provided') + '\n📅 Appointment: ' + appointmentDate.toLocaleString());
          }
        } catch (err) {
          console.error('❌ Failed to schedule reminder:', err);
          alert('⚠️ Patient created, but reminder scheduling failed. Check console for details.');
        }
      } else if (form.nextVisitDate && !form.email) {
        alert('✅ Patient created but reminders require an email address.');
      }

      // Reset form
      setForm({
        name: '', email: '', phone: '', dob: '', age: '', gender: '', bloodGroup: '', 
        address: '', country: 'India', state: '', city: '', pincode: '', 
        medicalHistory: '', allergies: '', nextVisitDate: '', nextVisitTime: '', status: 'Active'
      });
      setErrors({});
    } catch (err) {
      console.error('Network error:', err);
      alert('❌ Network error: ' + err.message);
    }
  }

  return (
    <div className="page">
      <h2>Create Patient</h2>
      <form onSubmit={submit}>
        <FormInput label="Full name" name="name" value={form.name} onChange={onChange} error={errors.name} placeholder="Min 2 letters, max 253 chars" />
        <FormInput label="Date of Birth *" name="dob" value={form.dob} onChange={onChange} error={errors.dob} type="date" />
        <FormInput label="Email *" name="email" value={form.email} onChange={onChange} error={errors.email} type="email" placeholder="example@gmail.com" />
        <FormInput label="Phone *" name="phone" value={form.phone} onChange={onChange} error={errors.phone} placeholder="10 digit number" />
        <FormInput label="Age *" name="age" value={form.age} onChange={onChange} error={errors.age} type="number" placeholder="Must be > 1 and <= 100" />
        <div style={{marginBottom:'15px'}}>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>Gender *</label>
          <select name="gender" value={form.gender} onChange={(e)=>onChange(e.target.name, e.target.value)} style={{width:'100%',padding:'10px',border:'1px solid #94a3b8',borderRadius:'10px',fontSize:'0.95rem',backgroundColor:'#f9fafb',color:'#0f172a',cursor:'pointer'}}>
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span style={{color:'red',fontSize:'0.85rem'}}>{errors.gender}</span>}
        </div>
        <div style={{marginBottom:'15px'}}>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>Blood Group *</label>
          <select name="bloodGroup" value={form.bloodGroup} onChange={(e)=>onChange(e.target.name, e.target.value)} style={{width:'100%',padding:'10px',border:'1px solid #94a3b8',borderRadius:'10px',fontSize:'0.95rem',backgroundColor:'#f9fafb',color:'#0f172a',cursor:'pointer'}}>
            <option value="">-- Select Blood Group --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          {errors.bloodGroup && <span style={{color:'red',fontSize:'0.85rem'}}>{errors.bloodGroup}</span>}
        </div>
        <div style={{marginBottom:'15px'}}>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>Country *</label>
          <select name="country" value={form.country} onChange={(e)=>onChange(e.target.name, e.target.value)} style={{width:'100%',padding:'10px',border:'1px solid #94a3b8',borderRadius:'10px',fontSize:'0.95rem',backgroundColor:'#f9fafb',color:'#0f172a',cursor:'pointer'}}>
            {Object.keys(countryData).map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <span style={{color:'red',fontSize:'0.85rem'}}>{errors.country}</span>}
        </div>
        <div style={{marginBottom:'15px'}}>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>State *</label>
          <select name="state" value={form.state} onChange={(e)=>onChange(e.target.name, e.target.value)} style={{width:'100%',padding:'10px',border:'1px solid #94a3b8',borderRadius:'10px',fontSize:'0.95rem',backgroundColor:'#f9fafb',color:'#0f172a',cursor:'pointer'}}>
            <option value="">-- Select State --</option>
            {states.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <span style={{color:'red',fontSize:'0.85rem'}}>{errors.state}</span>}
        </div>
        <div style={{marginBottom:'15px'}}>
          <label style={{display:'block', marginBottom:'5px', fontWeight:'500'}}>City *</label>
          <select name="city" value={form.city} onChange={(e)=>onChange(e.target.name, e.target.value)} style={{width:'100%',padding:'10px',border:'1px solid #94a3b8',borderRadius:'10px',fontSize:'0.95rem',backgroundColor:'#f9fafb',color:'#0f172a',cursor:'pointer'}}>
            <option value="">-- Select City --</option>
            {cities.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <span style={{color:'red',fontSize:'0.85rem'}}>{errors.city}</span>}
        </div>
        <FormInput label="Pincode *" name="pincode" value={form.pincode} onChange={onChange} error={errors.pincode} placeholder="Exactly 6 digits" />
        <FormInput label="Address *" name="address" value={form.address} onChange={onChange} error={errors.address} />
        <FormInput label="Medical history" name="medicalHistory" value={form.medicalHistory} onChange={onChange} error={errors.medicalHistory} />
        <FormInput label="Allergies" name="allergies" value={form.allergies} onChange={onChange} error={errors.allergies} />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
          <div>
            <FormInput label="Next Visit Date" name="nextVisitDate" value={form.nextVisitDate} onChange={onChange} error={errors.nextVisitDate} type="date" />
          </div>
          <div>
            <FormInput label="Next Visit Time" name="nextVisitTime" value={form.nextVisitTime} onChange={onChange} error={errors.nextVisitTime} type="time" />
          </div>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}
