// VSB Engineering College Data
const collegeData = {
  name: "VSB Engineering College",
  established: "2002",
  location: "Karur, Tamil Nadu",
  address: "NH-67, Covai Road, Karudayampalayam, Karur-639111, Tamil Nadu",
  type: "Private Engineering College",
  approvals: ["AICTE", "Anna University Chennai", "NBA", "NAAC-B++"],
  chairman: "Mr. V.S. Balsamy",
  totalSeats: 1527,
  phone: "9994496212",
  email: "info@vsbec.edu.in",
  website: "https://vsbec.edu.in",
  
  courses: {
    undergraduate: [
      { name: "B.Tech Artificial Intelligence and Data Science", duration: "4 years", intake: 240, fees: "₹2.2 Lakhs" },
      { name: "B.E Computer Science and Engineering", duration: "4 years", intake: 180, fees: "₹2.2 Lakhs" },
      { name: "B.E Electronics and Communication Engineering", duration: "4 years", intake: 360, fees: "₹2.2 Lakhs" },
      { name: "B.Tech Information Technology", duration: "4 years", intake: 180, fees: "₹2.2 Lakhs" },
      { name: "B.E Mechanical Engineering", duration: "4 years", intake: 60, fees: "₹2.2 Lakhs" },
      { name: "B.E Civil Engineering", duration: "4 years", intake: 30, fees: "₹2.2 Lakhs" },
      { name: "B.E Electrical and Electronics Engineering", duration: "4 years", intake: 60, fees: "₹2.2 Lakhs" },
      { name: "B.Tech Chemical Engineering", duration: "4 years", intake: 30, fees: "₹2.2 Lakhs" },
      { name: "B.E Biomedical Engineering", duration: "4 years", intake: 60, fees: "₹2.2 Lakhs" },
      { name: "B.Tech Biotechnology", duration: "4 years", intake: 60, fees: "₹2.2 Lakhs" }
    ],
    postgraduate: [
      { name: "M.E Applied Electronics", duration: "2 years", intake: 15, fees: "₹60,000" },
      { name: "M.E Computer Science and Engineering", duration: "2 years", intake: 15, fees: "₹60,000" },
      { name: "M.E Power System Engineering", duration: "2 years", intake: 15, fees: "₹60,000" },
      { name: "MCA", duration: "2 years", fees: "₹41,000" }
    ],
    doctorate: [
      { name: "Ph.D", specializations: ["Computer Science", "Electronics", "Mechanical", "Civil", "Mathematics", "Physics", "Chemistry", "English"], duration: "3+ years" }
    ]
  },
  
  admissions: {
    ugEligibility: "10+2 with Physics, Chemistry, Mathematics (minimum 50% marks)",
    ugEntrance: "TNEA (Tamil Nadu Engineering Admissions)",
    pgEligibility: "B.E./B.Tech in relevant field (minimum 50% marks)",
    pgEntrance: "GATE/TANCET",
    phdEligibility: "M.E./M.Tech with minimum 55% marks (50% for SC/ST)",
    applicationDates: {
      ug: "May 7 - June 6, 2025",
      pg: "January 24 - February 21, 2025"
    }
  },
  
  placements: {
    placementRate: "90-100%",
    highestPackage: "₹53.5 LPA",
    averagePackage: "₹7.00 LPA",
    medianSalary: "₹4.39 LPA",
    totalOffers2024: 838,
    topRecruiters: ["TCS", "Wipro", "Capgemini", "Accenture", "Cognizant", "Zoho", "IBM", "Infosys", "Tech Mahindra", "Flipkart", "DXC Technology"],
    placementTraining: "Starts from 5th semester with coding, communication and aptitude skills training"
  },
  
  facilities: ["Smart Classrooms", "Central Library", "Computer Labs", "Engineering Workshops", "Hostel Accommodation", "Transportation", "Medical Facilities", "Sports Complex", "Auditorium", "Cafeteria"],
  
  rankings: {
    siliconIndia: "29th among Top 100 Engineering Colleges in India"
  }
};

