import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const steps = ["Username", "College", "Email", "Date of Birth", "Password", "Finish"];

// Cleaned college list (duplicates removed, typos fixed)
const collegesList = [
  "Allahabad College Of Engineering And Management, Allahabad",
  "Allahabad Degree College, Allahabad",
  "Allahabad University Institute of Professional Studies, Allahabad",
  "Allahabad University, Allahabad",
  "CMP Degree College, Allahabad",
  "Ewing Christian College, Allahabad",
  "Government Girls Polytechnic, Allahabad",
  "HMFA Memorial Institute of Engineering and Technology, Allahabad",
  "IICS College, Allahabad",
  "Indian Institute of Information Technology, Allahabad",
  "INS Engineering & Management College, Allahabad",
  "Institute of Engineering and Rural Technology, Allahabad",
  "J.K Institute of Applied Physics and Technology, Allahabad",
  "Madhu Vachaspati Institute of Engineering and Technology, Allahabad",
  "MNNIT, Allahabad",
  "Motilal Nehru Institute of Research and Business Administration, Allahabad",
  "Sam Higginbottom University of Agriculture, Technology and Sciences, Allahabad",
  "Shambhunath Institute of Engineering and Technology, Allahabad",
  "United College of Engineering and Research, Allahabad",
  "United College of Engineering and Management, Allahabad",
  "United Institute of Technology, Allahabad",
  "NIT Agartala, Agartala",
  "Ahmedabad University, Ahmedabad",
  "Amrut Modi School of Management, Ahmedabad",
  "Babaria Institute of Technology, Vadodara, Ahmedabad",
  "Dhirubhai Ambani Institute of Information and Communication Technology, Ahmedabad",
  "Gandhinagar Institute of Technology, Ahmedabad",
  "L.J. Institute of Business Administration, Ahmedabad",
  "L.J.I.E.T, Ahmedabad",
  "Pandit Deendayal Petroleum University, Ahmedabad",
  "Sal College of Engineering, Ahmedabad",
  "Aligarh Muslim University, Aligarh",
  "G.H. Raisoni College of Engineering and Management, Amravati",
  "Government College of Engineering Amravati (GCOEA), Amravati",
  "HVPM College of Engineering and Technology, Amravati",
  "Prof. Ram Meghe Institute of Technology & Research, Amravati",
  "Shri Shivaji Science College, Amravati",
  "Intell Engineering College, Ananthapur",
  "Balasore College of Engineering and Technology, Balasore",
  "Rajkiya Engineering College, Banda",
  "Acharya Institute of Graduate Studies, Bangalore",
  "AMC City Engineering College, Bangalore",
  "Christ University, Bangalore",
  "Institute of Finance and International Management, Bangalore",
  "International Institute of Information Technology, Bangalore",
  "International School of Management Excellence, Bangalore",
  "Kalpataru Institute of Technology, Bangalore",
  "M S Ramaiah Institute of Technology, Bangalore",
  "National Institute of Business Excellence, Bangalore",
  "New Horizon College of Engineering, Bangalore",
  "NMIMS - Narsee Monjee Institute of Management Studies, Bangalore",
  "Polytechnic, Bangalore",
  "R. V. College of Engineering, Bangalore",
  "RNS Institute of Technology, Bangalore",
  "Purulia Polytechnic, Bankura",
  "Giani Zail Singh Punjab Technical University Campus, Bathinda",
  "C.V. Raman College of Engineering, Behramour",
  "National Institute of Science and Technology, Behrampur",
  "Bihar Agricultural University, Bhagalpur",
  "MLV Textile and Engineering College, Bhilwara",
  "Bansal Group of Institutions, Bhopal",
  "ICSI, Bhopal",
  "IES College of Technology, Bhopal",
  "Institute of Professional Education and Research (IPER), Bhopal",
  "Jagran Lakecity University, Bhopal",
  "Lakshmi Narain College of Technology, Bhopal",
  "Malhotra Technical Research Institute, Bhopal",
  "Maulana Azad National Institute of Technology, Bhopal",
  "Millennium Group of Institutions, Bhopal",
  "NRI Group of Institutions, Bhopal",
  "Oriental College of Engineering, Bhopal",
  "Oriental Institute of Science and Technology, Bhopal",
  "Patel Institute of Technology, Bhopal",
  "Radharaman Engineering College, Bhopal",
  "Radharaman Institute of Technology and Science, Bhopal",
  "RKDF University, Bhopal",
  "S.V. Polytechnic College, Bhopal",
  "Sagar Institute of Science Technology & Engineering, Bhopal",
  "Samrat Ashok Technological Institute, Bhopal",
  "SIRT, Bhopal",
  "SISTEC-E, Bhopal",
  "Technocrats Institute of Technology, Bhopal",
  "Truba Institute of Engineering and Information Technology, Bhopal",
  "University Institute of Technology, RGPV, Bhopal",
  "BJB Autonomous College, Bhubaneswar",
  "C.V. Raman College of Engineering, Bhubaneswar",
  "College of Engineering and Technology, Bhubaneswar",
  "College of Engineering Bhubaneswar, Bhubaneswar",
  "Gandhi Engineering College, Bhubaneswar",
  "Gandhi Institute for Technological Advancement, Bhubaneswar",
  "Gandhi Institute of Technology & Management, Bhubaneswar",
  "Hi Tech Institute of Technology, Bhubaneswar",
  "Indian Institute of Technology Bhubaneswar, Bhubaneswar",
  "Institute of Technical Education & Research, Bhubaneswar",
  "International Institute of Information Technology, Bhubaneswar",
  "KIIT School of Management, Bhubaneswar",
  "KIIT University, Bhubaneswar",
  "Koustuva Institute of Self Domain, Bhubaneswar",
  "Orissa Engineering College, Bhubaneswar",
  "Prananath College, Bhubaneswar",
  "Siksha O Anusandhan University, Bhubaneswar",
  "Silicon Institute of Technology, Bhubaneswar",
  "Trident Academy of Technology, Bhubaneswar",
  "Xavier Institute of Management, Bhubaneswar",
  "Government College of Engineering and Technology, Bikaner",
  "Government Engineering College, Bilaspur",
  "Guru Ghasidas Vishwavidyalaya, Bilaspur",
  "Veer Surendra Sai University of Technology, Burla",
  "Guru Nanak Institute of Technology, Mullana, Chandigarh",
  "Panjab University SSG Regional Center, Chandigarh",
  "PUIET, Chandigarh",
  "University Business School, Chandigarh",
  "Annamalai University, Chennai",
  "Dr. M.G.R. Educational, Chennai",
  "Dr. Magalingam College of Engineering & Technology, Pollachi, Coimbatore, Chennai",
  "Great Lakes Institute of Management, Chennai",
  "Hindustan University, Chennai",
  "Karunya University, Chennai",
  "Loyola Institute of Business Administration, Chennai",
  "P.S.G College of Technology, Chennai",
  "Pandian Saraswathi Yadav Engineering College, Chennai",
  "Sri Sairam Engineering College, Chennai",
  "Sri Sairam Institute of Technology, Chennai",
  "SRM University, Chennai",
  "St. Josephs College of Engineering, Chennai",
  "VIT University, Chennai",
  "Ravenshaw University, Cuttack",
  "Soa University, ITER, Cuttack",
  "Sri Sri University, Cuttack",
  "DIT University, Dehradun",
  "Graphic Era University, Dehradun",
  "Guru Ram Das Institute of Management and Technology, Dehradun",
  "Tula's Institute, Dehradun",
  "University of Petroleum and Energy Studies, Dehradun",
  "Uttaranchal Institute of Management, Dehradun",
  "Uttaranchal Institute of Technology, Dehradun",
  "Jamia Millia Islamia, New Delhi, Delhi",
  "Bhagwan Parshuram Institute of Technology, Delhi",
  "Bhaskaracharya College of Applied Sciences, University of Delhi, Delhi",
  "Ch. Brahm Prakash Government Engineering College, Delhi",
  "College of Vocational Studies, Delhi University, Delhi",
  "Delhi Technological University, Delhi",
  "Department of Business Economics, Delhi University, Delhi",
  "Faculty of Management Studies, Delhi",
  "IIT Delhi, Delhi",
  "Indira Gandhi Institute of Technology, Delhi",
  "Jamia Hamdard University, Delhi",
  "Jawaharlal Nehru University, Delhi",
  "Jesus and Mary College, Delhi",
  "Kirori Mal College, Delhi",
  "Maharaja Agrasen Institute of Technology, Delhi",
  "Netaji Subhas Institute of Technology, Delhi",
  "Northern India Engineering College, Delhi",
  "Shaheed Bhagat Singh College, Delhi",
  "Shri Ram College of Commerce, Delhi",
  "Sri Aurobindo College, Delhi",
  "Sri Aurobindo College (Evening), Delhi",
  "Sri Venkateswara College, Delhi",
  "The Institute of Chartered Accountants of India, Delhi",
  "Translational Health Science and Technology Institute, Delhi",
  "Vivekananda Institute of Advanced Studies, Delhi",
  "Vivekananda Institute of Professional Studies, Delhi",
  "BIT Sindri, Dhanbad",
  "Indian Institute of Technology, Dhanbad",
  "Bhilai Institute of Technology, Durg",
  "Christian College of Engineering and Technology, Durg",
  "Dignity College of Architecture, Durg",
  "Rungta College of Engineering & Technology, Durg",
  "Shri Shankaracharya Institute of Technology and Management, Durg",
  "B.C. Roy Engineering College, Durgapur",
  "BCET Durgapur, Durgapur",
  "Bengal Institute of Technology and Management, Durgapur",
  "DIATM, Durgapur",
  "National Power Training Institute, Durgapur",
  "NIT Durgapur, Durgapur",
  "Manav Rachna International University, Faridabad",
  "MVN University, Faridabad",
  "YMCA University of Science and Technology, Faridabad",
  "Leelaben Dashrathbhai Ramdas Patel Institute of Technology and Research, Gandhinagar",
  "Shankersinh Vaghela Bapu Institute of Technology, Gandhinagar",
  "Birla Institute of Technology and Science, Goa",
  "Birla Institute of Technology and Science, Pilani K.K. Birla Goa Campus, Goa",
  "National Institute of Technology, Goa",
  "Acharya Nagarjuna University, Guntur",
  "Bapatla Engineering College, Guntur",
  "K L University, Guntur",
  "KKR and KSR Institute of Technology, Guntur",
  "LIFE, Guntur",
  "RVR & JC College of Engineering, Guntur",
  "Vasireddy Venkatadri Institute of Technology, Guntur",
  "Vignan University, Guntur",
  "Gandhi Institute of Engineering and Technology, Gunupur",
  "Ansal University, Gurugram",
  "BML Munjal University, Gurugram",
  "Dronacharya College of Engineering, Gurugram",
  "IILM Institute for Business and Management, Gurugram",
  "Assam Engineering College, Jalukbari, Guwahati",
  "IIT Guwahati, Guwahati",
  "Indian Institute of Information Technology and Management, Gwalior",
  "ITM University Gwalior, Gwalior",
  "Madhav Institute of Technology and Science, Gwalior",
  "Prestige Institute of Management, Gwalior",
  "Dr. Meghnand Saha Institute of Technology, Haldia",
  "Haldia Institute of Technology, Haldia",
  "BIT Institute of Technology, Hindupur",
  "Guru Jambheshwar University of Technology, Hisar",
  "Al Habeeb College of Engineering and Technology, Hyderabad",
  "Azad College of Engineering and Technology, Hyderabad",
  "B.V. Raju Institute of Technology, Hyderabad",
  "Chaitanya Bharathi Institute of Technology, Hyderabad",
  "CMR Engineering College, Hyderabad",
  "CMR Institutions, Hyderabad",
  "CMR Technical Campus, Hyderabad",
  "CVR College of Engineering, Hyderabad",
  "CVSR College of Engineering, Hyderabad",
  "Deccan College of Engineering and Technology, Hyderabad",
  "GITAM University, Hyderabad",
  "Gokaraju Rangaraju Institute of Engineering and Technology, Hyderabad",
  "Guru Nanak Institute of Technology, Hyderabad",
  "Guru Nanak Institutions Technical Campus, Hyderabad",
  "Hyderabad Institute of Technology and Management, Hyderabad",
  "ICFAI, Hyderabad",
  "IIT Hyderabad, Hyderabad",
  "JNTUH College of Engineering Hyderabad, Hyderabad",
  "KMIT, Hyderabad",
  "Mahatma Gandhi Institute of Technology, Hyderabad",
  "Mahindra Ecole Centrale, Hyderabad",
  "Malla Reddy Engineering College, Hyderabad",
  "Matrusri Engineering College, Hyderabad",
  "Maturi Venkata Subba Rao Engineering College, Hyderabad",
  "Methodist College of Engineering & Technology, Hyderabad",
  "National Institute of Fashion Technology (NIFT), Hyderabad",
  "RGUKT IIIT, Hyderabad",
  "RVR Group of Institutions, Hyderabad",
  "Shadan College of Engineering and Technology, Hyderabad",
  "Sreenidhi Institute of Science and Technology, Hyderabad",
  "Sreyas Institute of Science & Technology, Hyderabad",
  "Sri Indu College of Engineering and Technology, Hyderabad",
  "Swami Vivekananda Institute of Technology, Hyderabad",
  "TKR College of Engineering & Technology, Hyderabad",
  "University of Hyderabad, Hyderabad",
  "Vardhaman College of Engineering, Hyderabad",
  "Vasavi College of Engineering, Hyderabad",
  "Vignana Bharati Institute of Technology, Hyderabad",
  "Vijaya School of Business Management, Hyderabad",
  "Visiontech College of Engineering, Hyderabad",
  "VNR Vignana Jyothi Institute of Engineering and Technology, Hyderabad",
  "Warangal Institute of Technology, Hyderabad",
  "Acropolis Institute of Technology and Research, Indore",
  "CDGI, Indore",
  "Government Engineering College of Ujjain, Indore",
  "IET DAVV, Indore",
  "Indore Institute of Science and Technology, Indore",
  "Institute of Engineering and Science IPS Academy, Indore",
  "International Institute of Professional Studies, Indore",
  "LNCT Indore, Indore",
  "Lord Krishna College of Technology, Indore",
  "Malwa Institute of Technology, Indore",
  "Medi-Caps Institute of Science & Technology, Indore",
  "Medi-Caps Institute of Technology & Management, Indore",
  "MIT Mandsaur, Indore",
  "Oriental University, Indore",
  "Prestige Institute of Engineering, Management and Research, Indore",
  "Prestige Institute of Management and Research, Indore",
  "Sanghvi Institute of Management and Science, Indore",
  "Shri Govindram Seksaria Institute of Technology and Science, Indore",
  "Shri Vaishnav Institute of Technology and Science, Indore",
  "Sri Aurobindo Institute of Technology, Indore",
  "St. Paul Institute of Professional Studies, Indore",
  "Sushila Devi Bansal College of Technology, Indore",
  "Swami Vivekanand College of Engineering, Indore",
  "Global College of Engineering and Technology, Jabalpur",
  "GS College of Commerce and Management, Jabalpur",
  "Guru Ramdas Khalsa Institute of Science and Technology, Jabalpur",
  "Gyan Ganga College of Technology (GGCT), Jabalpur",
  "Gyan Ganga Institute of Technology & Sciences (GGITS), Jabalpur",
  "Hitkarini College of Engineering and Technology, Jabalpur",
  "ICFAI National College College of Materials Management, Jabalpur",
  "Indian Institute of Information Technology, Design and Manufacturing (IIIT-DM), Jabalpur",
  "Jabalpur Engineering College (JEC), Jabalpur",
  "Lakshmi Narain College of Technology (LNCT), Jabalpur",
  "Mata Gujri Mahila Mahavidyalaya, Jabalpur",
  "Millennium College of Professional Education, Jabalpur",
  "Oriental Engineering College, Jabalpur",
  "Oriental Institute of Science & Technology (OIST), Jabalpur",
  "Prakash Institute of Technology, Jabalpur",
  "Radhaswami Institute of Engineering, Jabalpur",
  "Rani Durgavati Vishwavidyalaya, Jabalpur",
  "Saraswati Institute of Technology, Jabalpur",
  "SGBM Institute of Technology & Science (SGBMITS), Jabalpur",
  "Shri Ram Institute of Management, Jabalpur",
  "Shri Ram Institute of Technology, Jabalpur",
  "St. Aloysius College, Jabalpur",
  "Takshila College of Engineering and Technology, Jabalpur",
  "University Institute of Management, Jabalpur",
  "Vindhya Institute of Technology & Science (VITS), Jabalpur",
  "Xavier Institute of Management, Jabalpur",
  "Government Engineering College, Jagdalpur",
  "Amity University Rajasthan, Jaipur",
  "Apex Group of Institutions, Jaipur",
  "Banasthali University, Jaipur",
  "Birla Institute of Technology and Science, Jaipur",
  "Biyani Group of Colleges, Jaipur",
  "Chanakya Technical Campus, Jaipur",
  "Engineers Academy, Jaipur",
  "Global Institute of Technology, Jaipur",
  "International College for Girls, Jaipur",
  "Jaipur National University, Jaipur",
  "JECRC UDML College of Engineering, Jaipur",
  "JECRC University, Jaipur",
  "LNMIIT, Jaipur",
  "Maharishi Arvind College of Engineering & Research Center, Jaipur",
  "Maharishi Arvind Institute of Engineering & Technology, Jaipur",
  "Malaviya National Institute of Technology, Jaipur",
  "Manipal University Jaipur, Jaipur",
  "PIET, Jaipur",
  "Poornima Group of Institutions, Jaipur",
  "Poornima College of Engineering, Jaipur",
  "Poornima University, Jaipur",
  "Suresh Gyan Vihar School of Engineering & Technology, Jaipur",
  "Swami Keshvanand Institute of Technology, Jaipur",
  "University of Engineering and Management, Jaipur",
  "Yagyavalkya Institute of Technology, Jaipur",
  "Dr. B. R. Ambedkar National Institute of Technology, Jalandhar",
  "Lovely Professional University, Jalandhar",
  "Jalpaiguri Government Engineering College, Jalpaiguri",
  "MBS College of Engineering and Technology (MBSCET), Jammu",
  "Shri Vaishno Devi University, Jammu",
  "Jain College, Jamshedpur",
  "National Institute of Technology, Jamshedpur",
  "Netaji Subhas Institute of Business Management, Jamshedpur",
  "XLRI - Xavier School of Management, Jamshedpur",
  "R.V.S College of Engineering and Technology, Jamshedpur",
  "JIET, Jodhpur",
  "MBM, Jodhpur",
  "Mulungushi University, Kabwe",
  "Allenhouse Institute of Technology, Kanpur",
  "Apollo Institute of Technology, Kanpur",
  "Axis College, Kanpur",
  "Dr. Gaur Hari Singhania Institute of Management & Research, Kanpur",
  "Dr. Virendra Swarup Group of Institutions, Kanpur",
  "Dr. Virendra Swarup Institute of Computer Studies (VSICS), Kanpur",
  "Harcourt Butler Technical Institute, Kanpur",
  "Indian Institute of Technology Kanpur, Kanpur",
  "Jagran College of Arts, Science and Commerce, Kanpur",
  "Kanpur Institute of Technology, Kanpur",
  "Krishna Institute of Technology, Kanpur",
  "Maharana Pratap Engineering College, Kanpur",
  "Pranveer Singh Institute of Technology, Kanpur",
  "Jyothismathi Institute of Technological Sciences, Karimnagar",
  "IIT Kharagpur, Kharagpur",
  "Swami Vivekananda Institute of Science and Technology, Kolkata",
  "Academy of Technology, Kolkata",
  "Adamas Institute of Technology, Kolkata",
  "Adamas University, Kolkata",
  "Aliah University, Kolkata",
  "Amity University, Kolkata",
  "Army Institute of Management, Kolkata",
  "B. P. Poddar Institute of Management & Technology, Kolkata",
  "Calcutta Business School, Kolkata",
  "Calcutta Institute of Engineering and Management, Kolkata",
  "Calcutta Institute of Technology, Kolkata",
  "Future Institute of Engineering and Management, Kolkata",
  "Globsyn Business School, Kolkata",
  "Heritage Institute of Technology, Kolkata",
  "Hooghly Engineering and Technology College, Kolkata",
  "I LEAD, Kolkata",
  "Indian Institute of Engineering Science and Technology, Shibpur, Kolkata",
  "Institute of Engineering & Management, Kolkata",
  "International Management Institute Kolkata, Kolkata",
  "J.D. Birla Institute, Kolkata",
  "Jadavpur University, Kolkata",
  "JIS College of Engineering, Kolkata",
  "Kalyani Government Engineering College, Kolkata",
  "Meghnad Saha Institute of Technology, Kolkata",
  "Narula Institute of Technology, Kolkata",
  "Neotia Institute of Technology, Management and Science, Kolkata",
  "Netaji Subhash Engineering College, Kolkata",
  "Prafulla Chandra College, Kolkata",
  "Presidency University, Kolkata",
  "RCC IIT, Kolkata",
  "Scottish Church College, Kolkata",
  "Shri Shikshayatan College, Kolkata",
  "St. Thomas College of Engineering and Technology, Kolkata",
  "Techno India College of Technology, Kolkata",
  "Techno India Salt Lake - B.Tech, Kolkata",
  "Techno India Salt Lake - MBA Section, Kolkata",
  "Techno India School of Management Studies, Kolkata",
  "Techno India University, Kolkata",
  "The Bhawanipur Education Society College, Kolkata",
  "University of Engineering & Management, Kolkata (UEMK), Kolkata",
  "Institute of Management Studies (IMS), Kurukshetra University, Kurukshetra",
  "NIT Kurukshetra, Kurukshetra",
  "Amity University, Lucknow",
  "Babu Banarasi Das Northern India Institute of Technology, Lucknow",
  "BBAU Lucknow, Lucknow",
  "City Montessori, Lucknow",
  "Indian Institute of Management Lucknow, Lucknow",
  "Institute of Engineering and Technology, Lucknow",
  "Integral University, Lucknow",
  "Jaipuria Institute of Management, Lucknow",
  "S V M Inter College, Lucknow",
  "Sri Ramswaroop Memorial College of Engineering and Management, Lucknow",
  "Manipal Institute of Technology, Manipal",
  "GLA University, Mathura",
  "Lions School, Mirzapur",
  "Chandigarh University, Mohali",
  "K.J. Somaiya College, Mumbai",
  "Aditya Institute of Management Studies, Mumbai",
  "Atharva College of Engineering, Mumbai",
  "BT Institute of Journalism, Mumbai",
  "Durgadevi Saraf Institute of Management Studies, Mumbai",
  "K.J. Somaiya College of Engineering, Mumbai",
  "K.J. Somaiya Institute of Management Studies and Research, Mumbai",
  "Nagindas Khandwala College, Mumbai",
  "Sardar Patel College of Engineering, Mumbai",
  "Sardar Patel Institute of Technology, Mumbai",
  "St. Francis Institute of Technology, Mumbai",
  "Sydenham Institute of Management Studies, Research and Entrepreneurship Education, Mumbai",
  "Tata Institute of Social Science, Mumbai",
  "Thadomal Shahani Engineering College, Mumbai",
  "Thakur Institute of Management Studies & Research, Mumbai",
  "Vartak College of Engineering and Technology, Mumbai",
  "Veermata Jijabai Technological Institute, Mumbai",
  "Vidyalankar School of Information, Mumbai",
  "Anjuman College, Nagpur",
  "Dr. Ambedkar Institute of Management and Research, Nagpur",
  "G.H. Raisoni College of Engineering, Nagpur",
  "GNIET, Nagpur",
  "GS College of Commerce, Nagpur",
  "Hislop College, Nagpur",
  "IMT, Nagpur",
  "Indian Institute of Management, Nagpur",
  "Kavi Kulguru Institute of Technology & Science, Nagpur",
  "MGI Group of Institutions, Nagpur",
  "Nagpur Institute of Technology, Nagpur",
  "Priyadarshini College of Engineering, Nagpur",
  "Priyadarshini Institute of Engineering and Technology, Nagpur",
  "Priyadarshini Lokmanya Tilak Institute of Management Studies & Research, Nagpur",
  "SB Jain, Nagpur",
  "Shatayu College of Professional Studies, Nagpur",
  "Shri Ramdeobaba College of Engineering and Management, Nagpur",
  "St. Vincent Pallotti College, Nagpur",
  "Tirpude Institute of Management Education, Nagpur",
  "VNIT, Nagpur",
  "Yashoda Public Higher Secondary School, Nagpur",
  "Amity University, Noida",
  "Army Institute of Management and Technology, Noida",
  "Galgotias College of Engineering and Technology, Noida",
  "GL Bajaj Institute of Technology and Management, Noida",
  "ITS Engineering College, Noida",
  "JRE Group of Institutions, Noida",
  "JSS Academy of Technical Education, Noida",
  "MGM College of Engineering and Technology, Noida",
  "Noida Institute of Engineering and Technology, Noida",
  "Shiv Nadar University, Noida",
  "Centurion University of Technology and Management, Paralakhemundi",
  "Thapar University, Patiala",
  "Admerit College, Patna",
  "Amity Global Business School, Patna",
  "Arcade Business College, Patna",
  "Bihar National College, Patna",
  "Birla Institute of Technology, Patna",
  "CIMAGE, Patna",
  "Indian Institute of Technology Patna, Patna",
  "International Business College, Patna",
  "LNM Institute of Economic Development and Social Change, Patna",
  "Magadh Mahila College, Patna",
  "National Institute of Technology, Patna",
  "Patna Science College, Patna",
  "Patna Womens College, Patna",
  "R.P. Sharma Institute of Technology, Patna",
  "Usha Martin Academy, Patna",
  "Vanijya Mahavidyalaya, Patna University, Patna",
  "Birla Institute of Technology and Science, Pilani",
  "Pondicherry University, Pondicherry",
  "School of Management, Pondicherry University, Pondicherry",
  "MKSSS Cummins College of Engineering for Women, Pune",
  "AISSMS College of Engineering, Pune",
  "Allana Institute of Management Sciences, Pune",
  "College of Engineering, Pune",
  "Dhole Patil College of Engineering, Pune",
  "DPSS Foresight College of Commerce, Pune",
  "DY Patil College of Engineering, Pune",
  "International Institute of Information Technology, Pune",
  "Maharashtra Institute of Technology, Pune",
  "Pimpri Chinchwad College of Engineering, Pune",
  "Pune Institute of Computer Technology, Pune",
  "Shahu College, Pune",
  "Sinhgad College of Engineering, Pune",
  "Sinhgad Institute of Management, Pune",
  "Smt. Kashibai Navale College of Engineering, Pune",
  "Symbiosis Institute of International Business, Pune",
  "TSSM Bhivarabai Sawant College of Engineering and Research, Pune",
  "Vishwakarma Institute of Management, Pune",
  "Vishwakarma Institute of Technology, Pune",
  "Kirodimal Institute of Technology, Raigarh",
  "O.P Jindal University, Raigarh",
  "AVS Presidency International College, Raipur",
  "Bhilai Institute of Technology, Raipur",
  "Disha College of Engineering & Management, Raipur",
  "Government Engineering College, Raipur",
  "IIM Raipur, Raipur",
  "IIT Bhilai, Raipur",
  "ITM University, Raipur",
  "Kruti Institute of Technology and Engineering, Raipur",
  "MATS University, Raipur",
  "National Institute of Technology, Raipur",
  "Raipur Institute of Technology, Raipur",
  "Rungta College of Engineering, Raipur",
  "Rungta College of Engineering & Technology, Raipur",
  "Shri Shankaracharya Technical Campus, Raipur",
  "GIET College of Engineering, Rajamundry",
  "Late Shree S.G Dholakiya Memorial High School, Rajkot",
  "Chitkara Institute of Engineering and Technology, Rajpura",
  "Amity University Ranchi, Ranchi",
  "Birla Institute of Technology, Mesra, Ranchi",
  "Birsa Institute of Technology Sindri, Ranchi",
  "Central University of Jharkhand, Ranchi",
  "Doranda College, Ranchi",
  "Gossner College, Ranchi",
  "ICFAI University, Jharkhand (IUJ), Ranchi",
  "IIM Ranchi, Ranchi",
  "Institute of Management Studies, Ranchi University, Ranchi",
  "Marwari College, Ranchi",
  "Ranchi College, Ranchi",
  "Xavier Institute of Social Service, Ranchi",
  "Indian Institute of Technology, Ropar",
  "IIT Roorkee, Roorkee",
  "NIT Rourkela, Rourkela",
  "Surendra Institute of Engineering & Management, Siliguri",
  "National Institute of Food Technology Entrepreneurship and Management, Sonipat",
  "Aditya Institute of Technology and Management, Srikakulam",
  "JNTU College of Engineering, Sultanpur",
  "Kamla Nehru Institute of Technology, Sultanpur",
  "AURO University, Surat",
  "C.K. Pithawala College of Engineering and Technology, Surat",
  "Sardar Vallabhbhai National Institute of Technology, Surat",
  "Sarvajanik College of Engineering and Technology, Surat",
  "Tamralipta Mahavidyalaya, Tamluk",
  "Siddaganga Institute of Technology, Tumkur",
  "Udalguri College, Udalguri",
  "Manipal Institute of Technology, Udupi",
  "BHU Banaras, Varanasi",
  "School of Management Sciences, Varanasi",
  "Andhra Loyola Institute, Vijayawada",
  "Dhanekula Institute of Engineering and Technology, Vijayawada",
  "Gudlavalleru Engineering College, Vijayawada",
  "Lakireddy Bali Reddy College of Engineering, Vijayawada",
  "NRI Institute of Technology, Vijayawada",
  "P.B. Siddhartha College of Arts and Sciences, Vijayawada",
  "Prasad V Potluri Siddhartha Institute of Technology, Vijayawada",
  "PSCMR College of Engineering & Technology, Vijayawada",
  "SRK Institute of Technology, Vijayawada",
  "V.R. Siddhartha College of Engineering, Vijayawada",
  "Aditya Degree College, Visakhapatnam",
  "Andhra University College of Engineering, Visakhapatnam",
  "Anil Neerukonda Institute of Technology and Sciences, Visakhapatnam",
  "AQJ PG College, Visakhapatnam",
  "B.V.K. College, Visakhapatnam",
  "BITS, Vizag, Visakhapatnam",
  "Dr. L. Bullayya College, Visakhapatnam",
  "Gandhi Institute of Technology and Management, Visakhapatnam",
  "Gayatri Vidya Parishad, Visakhapatnam",
  "Gonna Institute of Information Technology and Sciences (GIITS), Visakhapatnam",
  "Prism College, Visakhapatnam",
  "Raghu Engineering College, Visakhapatnam",
  "Raghu Jr. College, Visakhapatnam",
  "Sanketika Vidya Parishad College, Visakhapatnam",
  "Vignan Institute of Information Technology, Duvvada, Visakhapatnam",
  "Lendi Institute of Engineering and Technology, Vizianagaram",
  "M.V.G.R. College of Engineering, Vizianagaram",
  "Alluri Institute of Management Sciences, Warangal",
  "Christhu Jyothi Institute of Technology & Sciences, Warangal",
  "National Institute of Technology, Warangal",
  "S.R. Engineering College, Warangal",
  "SVS Engineering College, Warangal",
  "LDC Institute of Technical Studies, Allahabad",
  "B.B.S. College of Engineering and Technology, Allahabad",
  "Vatsalya Institute of Nursing and Para Medical Sciences, Allahabad",
  "Chhatrapati Shivaji Maharaj College of Engineering, Allahabad",
  "Motilal Nehru Medical College, Allahabad",
  "Devprayag Institute of Technical Studies, Allahabad",
  "UPRTOU School of Computer and Information Sciences, Allahabad",
  "Sadanlal Sanwaldas Khanna Girls Degree College, Allahabad",
  "XYZ Institute of Technology, Allahabad",
  "Shambhunath Institute of Pharmacy, Allahabad",
  "Shambhunath Institute of Management, Allahabad",
  "Maharana Pratap Polytechnic, Gorakhpur",
  "Dr. Samuel George Institute of Engineering & Technology, Markapur",
  "United Institute of Management, Allahabad",
  "KIET Group of Institutions, Ghaziabad",
  "United Institute of Management (FUGS), Allahabad",
  "Institute of Management Studies (IMS), Ghaziabad",
  "ICSI, Hyderabad",
  "SMSIT, Lucknow",
  "Muzaffarpur Institute of Technology, Muzaffarpur",
  "SCRIET, CCS University, Meerut",
  "Techno India NJR, Udaipur",
  "Noida International University, Noida",
  "Allahabad Public School, Allahabad",
  "Symbiosis Centre for Management Studies, Noida",
  "Hari Institute of Technology, Nakur, Saharanpur",
  "Sanskar International School, Allahabad",
  "Vishnu Bhagwan Public School and College, Jhalwa, Allahabad",
  "Vaagdevi Engineering College, Bollikunta, Warangal",
  "Neerja Modi School, Jaipur",
  "Jaypee Institute of Information Technology, Noida",
  "Talla Padmavathi College of Engineering, Warangal",
  "Institute of Management Sciences (IMS), Lucknow",
  "IIT BHU, Varanasi",
  "VIT University, Vellore",
  "BIET, Jhansi",
  "Galaxy Global Group of Institutions, Ambala",
  "SRIMT, Lucknow",
  "Regent Education and Research Foundation, Barrackpore",
  "Isabella Thoburn College, Lucknow",
  "Galgotias Institute of Management and Technology, Noida",
  "Gautam Buddha University, Noida",
  "Central University of South Bihar, Gaya",
  "Ramjas College, Delhi",
  "ABES Engineering College, Ghaziabad",
  "Rajiv Gandhi Institute of Petroleum Technology, Rae Bareli",
  "Kamla Nehru Institute of Physical and Social Sciences, Sultanpur"
].sort(); // Sort alphabetically for better UX

