const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Opportunity = require('../models/Opportunity');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([User.deleteMany(), Organization.deleteMany(), Opportunity.deleteMany()]);
  console.log('Cleared existing data');

  // Create Admin
  const admin = await User.create({
    email: 'admin@opportunityhub.org',
    password: 'Admin@123456',
    role: 'admin',
    fullName: 'Platform Admin',
    isEmailVerified: true,
    isActive: true,
  });
  console.log('Admin created:', admin.email);

  // Create Organization Users
  const unhcrUser = await User.create({
    email: 'info@unhcr-test.org',
    password: 'Org@123456',
    role: 'organization',
    fullName: 'UNHCR Team',
    isEmailVerified: true,
    isActive: true,
  });

  const employerUser = await User.create({
    email: 'hr@techcorp-test.com',
    password: 'Org@123456',
    role: 'organization',
    fullName: 'TechCorp HR',
    isEmailVerified: true,
    isActive: true,
  });

  const uniUser = await User.create({
    email: 'admissions@eastafrica-uni.edu',
    password: 'Org@123456',
    role: 'organization',
    fullName: 'University Admin',
    isEmailVerified: true,
    isActive: true,
  });

  // Create Organizations
  const unhcr = await Organization.create({
    user: unhcrUser._id,
    organizationName: 'UNHCR East Africa',
    description: 'The UN Refugee Agency supporting refugees across East Africa with protection and durable solutions.',
    type: 'ngo',
    website: 'https://www.unhcr.org',
    contactEmail: 'eastafrica@unhcr.org',
    country: 'Uganda',
    isVerified: true,
    verifiedAt: new Date(),
    verifiedBy: admin._id,
  });

  const techCorp = await Organization.create({
    user: employerUser._id,
    organizationName: 'TechCorp Africa',
    description: 'Leading technology company committed to inclusive hiring and empowering talent across Africa.',
    type: 'employer',
    website: 'https://techcorp-africa.example.com',
    contactEmail: 'hr@techcorp-africa.example.com',
    country: 'Uganda',
    isVerified: true,
    verifiedAt: new Date(),
    verifiedBy: admin._id,
  });

  const university = await Organization.create({
    user: uniUser._id,
    organizationName: 'East Africa University',
    description: 'Providing quality education and scholarships to refugees and underserved communities.',
    type: 'university',
    website: 'https://eastafrica-uni.example.edu',
    contactEmail: 'scholarships@eastafrica-uni.example.edu',
    country: 'Uganda',
    isVerified: true,
    verifiedAt: new Date(),
    verifiedBy: admin._id,
  });

  console.log('Organizations created');

  // Create Refugee Users
  const refugees = await User.create([
    {
      email: 'amina.hassan@example.com',
      password: 'User@123456',
      role: 'refugee',
      fullName: 'Amina Hassan',
      gender: 'female',
      countryOfOrigin: 'Somalia',
      currentLocation: 'Kampala, Uganda',
      refugeeStatus: 'refugee',
      skills: ['English', 'Arabic', 'Customer Service', 'Microsoft Office'],
      languages: [{ language: 'Somali', proficiency: 'native' }, { language: 'English', proficiency: 'fluent' }, { language: 'Arabic', proficiency: 'conversational' }],
      bio: 'Dedicated professional with experience in community outreach and administration.',
      isEmailVerified: true,
      isActive: true,
    },
    {
      email: 'peter.okello@example.com',
      password: 'User@123456',
      role: 'refugee',
      fullName: 'Peter Okello',
      gender: 'male',
      countryOfOrigin: 'South Sudan',
      currentLocation: 'Kampala, Uganda',
      refugeeStatus: 'asylum_seeker',
      skills: ['Programming', 'JavaScript', 'Python', 'Data Analysis'],
      languages: [{ language: 'English', proficiency: 'fluent' }, { language: 'Swahili', proficiency: 'basic' }],
      bio: 'Self-taught programmer passionate about technology and innovation.',
      isEmailVerified: true,
      isActive: true,
    },
    {
      email: 'fatima.ali@example.com',
      password: 'User@123456',
      role: 'refugee',
      fullName: 'Fatima Ali',
      gender: 'female',
      countryOfOrigin: 'DRC',
      currentLocation: 'Kampala, Uganda',
      refugeeStatus: 'refugee',
      skills: ['French', 'Swahili', 'Teaching', 'Community Development'],
      languages: [{ language: 'French', proficiency: 'native' }, { language: 'Swahili', proficiency: 'fluent' }, { language: 'English', proficiency: 'conversational' }],
      bio: 'Former teacher passionate about education and community empowerment.',
      isEmailVerified: true,
      isActive: true,
    },
  ]);

  console.log('Refugee users created');

  // Create Opportunities
  await Opportunity.create([
    {
      title: 'Community Health Worker',
      description: 'Join our team as a Community Health Worker to provide essential health services and education to refugee communities in Kakuma and Dadaab camps. You will conduct home visits, facilitate health education sessions, and connect families with medical services.',
      category: 'job',
      organization: unhcr._id,
      postedBy: unhcrUser._id,
      location: 'Kakuma, Kenya',
      isRemote: false,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      requirements: ['Minimum secondary school education', 'Experience in community health or social work', 'Strong communication skills in Somali or Turkana', 'Ability to work in remote settings'],
      benefits: ['Competitive monthly stipend', 'Health insurance', 'Training and capacity building', 'Certificate of participation'],
      tags: ['health', 'community', 'ngo', 'Kenya'],
      status: 'active',
      eligibility: 'Open to registered refugees in Kakuma or Dadaab',
      howToApply: 'Submit your application through the platform',
    },
    {
      title: 'UNHCR Scholarship Programme 2025',
      description: 'The UNHCR Scholarship Programme provides full scholarships for refugees to pursue undergraduate and postgraduate studies at partner universities across East Africa. This life-changing opportunity covers tuition, accommodation, and living expenses.',
      category: 'scholarship',
      organization: unhcr._id,
      postedBy: unhcrUser._id,
      location: 'East Africa (Multiple Countries)',
      isRemote: false,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      requirements: ['UNHCR registered refugee status', 'Completed secondary education with good grades', 'Accepted to a partner university', 'Demonstrated financial need'],
      benefits: ['Full tuition fees', 'Monthly stipend', 'Accommodation support', 'Study materials allowance', 'Health insurance'],
      tags: ['scholarship', 'education', 'university', 'UNHCR', 'full-funding'],
      fundingAmount: 'Full funding (up to $15,000/year)',
      status: 'active',
    },
    {
      title: 'Junior Software Developer',
      description: 'TechCorp Africa is seeking talented junior software developers who are passionate about building solutions for Africa. We actively recruit from refugee communities and provide full training and mentorship.',
      category: 'job',
      organization: techCorp._id,
      postedBy: employerUser._id,
      location: 'Kampala, Uganda',
      isRemote: true,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      requirements: ['Knowledge of JavaScript or Python', 'Basic understanding of web development', 'Problem-solving skills', 'Valid work permit'],
      benefits: ['Competitive salary ($500-$800/month)', 'Remote work options', 'Mentorship program', 'Career growth opportunities', 'Health insurance'],
      tags: ['technology', 'programming', 'remote', 'junior', 'JavaScript', 'Python'],
      salary: '$500–$800/month',
      status: 'active',
    },
    {
      title: 'Digital Skills Training for Refugees',
      description: 'A 3-month intensive digital skills training program covering computer literacy, Microsoft Office, internet skills, and basic web design. Designed specifically for refugees with no prior computer experience.',
      category: 'training',
      organization: techCorp._id,
      postedBy: employerUser._id,
      location: 'Kampala, Uganda',
      isRemote: false,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      requirements: ['Refugee status (any)', 'Basic literacy in English', 'Age 18–45', 'Commitment to attend all sessions'],
      benefits: ['Free training', 'Certificate of completion', 'Job placement assistance', 'Free laptop for top performers'],
      tags: ['training', 'digital', 'skills', 'free', 'computer'],
      duration: '3 months (full-time)',
      status: 'active',
    },
    {
      title: 'Bachelor of Science Scholarship 2025',
      description: 'East Africa University offers partial scholarships for refugee students pursuing BSc degrees in Science, Technology, Engineering, and Mathematics (STEM) fields. Applications open for the 2025/2026 academic year.',
      category: 'scholarship',
      organization: university._id,
      postedBy: uniUser._id,
      location: 'Kampala, Uganda',
      isRemote: false,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      requirements: ['Refugee or asylum seeker status', 'Completed O-level/KCSE with grade B+ or equivalent', 'Passion for STEM subjects', 'Letter of recommendation'],
      benefits: ['75% tuition waiver', 'Access to university facilities', 'Academic mentorship', 'Career counseling'],
      tags: ['scholarship', 'STEM', 'Uganda', 'university', 'undergraduate'],
      fundingAmount: '75% tuition waiver',
      status: 'active',
    },
    {
      title: 'Humanitarian Leadership Fellowship',
      description: 'A 12-month fellowship program for emerging refugee leaders to develop skills in humanitarian response, advocacy, and organizational management. Fellows are placed with leading humanitarian organizations.',
      category: 'fellowship',
      organization: unhcr._id,
      postedBy: unhcrUser._id,
      location: 'Geneva, Switzerland (with field visits)',
      isRemote: false,
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      requirements: ['University degree or equivalent experience', '3+ years in humanitarian or community work', 'Strong written and spoken English', 'Leadership potential'],
      benefits: ['Monthly stipend of $1,500', 'International travel covered', 'Accommodation provided', 'Networking opportunities', 'Certificate of fellowship'],
      tags: ['fellowship', 'leadership', 'humanitarian', 'international', 'UNHCR'],
      duration: '12 months',
      status: 'active',
    },
    {
      title: 'Entrepreneurship Grant for Refugees',
      description: 'Launch or scale your business with our micro-grant program. We provide funding of up to $2,000 for refugee entrepreneurs with viable business ideas in agriculture, trade, crafts, or services.',
      category: 'entrepreneurship',
      organization: unhcr._id,
      postedBy: unhcrUser._id,
      location: 'Kenya, Uganda, Ethiopia (Multiple Locations)',
      isRemote: false,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      requirements: ['Registered refugee or asylum seeker', 'Viable business plan', 'Commitment to business development training', 'Age 18+'],
      benefits: ['Grant of $500–$2,000', 'Business mentorship', 'Market linkages', 'Follow-up support'],
      tags: ['grant', 'entrepreneurship', 'business', 'startup', 'East Africa'],
      fundingAmount: '$500–$2,000',
      status: 'active',
    },
    {
      title: 'Marketing & Communications Internship',
      description: 'TechCorp Africa offers a 6-month paid internship for talented individuals to join our marketing team. Learn digital marketing, content creation, and communications strategy in a fast-paced tech environment.',
      category: 'internship',
      organization: techCorp._id,
      postedBy: employerUser._id,
      location: 'Kampala, Uganda',
      isRemote: true,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      requirements: ['Pursuing or completed a degree in Marketing, Communications, or related field', 'Creative writing skills', 'Social media proficiency', 'Basic graphic design skills'],
      benefits: ['Monthly stipend of $300', 'Remote work allowed', 'Professional development training', 'Potential full-time offer'],
      tags: ['internship', 'marketing', 'communications', 'remote', 'technology'],
      salary: '$300/month stipend',
      duration: '6 months',
      status: 'active',
    },
    {
      title: 'Research Grant in Public Health',
      description: 'Apply for our competitive research grant to conduct public health research on refugee health challenges. Successful applicants will receive funding, mentorship, and access to research facilities.',
      category: 'grant',
      organization: university._id,
      postedBy: uniUser._id,
      location: 'East Africa',
      isRemote: false,
      deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      requirements: ['Masters or PhD in Public Health or related field', 'Research proposal on refugee health topics', 'Institutional affiliation or endorsement', 'Refugee or affected community background preferred'],
      benefits: ['Research funding up to $10,000', 'Academic mentorship', 'Publication support', 'Conference presentation opportunity'],
      tags: ['grant', 'research', 'health', 'academic', 'PhD'],
      fundingAmount: 'Up to $10,000',
      status: 'active',
    },
    {
      title: 'Language Skills Enhancement Program',
      description: 'Intensive English and French language training program for adult refugees. This 6-week program focuses on professional communication skills to improve employment prospects.',
      category: 'training',
      organization: university._id,
      postedBy: uniUser._id,
      location: 'Kampala, Uganda',
      isRemote: true,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      requirements: ['Basic literacy in any language', 'Age 18+', 'Refugee or asylum seeker status', 'Regular internet access (for online component)'],
      benefits: ['Free enrollment', 'Certificate of completion', 'Online learning materials', 'Access to language labs'],
      tags: ['training', 'language', 'English', 'French', 'online', 'free'],
      duration: '6 weeks (part-time)',
      status: 'active',
    },
  ]);

  console.log('Opportunities created');
  console.log('\n✅ Seed data created successfully!\n');
  console.log('Login credentials:');
  console.log('  Admin:        admin@opportunityhub.org / Admin@123456');
  console.log('  Organization: info@unhcr-test.org / Org@123456');
  console.log('  Organization: hr@techcorp-test.com / Org@123456');
  console.log('  Refugee:      amina.hassan@example.com / User@123456');
  console.log('  Refugee:      peter.okello@example.com / User@123456\n');
};
module.exports = seedData;