// App State
let chatHistory = [];
let isTyping = false;
let chatStarted = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const chatContainer = document.getElementById('chatContainer');
const chatInputContainer = document.getElementById('chatInputContainer');
const startChatBtn = document.getElementById('startChatBtn');
const quickActions = document.getElementById('quickActions');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const menuBtn = document.getElementById('menuBtn');
const menuModal = document.getElementById('menuModal');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const aboutBtn = document.getElementById('aboutBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Event Listeners
  startChatBtn.addEventListener('click', startChat);
  sendBtn.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keypress', handleKeyPress);
  chatInput.addEventListener('input', handleInputChange);
  menuBtn.addEventListener('click', openMenu);
  closeMenuBtn.addEventListener('click', closeMenu);
  clearChatBtn.addEventListener('click', clearChat);
  aboutBtn.addEventListener('click', showAbout);
  
  // Quick Action Buttons
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const query = e.currentTarget.getAttribute('data-query');
      handleQuickAction(query);
    });
  });
  
  // Close modal when clicking outside
  menuModal.addEventListener('click', (e) => {
    if (e.target === menuModal) {
      closeMenu();
    }
  });
  
  // Update time periodically
  updateTime();
  setInterval(updateTime, 60000);
  
  // Ensure input is properly initialized
  updateSendButton();
}

function updateTime() {
  const now = new Date();
  const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
  document.querySelector('.time').textContent = timeString;
}

function startChat() {
  chatStarted = true;
  welcomeScreen.classList.add('hidden');
  chatContainer.classList.remove('hidden');
  chatInputContainer.classList.remove('hidden');
  
  // Force show the input container
  chatInputContainer.style.display = 'block';
  
  // Focus on input
  setTimeout(() => {
    chatInput.focus();
  }, 300);
  
  // Add welcome message
  setTimeout(() => {
    addBotMessage("Hello! I'm Tezzaract, your AI assistant for VSB Engineering College. How can I help you today? 🎓");
  }, 500);
}

function handleSendMessage() {
  const message = chatInput.value.trim();
  if (message && !isTyping) {
    sendMessage(message);
    chatInput.value = '';
    updateSendButton();
    
    // Hide quick actions after first custom message
    if (quickActions.style.display !== 'none') {
      quickActions.style.display = 'none';
    }
  }
}

function handleKeyPress(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
}

function handleInputChange() {
  updateSendButton();
}

function updateSendButton() {
  const hasText = chatInput.value.trim().length > 0;
  sendBtn.disabled = !hasText || isTyping;
  
  // Visual feedback for button state
  if (hasText && !isTyping) {
    sendBtn.style.opacity = '1';
    sendBtn.style.transform = 'scale(1)';
  } else {
    sendBtn.style.opacity = '0.6';
    sendBtn.style.transform = 'scale(0.95)';
  }
}

function handleQuickAction(query) {
  // Start chat if not started
  if (!chatStarted) {
    startChat();
    setTimeout(() => {
      sendMessage(query);
    }, 800);
  } else {
    sendMessage(query);
  }
}

function sendMessage(message) {
  addUserMessage(message);
  showTypingIndicator();
  
  setTimeout(() => {
    const response = generateResponse(message);
    hideTypingIndicator();
    addBotMessage(response);
  }, 1000 + Math.random() * 2000); // Random delay for realism
}

function addUserMessage(message) {
  const messageElement = createMessageElement(message, 'user');
  chatMessages.appendChild(messageElement);
  scrollToBottom();
  
  chatHistory.push({ type: 'user', message, timestamp: new Date() });
}

function addBotMessage(message) {
  const messageElement = createMessageElement(message, 'bot');
  chatMessages.appendChild(messageElement);
  scrollToBottom();
  
  chatHistory.push({ type: 'bot', message, timestamp: new Date() });
}

function createMessageElement(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', type);
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.classList.add('message-bubble');
  
  // Handle line breaks in messages
  const lines = message.split('\n');
  lines.forEach((line, index) => {
    if (index > 0) {
      bubbleDiv.appendChild(document.createElement('br'));
    }
    bubbleDiv.appendChild(document.createTextNode(line));
  });
  
  const timeDiv = document.createElement('div');
  timeDiv.classList.add('message-time');
  timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageDiv.appendChild(bubbleDiv);
  messageDiv.appendChild(timeDiv);
  
  return messageDiv;
}

