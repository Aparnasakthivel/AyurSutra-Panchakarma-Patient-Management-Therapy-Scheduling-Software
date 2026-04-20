// Simple validation helpers
export const required = (v) => (v === undefined || v === null || String(v).trim() === '') ? 'This field is required' : '';
export const isEmail = (v) => {
  if (!v) return '';
  const re = /^[a-zA-Z0-9@]+@gmail\.com$/;
  return re.test(String(v).toLowerCase()) ? '' : 'Email must be a valid gmail.com address';
}

export const isName = (v) => {
  if (!v) return '';
  const re = /^[a-zA-Z\s]*$/;//name size should be at least 2 characters 
  const re2 = /^[a-zA-Z\s]{2,200}$/;//name size should be at most 20 characters  
  return re.test(String(v)) ? '' : 'Name must contain only letters and spaces at least 2 characters ';
}

export const isGender = (v) => { 
  if (!v) return '';
  const re = /^(Male|Female|Other)$/;
  return re.test(String(v)) ? '' : 'Gender must be Male, Female or Other';
} 

export const isAge = (v) => {
  if (!v) return '';
  const re = /^[0-9]{1,3}$/; 
  return re.test(String(v)) ? '' : 'Age must be exactly 3 digits';
} 

export const isMedicalHistory = (v) => {
  if (!v) return '';
  const re = /^[a-zA-Z0-9\s,.-]+$/;
  return re.test(String(v)) ? '' : 'Medical history must contain only letters, numbers, spaces, commas, periods and hyphens';
}   

export const isAddress = (v) => {
  if (!v) return '';
  const re = /^[a-zA-Z0-9\s,.-]+$/;
  return re.test(String(v)) ? '' : 'Address must contain only letters, numbers, spaces, commas, periods and hyphens';
} 

export const isPhone = (v) => {
  if (!v) return '';
  const re = /^[0-9]{10}$/;
  return re.test(String(v)) ? '' : 'Phone must be exactly 10 digits';
}
export const isNumber = (v) => {
  if (v === undefined || v === null || v === '') return '';
  return isNaN(Number(v)) ? 'Must be a number' : '';
}
export const minValue = (min) => (v) => {
  if (v === undefined || v === null || v === '') return '';
  return Number(v) < min ? `Must be at least ${min}` : '';
}
export const maxValue = (max) => (v) => {
  if (v === undefined || v === null || v === '') return '';
  return Number(v) > max ? `Must be at most ${max}` : '';
}
export const maxLength = (len) => (v) => {
  if (!v) return '';
  return String(v).length > len ? `Max ${len} characters` : '';
}
export const minLength = (len) => (v) => {
  if (!v) return '';
  return String(v).length < len ? `Minimum ${len} characters required` : '';
}
export const onlyLetters = (v) => {
  if (!v) return '';
  const re = /^[a-zA-Z\s]*$/;
  return re.test(String(v)) ? '' : 'Only letters and spaces are allowed';
}
export const pincodeValidation = (v) => {
  if (!v) return '';
  const re = /^\d{6}$/;
  return re.test(String(v)) ? '' : 'Pincode must be exactly 6 digits';
}

export const isDate = (v) => {
  if (!v) return '';
  const re = /^\d{4}-\d{2}-\d{2}$/;
  return re.test(v) ? '' : 'Date must be in YYYY-MM-DD format';
} 

export const isTime = (v) => {
  if (!v) return '';
  const re = /^\d{2}:\d{2}$/;
  return re.test(v) ? '' : 'Time must be in HH:MM format';
} 

export const isFutureDate = (v) => {
  if (!v) return '';
  const today = new Date();
  const inputDate = new Date(v);
  return inputDate > today ? '' : 'Date must be a future date';
}   

export function runValidators(value, validators){
  for(const v of validators){
    const err = v(value);
    if (err) return err;
  }
  return '';
}
