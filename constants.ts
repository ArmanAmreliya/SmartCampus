
import { Faculty, FacultyStatus, BroadcastMessage, DaySchedule, Appointment, StudentProfile } from './types';

export const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Electrical Engineering'
];

const generateDefaultSchedule = (offset: number = 0): DaySchedule[] => [
  { day: 'SUN', isEnabled: false, slots: [] },
  { day: 'MON', isEnabled: true, slots: [{ id: '1', start: '10:30', end: '12:30' }, { id: '2', start: '14:00', end: '16:00' }] },
  { day: 'TUE', isEnabled: true, slots: [{ id: '3', start: '11:00', end: '13:00' }] },
  { day: 'WED', isEnabled: true, slots: [{ id: '4', start: '10:30', end: '14:30' }] },
  { day: 'THU', isEnabled: true, slots: [{ id: '5', start: '11:00', end: '17:00' }] },
  { day: 'FRI', isEnabled: true, slots: [{ id: '6', start: '10:30', end: '13:30' }] },
  { day: 'SAT', isEnabled: true, slots: [{ id: '7', start: '09:00', end: '11:00' }] },
];

// L.D. College of Engineering - Computer Engineering Faculty
export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'f1',
    name: 'Dr. Chirag S. Thaker',
    department: 'Computer Engineering',
    position: 'Head of Department & Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Chirag+S+Thaker&background=0D8ABC&color=fff',
    email: 'chiragthaker@ldce.ac.in',
    schedule: generateDefaultSchedule(),
    bio: 'Dr. Chirag S. Thaker is the Head of Department & Professor at L.D. College of Engineering.',
    education: 'Ph.D. (Computer Science & Engineering) - Suresh Gyan Vihar University (2009-2013)\nM.E. (Computer Engineering) - Dharmshinh Desai University (2003-2005)\nB.E. (Computer Engineering) - D.D. Institute of Technology (1993-1997)',
    researchInterests: ['Genetic Algorithms', 'Machine Learning', 'Evolutionary Game Learning', 'State Improvisation'],
    experience: [
      { role: 'Professor & Head', years: '2022 - Present', institution: 'L D College of Engineering Ahmedabad' },
      { role: 'Professor & Head', years: '2018 - 2022', institution: 'Government Engineering College, Rajkot' },
      { role: 'Assistant Professor', years: '2016 - 2018', institution: 'L.D. Engineering, Ahmedabad' },
      { role: 'Assistant Professor', years: '2013 - 2016', institution: 'S.S. Engineering College, Bhavnagar' },
      { role: 'Assistant Professor', years: '2009 - 2013', institution: 'L.D. Engineering, Ahmedabad' },
      { role: 'Lecturer', years: '2000 - 2009', institution: 'Government Polytechnic, Gandhinagar' },
      { role: 'Lecturer', years: '1998 - 2000', institution: 'D.D. Institute of Technology, Nadiad' }
    ],
    publications: [
      { title: 'Quality of State Improvisation Through Evaluation Function Optimization In Genetic Application Learning', isbn: '978-1-4577-0240-2', date: '22 Apr, 2011' },
      { title: 'Multimedia Based Fitness Function Optimization Through Evolutionary Game Learning', isbn: '978-1-4577-0240-2', date: '18 Jul, 2011' }
    ]
  },
  {
    id: 'f2',
    name: 'Dr. K. Rana',
    department: 'Computer Engineering',
    position: 'Associate Professor',
    status: FacultyStatus.BUSY,
    nextAvailableSlot: '2:30 PM',
    image: 'https://ui-avatars.com/api/?name=K+Rana&background=random',
    email: 'krana@ldce.ac.in',
    schedule: generateDefaultSchedule(),
    bio: 'Dr. K. Rana is a distinguished researcher in the field of Artificial Intelligence. He has published numerous papers in international journals.',
    education: 'Ph.D. (AI/ML), M.Tech',
    researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Data Mining']
  },
  {
    id: 'f3',
    name: 'Mr. Tushar Raval',
    department: 'Computer Engineering',
    position: 'Associate Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Tushar+Raval&background=random',
    email: 'tmraval@ldce.ac.in',
    schedule: generateDefaultSchedule(),
    bio: 'Mr. Tushar Raval brings extensive industry and teaching experience. His primary focus is on Software Engineering and Project Management.',
    education: 'M.E. (Computer Engineering)',
    researchInterests: ['Software Engineering', 'Database Management', 'Web Technologies']
  },
  {
    id: 'f4',
    name: 'Dr. Tushar Champaneria',
    department: 'Computer Engineering',
    position: 'Associate Professor',
    status: FacultyStatus.NOT_AVAILABLE,
    nextAvailableSlot: 'Tomorrow 11:00 AM',
    image: 'https://ui-avatars.com/api/?name=Tushar+Champaneria&background=random',
    email: 'tushar.champaneria@ldce.ac.in',
    schedule: generateDefaultSchedule(),
    bio: 'Dr. Champaneria is an expert in Image Processing and Computer Vision. He actively mentors students for hackathons and research projects.',
    education: 'Ph.D. in Image Processing',
    researchInterests: ['Computer Vision', 'Image Processing', 'Pattern Recognition']
  },
  {
    id: 'f5',
    name: 'Miss. Hetal Pandya',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Hetal+Pandya&background=random',
    email: 'hbpandya@ldce.ac.in',
    schedule: generateDefaultSchedule(),
    bio: 'Prof. Hetal Pandya specializes in Algorithms and Theory of Computation. She is passionate about making complex mathematical concepts accessible to students.',
    education: 'M.E. (Computer Engineering)',
    researchInterests: ['Algorithms', 'Theory of Computation', 'Compiler Design']
  },
  {
    id: 'f6',
    name: 'Dr. Amitaben Shah',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.BUSY,
    nextAvailableSlot: '4:00 PM',
    image: 'https://ui-avatars.com/api/?name=Amitaben+Shah&background=random',
    email: 'amitashah@ldce.ac.in',
    schedule: generateDefaultSchedule(),
    bio: 'Dr. Amitaben Shah has been serving as an Assistant Professor at L.D. College of Engineering since 2016. Her research focuses on Security in IoT.',
    education: 'PhD in Security in IoT - GTU (2018-2025)\nME - Computer Engineering - LJ Institute (2014-2016)\nB.E. Computer Engineering - VGEC (2002-2005)\nDiploma - Computer Engineering - Govt Polytechnic (1999-2002)',
    researchInterests: ['IoT Security', 'Internet of Things', 'Computer Networks'],
    experience: [
      { role: 'Assistant Professor', years: '2016 - 2022', institution: 'L D college of Engineering, Ahmedabad' },
      { role: 'Assistant Professor', years: '2013 - 2016', institution: 'Government Engineering College, Modasa' },
      { role: 'Assistant Professor', years: '2010 - 2013', institution: 'Vishwakarma Government Engineering College, Chandkheda' }
    ]
  },
  {
    id: 'f7',
    name: 'Miss. Hetalben Gevariya',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Hetalben+Gevariya&background=random',
    email: 'hngevariya@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f8',
    name: 'Mr. Bhavesh Oza',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.NOT_AVAILABLE,
    nextAvailableSlot: 'Tomorrow 10:30 AM',
    image: 'https://ui-avatars.com/api/?name=Bhavesh+Oza&background=random',
    email: 'bjoza@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f9',
    name: 'Mr. Kalpesh Patel',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Kalpesh+Patel&background=random',
    email: 'kppatel@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f10',
    name: 'Miss. Reshma Dayma',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.BUSY,
    nextAvailableSlot: '1:00 PM',
    image: 'https://ui-avatars.com/api/?name=Reshma+Dayma&background=random',
    email: 'reshma.dayma@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f11',
    name: 'Mr. Maitrik Shah',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Maitrik+Shah&background=random',
    email: 'maitrikshah.ce@gmail.com',
    schedule: generateDefaultSchedule(),
    bio: 'Mr. Maitrik Shah is an Assistant Professor in Computer Engineering. He holds an M.Tech from Nirma University and is an alumnus of L.D. College of Engineering.',
    education: 'M.Tech (Computer Science and Engineering) - Nirma University (2010-2012)\nB.E. (Computer Engineering) - L. D. College of Engineering (2006-2010)',
    researchInterests: ['Computer Science', 'Software Engineering', 'Academic Development'],
    experience: [
       { role: 'Assistant Professor', years: '2012 - 2016', institution: 'Indus University' }
    ]
  },
  {
    id: 'f12',
    name: 'Mr. ZishanHaider Noorani',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.BUSY,
    nextAvailableSlot: '3:00 PM',
    image: 'https://ui-avatars.com/api/?name=Zishan+Noorani&background=random',
    email: 'znoorani@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f13',
    name: 'Mr. Pragnesh Patel',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Pragnesh+Patel&background=random',
    email: 'pragnesh.patel@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f14',
    name: 'Miss. Shraddha Modi',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.NOT_AVAILABLE,
    nextAvailableSlot: 'Monday 9:00 AM',
    image: 'https://ui-avatars.com/api/?name=Shraddha+Modi&background=random',
    email: 'shraddha.modi@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f15',
    name: 'Miss. Prachi Pancholi',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Prachi+Pancholi&background=random',
    email: 'prachi.pancholi@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f16',
    name: 'Dr. Nikunj Domadiya',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.BUSY,
    nextAvailableSlot: '12:00 PM',
    image: 'https://ui-avatars.com/api/?name=Nikunj+Domadiya&background=random',
    email: 'nikunj.domadiya@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f17',
    name: 'Mr. Hitesh Rajput',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Hitesh+Rajput&background=random',
    email: 'hitesh.rajput@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f18',
    name: 'Mr. Parth Dave',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.BUSY,
    nextAvailableSlot: '5:00 PM',
    image: 'https://ui-avatars.com/api/?name=Parth+Dave&background=random',
    email: 'parth.dave@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f19',
    name: 'Mrs. Pinal Salot',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Pinal+Salot&background=random',
    email: 'pinal.salot@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f20',
    name: 'Miss. Bhoomi Trivedi',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Bhoomi+Trivedi&background=random',
    email: 'bhoomi.trivedi@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f21',
    name: 'Miss. Archana Gondalia',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.AVAILABLE,
    nextAvailableSlot: 'Now',
    image: 'https://ui-avatars.com/api/?name=Archana+Gondalia&background=random',
    email: 'archana.gondalia@ldce.ac.in',
    schedule: generateDefaultSchedule()
  },
  {
    id: 'f22',
    name: 'Miss. Payal Prajapati',
    department: 'Computer Engineering',
    position: 'Assistant Professor',
    status: FacultyStatus.NOT_AVAILABLE,
    nextAvailableSlot: 'Tomorrow 9:00 AM',
    image: 'https://ui-avatars.com/api/?name=Payal+Prajapati&background=random',
    email: 'payal.prajapati@ldce.ac.in',
    schedule: generateDefaultSchedule()
  }
];