function showTypingIndicator() {
  isTyping = true;
  typingIndicator.classList.remove('hidden');
  updateSendButton();
  scrollToBottom();
}

function hideTypingIndicator() {
  isTyping = false;
  typingIndicator.classList.add('hidden');
  updateSendButton();
}

function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

// Smart Response System
function generateResponse(query) {
  const lowerQuery = query.toLowerCase();
  
  // Greeting responses
  if (lowerQuery.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return "Hello! Welcome to VSB Engineering College. I'm here to help you with any questions about our courses, admissions, placements, and facilities. What would you like to know?";
  }
  
  // Admissions queries
  if (lowerQuery.includes('admission') || lowerQuery.includes('apply') || lowerQuery.includes('eligibility')) {
    return generateAdmissionsResponse(lowerQuery);
  }
  
  // Courses queries
  if (lowerQuery.includes('course') || lowerQuery.includes('program') || lowerQuery.includes('degree') || lowerQuery.includes('branch')) {
    return generateCoursesResponse(lowerQuery);
  }
  
  // Placements queries
  if (lowerQuery.includes('placement') || lowerQuery.includes('job') || lowerQuery.includes('salary') || lowerQuery.includes('package') || lowerQuery.includes('recruiter')) {
    return generatePlacementsResponse(lowerQuery);
  }
  
  // Facilities queries
  if (lowerQuery.includes('facilities') || lowerQuery.includes('hostel') || lowerQuery.includes('library') || lowerQuery.includes('lab')) {
    return generateFacilitiesResponse();
  }
  
  // Contact queries
  if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('address')) {
    return generateContactResponse();
  }
  
  // Fees queries
  if (lowerQuery.includes('fee') || lowerQuery.includes('cost') || lowerQuery.includes('tuition')) {
    return generateFeesResponse(lowerQuery);
  }
  
  // General college info
  if (lowerQuery.includes('college') || lowerQuery.includes('about') || lowerQuery.includes('vsb')) {
    return generateCollegeInfoResponse();
  }
  
  // Ranking queries
  if (lowerQuery.includes('rank') || lowerQuery.includes('rating')) {
    return `VSB Engineering College is ranked ${collegeData.rankings.siliconIndia}. The college is approved by ${collegeData.approvals.join(', ')} and has been serving students since ${collegeData.established}.`;
  }
  
  // Thank you responses
  if (lowerQuery.includes('thank') || lowerQuery.includes('thanks')) {
    return "You're welcome! I'm here to help with any questions about VSB Engineering College. Feel free to ask about admissions, courses, placements, or anything else!";
  }
  
  // Default response
  return "I'd be happy to help you with information about VSB Engineering College! You can ask me about:\n\n🎓 Admissions & Eligibility\n📚 Courses & Programs\n💼 Placements & Careers\n🏢 Facilities & Infrastructure\n📞 Contact Information\n💰 Fees & Costs\n\nWhat would you like to know more about?";
}

