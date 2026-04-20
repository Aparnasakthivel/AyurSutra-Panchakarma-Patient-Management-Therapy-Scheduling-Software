const mongoose = require('mongoose');
require('dotenv').config();

const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Therapy = require('../models/Therapy');
const Stock = require('../models/Stock');
const Admin = require('../models/Admin');
const Billing = require('../models/Billing');
const Report = require('../models/Report');

const samplePatients = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '9876543210',
    age: 45,
    gender: 'Male',
    address: 'Mumbai, Maharashtra',
    medicalHistory: 'Hypertension, Joint pain',
    allergies: 'Penicillin',
    status: 'Active',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    age: 38,
    gender: 'Female',
    address: 'Delhi, India',
    medicalHistory: 'Migraine, Anxiety',
    allergies: 'None',
    status: 'Active',
  },
  {
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '9876543212',
    age: 55,
    gender: 'Male',
    address: 'Bangalore, Karnataka',
    medicalHistory: 'Diabetes, Arthritis',
    allergies: 'Sulfa drugs',
    status: 'Active',
  },
];

const sampleDoctors = [
  {
    name: 'Dr. Vaidya Sharma',
    email: 'vaidya.sharma@example.com',
    phone: '9876543220',
    specialization: 'Panchakarma Therapy',
    qualifications: 'B.A.M.S, M.D. Ayurveda',
    licenseNumber: 'AY123456',
    yearsOfExperience: 20,
    consultationFee: 500,
    availability: 'Available',
  },
  {
    name: 'Dr. Ayurveda Singh',
    email: 'singh.ayurveda@example.com',
    phone: '9876543221',
    specialization: 'Marma Therapy',
    qualifications: 'BAMS, PhD Ayurveda',
    licenseNumber: 'AY123457',
    yearsOfExperience: 15,
    consultationFee: 600,
    availability: 'Available',
  },
];

const sampleStock = [
  {
    itemName: 'Sesame Oil (Til Tail)',
    category: 'Oils',
    quantity: 50,
    unit: 'Liters',
    unitCost: 200,
    supplier: 'Ayurveda Herbs Ltd',
    expiryDate: new Date('2026-12-31'),
    minimumStock: 10,
  },
  {
    itemName: 'Neem Powder',
    category: 'Herbs',
    quantity: 25,
    unit: 'kg',
    unitCost: 300,
    supplier: 'Herbal Supplies Inc',
    expiryDate: new Date('2026-08-15'),
    minimumStock: 5,
  },
  {
    itemName: 'Turmeric (Haldi)',
    category: 'Spices',
    quantity: 15,
    unit: 'kg',
    unitCost: 150,
    supplier: 'Spice World',
    expiryDate: new Date('2026-06-30'),
    minimumStock: 3,
  },
];

const sampleAdmin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123456', // Note: Use bcrypt for production
  phone: '9876543230',
  role: 'SuperAdmin',
  permissions: ['read', 'write', 'delete', 'admin'],
  status: 'Active',
};

const initializeDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/panchakarma';
    console.log('Connecting to MongoDB:', mongoURI);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    // Clear existing data (optional - comment out to keep data)
    console.log('\n🗑️  Clearing existing data...');
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Therapy.deleteMany({});
    await Stock.deleteMany({});
    await Admin.deleteMany({});
    await Billing.deleteMany({});
    await Report.deleteMany({});
    console.log('✓ Data cleared');

    // Insert sample patients
    console.log('\n👥 Creating sample patients...');
    const patients = await Patient.insertMany(samplePatients);
    console.log(`✓ ${patients.length} patients created`);

    // Insert sample doctors
    console.log('\n🏥 Creating sample doctors...');
    const doctors = await Doctor.insertMany(sampleDoctors);
    console.log(`✓ ${doctors.length} doctors created`);

    // Insert sample stock
    console.log('\n📦 Creating sample stock items...');
    const stock = await Stock.insertMany(sampleStock);
    console.log(`✓ ${stock.length} stock items created`);

    // Insert sample admin
    console.log('\n👨‍💼 Creating admin user...');
    const admin = await Admin.insertOne(sampleAdmin);
    console.log(`✓ Admin user created (email: ${sampleAdmin.email})`);

    // Create sample therapies
    if (patients.length > 0 && doctors.length > 0) {
      console.log('\n💆 Creating sample therapies...');
      const sampleTherapies = [
        {
          name: 'Abhyanga Massage',
          description: 'Full body oil massage therapy',
          duration: 60,
          cost: 1500,
          patientId: patients[0]._id,
          doctorId: doctors[0]._id,
          startDate: new Date('2026-02-10'),
          endDate: new Date('2026-02-20'),
          status: 'Scheduled',
          notes: 'Full body warm oil massage',
        },
        {
          name: 'Shirodhara',
          description: 'Continuous oil flow on forehead',
          duration: 45,
          cost: 2000,
          patientId: patients[1]._id,
          doctorId: doctors[1]._id,
          startDate: new Date('2026-02-12'),
          endDate: new Date('2026-02-22'),
          status: 'Scheduled',
          notes: 'For stress relief and mental clarity',
        },
      ];
      const therapies = await Therapy.insertMany(sampleTherapies);
      console.log(`✓ ${therapies.length} therapies created`);

      // Create sample billings
      console.log('\n💰 Creating sample billing records...');
      const sampleBillings = [
        {
          patientId: patients[0]._id,
          invoiceNumber: 'INV-001',
          description: 'Therapy Session - Abhyanga Massage',
          amount: 1500,
          therapyId: therapies[0]._id,
          paymentMethod: 'Cash',
          paymentStatus: 'Pending',
          dueDate: new Date('2026-02-20'),
        },
        {
          patientId: patients[1]._id,
          invoiceNumber: 'INV-002',
          description: 'Therapy Session - Shirodhara',
          amount: 2000,
          therapyId: therapies[1]._id,
          paymentMethod: 'Card',
          paymentStatus: 'Paid',
          dueDate: new Date('2026-02-22'),
          paidDate: new Date('2026-02-15'),
        },
      ];
      const billings = await Billing.insertMany(sampleBillings);
      console.log(`✓ ${billings.length} billing records created`);

      // Create sample reports
      console.log('\n📄 Creating sample reports...');
      const sampleReports = [
        {
          patientId: patients[0]._id,
          doctorId: doctors[0]._id,
          reportType: 'Medical Assessment',
          findings: 'Patient shows signs of vata imbalance with joint stiffness',
          recommendations: 'Warm oil massage 3 times per week, dietary modifications',
          status: 'Completed',
        },
      ];
      const reports = await Report.insertMany(sampleReports);
      console.log(`✓ ${reports.length} reports created`);
    }

    console.log('\n✅ Database initialized successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Patients: ${patients.length}`);
    console.log(`   - Doctors: ${doctors.length}`);
    console.log(`   - Stock Items: ${stock.length}`);
    console.log(`   - Admin Users: 1`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
};

// Run initialization
initializeDatabase();