export const INITIAL_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'b1',
    facultyId: 'f1',
    facultyName: 'Dr. Chirag S. Thaker',
    message: 'Final Year Project Reviews scheduled for next Monday. Check your email for batch allocation.',
    timestamp: '2 hours ago',
    department: 'Computer Engineering'
  },
  {
    id: 'admin',
    facultyId: 'admin',
    facultyName: 'Student Section',
    message: 'Scholarship forms for the current academic year must be submitted by Friday at Window 4.',
    timestamp: '1 day ago',
  }
];

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Jay Patel',
  email: '23csjay142@ldce.ac.in',
  enrollmentNo: '240280107142',
  department: 'Computer Engineering',
  semester: 4,
  phone: '+91 98765 43210',
  avatar: 'https://ui-avatars.com/api/?name=Jay+Patel&background=2ECC71&color=fff'
};

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const SYSTEM_INSTRUCTION_BASE = `
You are the SmartCampus AI for L.D. College of Engineering (LDCE), Ahmedabad.
Your goal is to assist students with college-related queries.

Context about LDCE:
- Location: Opposite Gujarat University, Navrangpura, Ahmedabad.
- Exam Section: Block A (Annexe Building).
- Student Section: Main Building, Ground Floor.
- Library: Central Library near Block B.
- Canteen: Located behind the Mechanical Department.
- GTU Results: Usually declared on gtu.ac.in.
- HOD Computer: Dr. Chirag S. Thaker.

If a student asks about a specific professor, check the provided data and tell them their status.
Be concise, professional, and helpful.
`;