function generateAdmissionsResponse(query) {
  if (query.includes('ug') || query.includes('undergraduate') || query.includes('btech') || query.includes('be')) {
    return `For UG Admissions at VSB Engineering College:\n\n📋 Eligibility: ${collegeData.admissions.ugEligibility}\n🎯 Entrance: ${collegeData.admissions.ugEntrance}\n📅 Application Dates: ${collegeData.admissions.applicationDates.ug}\n🎓 Total Seats: ${collegeData.totalSeats}\n\nWe offer 10 different engineering programs. Would you like to know about specific courses?`;
  }
  
  if (query.includes('pg') || query.includes('postgraduate') || query.includes('mtech') || query.includes('me') || query.includes('mca')) {
    return `For PG Admissions at VSB Engineering College:\n\n📋 Eligibility: ${collegeData.admissions.pgEligibility}\n🎯 Entrance: ${collegeData.admissions.pgEntrance}\n📅 Application Dates: ${collegeData.admissions.applicationDates.pg}\n\nWe offer M.E in Applied Electronics, CSE, Power Systems, and MCA program.`;
  }
  
  if (query.includes('phd') || query.includes('doctorate')) {
    return `For Ph.D Admissions:\n\n📋 Eligibility: ${collegeData.admissions.phdEligibility}\n🔬 Specializations: ${collegeData.courses.doctorate[0].specializations.join(', ')}\n⏱️ Duration: ${collegeData.courses.doctorate[0].duration}\n\nContact the college directly for Ph.D application procedures.`;
  }
  
  return `VSB Engineering College offers admissions for UG, PG, and Ph.D programs:\n\n🎓 UG: ${collegeData.admissions.ugEntrance} (${collegeData.admissions.applicationDates.ug})\n🎓 PG: ${collegeData.admissions.pgEntrance} (${collegeData.admissions.applicationDates.pg})\n🎓 Ph.D: Direct contact required\n\nWhich program are you interested in?`;
}

function generateCoursesResponse(query) {
  if (query.includes('ug') || query.includes('undergraduate') || query.includes('btech') || query.includes('be')) {
    let response = "🎓 Undergraduate Courses at VSB Engineering College:\n\n";
    collegeData.courses.undergraduate.slice(0, 5).forEach((course, index) => {
      response += `${index + 1}. ${course.name}\n   Duration: ${course.duration} | Intake: ${course.intake} | Fees: ${course.fees}\n\n`;
    });
    response += `...and ${collegeData.courses.undergraduate.length - 5} more programs!\n\nAll UG programs are 4-year courses with excellent placement opportunities!`;
    return response;
  }
  
  if (query.includes('pg') || query.includes('postgraduate') || query.includes('mtech') || query.includes('me') || query.includes('mca')) {
    let response = "🎓 Postgraduate Courses:\n\n";
    collegeData.courses.postgraduate.forEach((course, index) => {
      response += `${index + 1}. ${course.name}\n   Duration: ${course.duration} | Fees: ${course.fees}\n`;
      if (course.intake) response += `   Intake: ${course.intake}\n`;
      response += "\n";
    });
    return response;
  }
  
  if (query.includes('cse') || query.includes('computer science')) {
    return "💻 Computer Science Programs:\n\n1. B.E Computer Science and Engineering (4 years, 180 seats, ₹2.2 Lakhs)\n2. B.Tech Information Technology (4 years, 180 seats, ₹2.2 Lakhs)\n3. B.Tech AI and Data Science (4 years, 240 seats, ₹2.2 Lakhs)\n4. M.E Computer Science and Engineering (2 years, 15 seats, ₹60,000)\n\nThese programs have excellent placement records with top tech companies!";
  }
  
  if (query.includes('ece') || query.includes('electronics')) {
    return "⚡ Electronics Programs:\n\n1. B.E Electronics and Communication Engineering (4 years, 360 seats, ₹2.2 Lakhs)\n2. B.E Electrical and Electronics Engineering (4 years, 60 seats, ₹2.2 Lakhs)\n3. M.E Applied Electronics (2 years, 15 seats, ₹60,000)\n\nECE has the highest intake with 360 seats and great industry connections!";
  }
  
  let response = "📚 VSB Engineering College offers:\n\n";
  response += `🎓 ${collegeData.courses.undergraduate.length} Undergraduate Programs\n`;
  response += `🎓 ${collegeData.courses.postgraduate.length} Postgraduate Programs\n`;
  response += `🎓 Ph.D in ${collegeData.courses.doctorate[0].specializations.length} specializations\n\n`;
  response += "Popular branches: CSE, ECE, IT, AI & Data Science, Mechanical, Civil.\n\nWhich specific program interests you?";
  
  return response;
}