export default function Signup() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    college: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    // Set colleges from the provided list
    setColleges(collegesList);
  }, []); // Empty dependency array since collegesList is static

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!formData.username || formData.username.length < 3) {
          toast.error("Username must be at least 3 characters long");
          return false;
        }
        return true;
      case 1:
        if (!formData.college) {
          toast.error("Please select a college");
          return false;
        }
        return true;
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        return true;
      case 3:
        if (!formData.dob) {
          toast.error("Please select your date of birth");
          return false;
        }
        return true;
      case 4:
        if (!formData.password || formData.password.length < 6) {
          toast.error("Password must be at least 6 characters long");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const next = () => {
    if (validateStep() && step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prev = () => step > 0 && setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      // Ensure the API endpoint is correct: https://sys-auth.onrender.com/api/signup
      const res = await fetch("https://sys-auth.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account created! You can now log in.");
        navigate("/login");
      } else {
        toast.error(data.error || "Signup failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong! Please try again later.");
    }
  };

  const handleLinkedInLogin = () => {
    // Verify clientId and redirectUri are correctly configured for your LinkedIn OAuth application
    const clientId = "77wwpkm9bcdsbe";
    const redirectUri = "https://sys-auth.onrender.com/auth/linkedin/callback";
    const scope = "openid profile email";
    const state = Math.random().toString(36).substring(2);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;
    window.location.href = authUrl;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <InputStep
            icon={<FaUser />}
            name="username"
            id="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        );
      case 1:
        return (
          <div className="mb-4">
            <label htmlFor="college" className="text-sm font-medium mb-1 block">
              Select your college
            </label>
            <select
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 bg-white"
            >
              <option value="">-- Choose college --</option>
              {colleges.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        );
      case 2:
        return (
          <InputStep
            icon={<FaEnvelope />}
            name="email"
            id="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
        );
      case 3:
        return (
          <InputStep
            icon="🎂"
            name="dob"
            id="dob"
            type="date"
            placeholder="Select your date of birth"
            value={formData.dob}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <>
            <InputStep
              icon={<FaLock />}
              name="password"
              id="password"
              type="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputStep
              icon={<FaLock />}
              name="confirmPassword"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </>
        );
      case 5:
        return (
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded flex justify-center items-center mb-4"
          >
            <span className="mr-2">🔐</span> Sign up
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md transition-all"
      >
        <h2 className="text-xl font-bold mb-2 text-center flex items-center justify-center gap-2">
          <span>👤</span> Sign up Now
        </h2>
        <p className="text-center text-sm mb-4">
          Be part of something <strong>great!</strong> Start <strong>learning</strong> and{" "}
          <strong>contributing</strong> with us!
        </p>

        <motion.div
          key={step}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}

          <button
            type="button"
            onClick={handleLinkedInLogin}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
          >
            <span className="mr-2">🔗</span> Sign up with LinkedIn
          </button>
        </motion.div>

        <div className="flex justify-between mt-4">
          {step > 0 && (
            <button type="button" onClick={prev} className="text-sm text-gray-500 underline">
              Back
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              onClick={next}
              className="ml-auto text-sm text-orange-600 underline"
            >
              Next →
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-sm">
          Already a member?{" "}
          <a href="/login" className="text-orange-500 font-semibold">
            Login Now →
          </a>
        </p>
      </form>
    </div>
  );
}

const InputStep = ({ icon, name, id, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4 flex items-center border rounded-md px-3 py-2 bg-gray-100">
    <label htmlFor={id} className="text-gray-500 mr-2">
      {icon}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full bg-transparent outline-none"
      aria-label={placeholder}
    />
  </div>
);