function generatePlacementsResponse(query) {
  if (query.includes('highest') || query.includes('maximum')) {
    return `🎉 Highest Package: ${collegeData.placements.highestPackage}\n\nThis shows the quality of education and industry recognition VSB Engineering College has achieved. Our students are placed in top companies across various sectors.`;
  }
  
  if (query.includes('average') || query.includes('mean')) {
    return `📊 Average Package: ${collegeData.placements.averagePackage}\n📊 Median Salary: ${collegeData.placements.medianSalary}\n📊 Total Offers (2024): ${collegeData.placements.totalOffers2024}\n\nThese statistics reflect consistent placement performance across all branches.`;
  }
  
  if (query.includes('companies') || query.includes('recruiter')) {
    return `🏢 Top Recruiting Companies:\n\n${collegeData.placements.topRecruiters.slice(0, 8).map((company, index) => `${index + 1}. ${company}`).join('\n')}\n\n...and many more companies regularly visit our campus for recruitment drives!`;
  }
  
  return `💼 Placement Highlights at VSB Engineering College:\n\n🎯 Placement Rate: ${collegeData.placements.placementRate}\n💰 Highest Package: ${collegeData.placements.highestPackage}\n💰 Average Package: ${collegeData.placements.averagePackage}\n📊 Total Offers (2024): ${collegeData.placements.totalOffers2024}\n\n🎓 Training: ${collegeData.placements.placementTraining}\n\nOur placement cell ensures students are industry-ready!`;
}

function generateFacilitiesResponse() {
  return `🏢 Facilities at VSB Engineering College:\n\n${collegeData.facilities.map((facility, index) => `${index + 1}. ${facility}`).join('\n')}\n\nAll facilities are modern and well-maintained to provide the best learning environment for our students.`;
}

function generateContactResponse() {
  return `📞 Contact VSB Engineering College:\n\n📍 Address: ${collegeData.address}\n📞 Phone: ${collegeData.phone}\n📧 Email: ${collegeData.email}\n🌐 Website: ${collegeData.website}\n\nFeel free to contact the college directly for any specific queries!`;
}

function generateFeesResponse(query) {
  if (query.includes('ug') || query.includes('undergraduate') || query.includes('btech') || query.includes('be')) {
    return `💰 UG Course Fees: ₹2.2 Lakhs per year\n\nThis fee structure is uniform across all undergraduate engineering programs (B.E/B.Tech).`;
  }
  
  if (query.includes('pg') || query.includes('postgraduate') || query.includes('mtech') || query.includes('me')) {
    return `💰 PG Course Fees:\n\n• M.E Programs: ₹60,000 per year\n• MCA: ₹41,000 per year\n\nPG programs offer excellent value with lower fees and high placement potential.`;
  }
  
  return `💰 Fee Structure at VSB Engineering College:\n\n🎓 UG (B.E/B.Tech): ₹2.2 Lakhs per year\n🎓 PG (M.E): ₹60,000 per year\n🎓 MCA: ₹41,000 per year\n\nContact the college for scholarship information.`;
}

function generateCollegeInfoResponse() {
  return `🏛️ About VSB Engineering College:\n\n📅 Established: ${collegeData.established}\n📍 Location: ${collegeData.location}\n🏢 Type: ${collegeData.type}\n👨‍💼 Chairman: ${collegeData.chairman}\n🎓 Total Seats: ${collegeData.totalSeats}\n\n✅ Approved by: ${collegeData.approvals.join(', ')}\n🏆 Ranking: ${collegeData.rankings.siliconIndia}\n\nVSB Engineering College is known for quality education and excellent placements!`;
}

// Menu Functions
function openMenu() {
  menuModal.classList.remove('hidden');
}

function closeMenu() {
  menuModal.classList.add('hidden');
}

function clearChat() {
  chatMessages.innerHTML = '';
  chatHistory = [];
  quickActions.style.display = 'block';
  closeMenu();
  showToast('Chat history cleared');
  
  // Add welcome message again
  setTimeout(() => {
    addBotMessage("Chat cleared! How can I help you with VSB Engineering College information?");
  }, 500);
}

function showAbout() {
  closeMenu();
  addBotMessage("I'm Tezzaract, an AI-powered chatbot designed to help students and parents get information about VSB Engineering College. I can answer questions about admissions, courses, placements, facilities, and more!\n\nBuilt with GPT-2 technology to provide accurate and helpful responses. 🤖✨");
}

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}