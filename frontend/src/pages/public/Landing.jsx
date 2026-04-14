import { useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import srmBg from "../../assets/srm2.jpg";
import { useEffect, useState } from "react";
import { Users, Calendar, Briefcase, Globe, MessageSquare, Megaphone, Vote, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

import { motion } from 'framer-motion';
import logo from "../../assets/srm_logo.png";
export default function Landing() {
  const { scrollY } = useScroll();
  const [showNavbar, setShowNavbar] = useState(false);
  const navbarBg = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.9)"]);
  const stats = [
  { label: "Active Alumni", value: "1,75,000+", icon: Users },
  { label: "Annual Events", value: "500+", icon: Calendar },
  { label: "Jobs Posted", value: "9,700+", icon: Briefcase },
  { label: "Countries", value: "100+", icon: Globe },
];

const testimonials = [
  {
    name: "Ankit Sharma",
    role: "Software Engineer @ Google",
    batch: "Class of 2019",
    feedback: "SRM KTR wasn't just about the degree; it was the ecosystem. The semester abroad program and the placement cell gave me the global exposure I needed to land my role at Google.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
  },
  {
    name: "Dr. Sneha Iyer",
    role: "Senior Scientist",
    batch: "Class of 2017",
    feedback: "The biotechnology labs and the faculty mentorship at SRM were pivotal. They didn't just teach us theory; they encouraged us to innovate and solve real-world problems.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop",
  },
  {
    name: "Varun Kapoor",
    role: "Founder, Tech-Start",
    batch: "Class of 2021",
    feedback: "From Milan to Aaruush, the diversity at SRM KTR shaped my personality. It gave me the confidence to start my venture. Reconnecting with alumni has opened so many doors.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop",
  },
];

const features = [
  {
    title: "Networking",
    desc: "Connect with alumni across industries",
    icon: <Users size={28} />,
  },
  {
    title: "Mentorship",
    desc: "Get guidance from experienced professionals",
    icon: <MessageSquare size={28} />,
  },
  {
    title: "Jobs",
    desc: "Explore exclusive job opportunities",
    icon: <Briefcase size={28} />,
  },
  {
    title: "Events",
    desc: "Attend alumni meetups and webinars",
    icon: <Calendar size={28} />,
  },
  {
    title: "Campaigns",
    desc: "Participate in alumni initiatives",
    icon: <Megaphone size={28} />,
  },
  {
    title: "Elections",
    desc: "Vote and shape your alumni community",
    icon: <Vote size={28} />,
  },
];
const targetDate = new Date("2027-01-26T09:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      // 2. Check agar countdown khatam ho gaya ho
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 500) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  return (
    <div className="font-sans text-gray-800">

      {/* Navbar with scroll effect */}
     <motion.nav
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="fixed top-6 left-0 w-full z-50"
>

  {/* 🔹 CENTER NAV LINKS */}
  <div className="flex justify-center">
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg border border-gray-200">

      {[
        { name: "Events", link: "#events" },
        { name: "Jobs", link: "#jobs" },
        { name: "News", link: "#news" },
        { name: "Contact", link: "#cta" },
      ].map((item, i) => (
        <a
          key={i}
          href={item.link}
          className="px-4 py-2 rounded-full text-gray-700 hover:bg-emerald-700 hover:text-white transition text-sm font-medium"
        >
          {item.name}
        </a>
      ))}

    </div>
  </div>

  {/* 🔹 RIGHT CORNER SIGN IN */}
  <div className="absolute right-6 top-0">
  <Link to="/login">
    
    <button
      className={`px-5 py-2 rounded-full shadow-md transition-all duration-300
        ${
          showNavbar
            ? "bg-emerald-700 text-white hover:bg-emerald-800"
            : "border-white/30 text-black rounded-full shadow-md hover:bg-white/30 transition bg-white/80 backdrop-blur-lg border border-gray-200"

        }
      `}
    >
      Sign In
    </button>

  </Link>
</div>

</motion.nav>

      {/* Hero Section */}
<section
  className="min-h-screen flex items-center px-10 pt-24 bg-cover bg-center relative rounded-b-3xl overflow-hidden"
  style={{ backgroundImage: `url(${srmBg})` }}
>
    <div className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-20">
  {/* Left */}
  <div className="flex justify-between items-center w-full text-white font-bold">

  {/* LEFT - Logo */}
  <div className="flex items-center gap-2">
  <img src={logo} alt="SRM Logo" className="h-12 w-auto object-contain" />
</div>

  {/* CENTER - Links */}


  {/* RIGHT - Sign In */}
 

</div>
</div>
    <div className="absolute inset-0 bg-black/30"></div>        
<div className="relative z-10 max-w-xl ml-6 text-white ">
          {/* Heading Animation */}
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className=" text-7xl font-bold leading-tight font-serif drop-shadow-[4px_6px_10px_rgba(0,0,0,0.6)]"
          >
            Reconnect, <br /> Grow, and <br /> Succeed
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-white text-lg drop-shadow-[2px_3px_6px_rgba(0,0,0,0.5)]"
          >
            Join a thriving community of SRM alumni building lifelong connections,
            advancing careers, and creating global impact.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex gap-4"
          >

  {/* JOIN NOW */}
  <Link to="/register">
    <button className="border-white/30 text-black px-6 py-3 rounded-full shadow-md hover:bg-white/30 transition bg-white/80 backdrop-blur-lg border border-gray-200">

      Join Now
    </button>
  </Link>

  {/* EXPLORE */}
  <a href="#events">
    <button className="border-white/30 text-black px-6 py-3 rounded-full shadow-md hover:bg-white/30 transition bg-white/80 backdrop-blur-lg border border-gray-200">
      Explore Network
    </button>
  </a>
          </motion.div>
        </div>


</section>

      {/* Stats with stagger animation */}
<section className="py-16 bg-white text-center grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
      {stats.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Icon Container */}
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
            <item.icon className="text-green-800 w-8 h-8" strokeWidth={1.5} />
          </div>

          {/* Text Content */}
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-gray-900">{item.value}</h2>
            <p className="text-gray-500 font-medium">{item.label}</p>
          </div>
        </motion.div>
      ))}
</section>

{/* Featured Event */}
<section id="events" className="py-20 bg-white text-center">

  {/* Outer container */}
  <div className="max-w-5xl mx-auto">

    {/* 🔥 GREEN BOX */}
    <div className="bg-emerald-700 rounded-3xl px-10 py-12 shadow-xl">

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold mb-6 font-serif text-white"
      >
        Annual Alumni Meetup
      </motion.h2>

      {/* Subtext */}
      <p className="text-emerald-100 mb-10 max-w-2xl mx-auto">
        Connect with fellow alumni, industry leaders, and special guests at our biggest event of the year
      </p>

      {/* 🔥 TIMER */}
     <div className="flex justify-center gap-6 mb-10 flex-wrap">
  {[
    { label: "Days", value: timeLeft?.days ?? 0 },
    { label: "Hours", value: timeLeft?.hours ?? 0 },
    { label: "Minutes", value: timeLeft?.minutes ?? 0 },
    { label: "Seconds", value: timeLeft?.seconds ?? 0 },
  ].map((item, index) => (
    <div
      key={index}
      className="bg-emerald-600/80 backdrop-blur-md px-8 py-6 rounded-2xl shadow-lg min-w-[110px] flex flex-col items-center justify-center border border-white/10"
    >
      <h3 className="text-4xl font-bold text-white tabular-nums">
        {/* String conversion se pehle safety check aur 0 padding */}
        {String(item.value).padStart(2, "0")}
      </h3>
      <p className="text-emerald-100/80 mt-2 text-xs uppercase tracking-widest font-medium">
        {item.label}
      </p>
    </div>
  ))}
</div>

      {/* Button */}
      <Link to="/events">
        <button className="bg-white text-emerald-700 px-8 py-3 rounded-xl font-semibold hover:scale-105 hover:bg-gray-100 transition">
          Register Now
        </button>
      </Link>

    </div>

  </div>

</section>

{/*why join section */}
<section className="py-20 px-6 md:px-10 bg-white">

  {/* 🔹 HEADER */}
  <div className="max-w-5xl mx-auto text-center mb-14">
    
    <h2 className="text-5xl font-bold font-playfair text-gray-800 mb-4 font-serif">
      Why Join the SRM Alumni Network?
    </h2>

    <p className="text-gray-500 max-w-3xl mx-auto">
      Become part of a powerful global alumni ecosystem that empowers your career,
      strengthens connections, and enables you to give back to the next generation.
    </p>

  </div>

  {/* 🔹 GRID */}
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">

    {features.map((item, i) => (

      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition"
      >

        {/* 🔹 ICON */}
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-5">
          {item.icon}
        </div>

        {/* 🔹 TITLE */}
        <h3 className="font-semibold text-xl text-gray-800 mb-2">
          {item.title}
        </h3>

        {/* 🔹 DESC */}
        <p className="text-gray-500 text-sm">
          {item.desc}
        </p>

      </motion.div>

    ))}

  </div>

  {/* 🔹 CTA */}
  <div className="text-center mt-14">
    <p className="text-gray-600 mb-4">
      Ready to stay connected and grow with SRM?
    </p>

    <Link to="/register">
      <button className="bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-800 hover:scale-105 transition">
        Join the Alumni Network →
      </button>
    </Link>
  </div>

</section>

<section id="jobs" className="py-20 bg-gray-50 px-6 md:px-10">

  {/* 🔹 HEADER */}
  <div className="max-w-5xl mx-auto mb-12">
    
    <h2 className="text-center text-5xl font-bold font-serif text-gray-800 mb-4">
      Career & Alumni Opportunities
    </h2>

    <p className="text-center text-gray-500 ">
      SRM alumni benefit from a powerful global network, exclusive placement drives,
      startup collaborations, and academic opportunities across top organizations.
    </p>

  </div>

  {/* 🔹 GRID */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

    {[
      {
        title: "Targeted Placement Drives",
        desc: "Access exclusive job listings and placement support through the SRM Career Centre.",
      },
      {
        title: "Industry Roles",
        desc: "Opportunities in top companies like Amazon, Deloitte, IBM, and Hyundai across tech and management.",
      },
      {
        title: "Startup Ecosystem",
        desc: "Collaborate with 40+ startups on campus and contribute to innovative ventures.",
      },
      {
        title: "Academic Positions",
        desc: "Serve as visiting faculty or Professor of Practice leveraging your industry experience.",
      },
      {
        title: "Global Networking",
        desc: "Connect through 30+ international and 25+ Indian alumni chapters for referrals and growth.",
      },
      {
        title: "Career Advancement",
        desc: "Explore roles like Academic Counselor, Technical Assistant, and Corporate Executive via SRM job boards.",
      },
    ].map((item, i) => (

     <div
        key={i}
        className="p-6 rounded-xl transition hover:shadow-md"
      >

        <h3 className="font-semibold text-xl text-gray-800 mb-2">
          {item.title}
        </h3>

        <p className="text-gray-500 text-sm">
          {item.desc}
        </p>

      </div>

    ))}

  </div>

  {/* 🔹 CTA BUTTON */}
  <div className="text-center mt-12">
    <Link to="/jobs">
      <button className="bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-800 hover:scale-105 transition">
        Explore Job Listings →
      </button>
    </Link>
  </div>

</section>
 
{/* Alumni Directorate Team */}
<section className="py-20 px-6 bg-white">

  {/* HEADER */}
  <div className="text-center max-w-2xl mx-auto mb-14">
    
    <h2 className="text-5xl font-serif font-bold text-gray-800">
      Alumni Directorate Team
    </h2>

    <div className="w-16 h-1 bg-emerald-700 mx-auto mt-3 rounded-full"></div>

    <p className="text-gray-500 mt-4">
      Meet the dedicated team behind the SRM Alumni Network, working to build meaningful connections and opportunities.
    </p>

  </div>

  {/* GRID */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

    {[
      {
        role: "Assistant Director",
        name: "Mrs. Radha Ravindran",
        email: "asstdirector.alumni@srmist.edu.in"
      },
      {
        role: "Accountant",
        name: "Mr. Jayaganesh",
        email: "accounts.alumni@srmist.edu.in",
      },
      {
        role: "Senior Assistant",
        name: "Mr. Sundar Raj",
        email: "sra.alumni@srmist.edu.in"
      },
      {
        role: "Coordinator",
        name: "Mr. Azarudeen",
        email: "coordinator.alumni@srmist.edu.in"
      },
      {
        role: "Networking & Relations Officer",
        name: "Mr. Sathish R",
        email: "pr.alumni@srmist.edu.in"
      }
    ].map((member, i) => (

      <div
        key={i}
        className="p-6 rounded-xl transition hover:shadow-md"
      >

        {/* ROLE */}
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
          {member.role}
        </p>

        {/* NAME */}
        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
          {member.name}
        </h3>

        {/* EMAIL */}
        <a
          href={`mailto:${member.email}`}
          className={`text-sm ${
            member.highlight
              ? "text-yellow-500 font-medium"
              : "text-gray-600 hover:text-emerald-600"
          } transition`}
        >
          {member.email}
        </a>

      </div>

    ))}

  </div>

</section>

{/* Testimonials */}
<section className="py-20 px-10 bg-white text-center">
  
  {/* Heading */}
  <h2 className="text-5xl font-bold mb-6 font-serif">
    Success Stories
  </h2>
  <p className="text-gray-500text-xl mb-14 max-w-2xl mx-auto text-gray-500">
    Hear from alumni who transformed their careers through our network
  </p>

  {/* Cards */}
  <div className="grid md:grid-cols-3 gap-10">
    {testimonials.map((t, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        whileHover={{ y: -10 }}
        className="relative bg-white p-8 pt-12 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition"
      >
        
        {/* 🔥 Floating Image */}
        <img
          src={t.img}
          alt={t.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md absolute -top-8 left-1/2 -translate-x-1/2"
        />

        {/* Name */}
        <h4 className="mt-6 font-semibold text-lg text-gray-800">
          {t.name}
        </h4>

        {/* Feedback */}
        <p className="mt-3 text-gray-500 italic">
          "{t.feedback}"
        </p>

      </motion.div>
    ))}
  </div>

</section>

{/* News & Updates */}
<section id="news" className="py-20 px-10 bg-gray-50">
  {/* Top Heading Row */}
  <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
    <div>
      <h2 className="text-5xl font-bold text-gray-900 font-serif">News & Updates</h2>
      <p className="text-gray-500 mt-2">
        Stay connected with the latest from our alumni community
      </p>
    </div>

    <Link to="/news">
      <button className="text-emerald-700 font-semibold hover:underline flex items-center gap-2">
        View All News →
      </button>
    </Link>
  </div>

  {/* News Cards */}
  <div className="grid md:grid-cols-3 gap-8">
    {[
      {
        img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070", // Corporate/Startup vibe for EcoDrive
        tag: "Achievement",
        date: "April 10, 2026",
        title: "SRM Alumnus Startup 'EcoDrive' Secures $50M Series B Funding",
      },
      {
// Isko replace kar de second card (Healthcare Summit) wali image link se:
        img: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070",        tag: "Event",
        date: "March 28, 2026",
        title: "Successful Wrap: Global Alumni Healthcare Summit 2026",
      },
      {
        img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070", // Campus/Students vibe for Mentorship
        tag: "Program",
        date: "March 12, 2026",
        title: "Launch of 'SRM NexGen' Mentorship Phase 4",
      },
    ].map((news, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        whileHover={{ y: -6 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={news.img}
            alt={news.tag}
            className="w-full h-52 object-cover transition duration-500 group-hover:scale-110"
          />
          {/* Tag */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm">
            {news.tag}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 text-left flex-grow">
          <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">
            {news.date}
          </p>
          <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-emerald-700 transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-500 mt-3 text-sm line-clamp-2">
            Click to read more about this recent update from our global SRM network.
          </p>
        </div>
        
        {/* Bottom Bar (Visual polish) */}
        <div className="px-6 pb-6 mt-auto">
          <div className="w-full h-[1px] bg-gray-100 group-hover:bg-emerald-100 transition-colors"></div>
        </div>
      </motion.div>
    ))}
  </div>
</section>

      {/* CTA */}
     <section id="cta" className="py-20 bg-emerald-700 text-white px-6">

  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

    {/* 🔹 LEFT SIDE (OLD CTA) */}
    <div>
      <h2 className="text-3xl md:text-4xl font-bold font-serif">
        Still connected to SRM?
      </h2>
      <p className="mt-3 text-emerald-100">
        Join the alumni network today and stay connected with your peers, mentors, and opportunities.
      </p>

      <Link to="/register">
        <button className="mt-6 bg-white text-emerald-700 px-6 py-3 rounded-full font-semibold hover:scale-105 hover:bg-gray-100 transition">
          Get Started
        </button>
      </Link>
    </div>

   <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all">

  {/* Heading */}
  <h3 className="text-2xl font-semibold mb-6 text-white">
    Contact Us
  </h3>

  {/* Content */}
  <div className="space-y-5 text-emerald-100">

    {/* LOCATION */}
    <div className="flex items-start gap-4">
      <FaMapMarkerAlt className="mt-1 text-white/80" size={18} />
      <div className="text-sm leading-relaxed">
        <p className="font-medium text-white">
          SRM Institute of Science and Technology
        </p>
        <p>Kattankulathur, Chennai - 603203</p>
        <p>Tamil Nadu, India</p>
      </div>
    </div>

    {/* EMAIL */}
    <div className="flex items-center gap-4">
      <FaEnvelope className="text-white/80" size={18} />
      <span className="text-sm font-medium">
        infodesk@srmist.edu.in
      </span>
    </div>

    {/* PHONE */}
    <div className="flex flex-col gap-3">
  {/* Number 1 */}
  <div className="flex items-center gap-3">
    <FaPhoneAlt className="text-white/80" size={16} />
    <span className="text-sm">+91 44 27417000</span>
  </div>

  {/* Number 2 */}
  <div className="flex items-center gap-3">
    <FaPhoneAlt className="text-white/80" size={16} />
    <span className="text-sm">+91 44 27417777</span>
  </div>

  {/* Number 3 */}
  <div className="flex items-center gap-3">
    <FaPhoneAlt className="text-white/80" size={16} />
    <span className="text-sm">+91 80 69087000</span>
  </div>
</div>

  </div>

</div>

  </div>

</section>

{/* Footer */}
<footer className="bg-emerald-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* TOP SECTION: Quick Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
          
          {/* Brand/About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-emerald-700 pb-2 inline-block">
              SRM Alumni Portal
            </h3>
            <p className="text-emerald-100/70 text-sm leading-relaxed">
              Connecting generations of SRMites. Stay updated with campus news, 
              job opportunities, and global alumni meetups.
            </p>
          </div>

          {/* QUICK LINKS (Updated from your routes) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-400">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-emerald-100/80">
              <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
              <Link to="/directory" className="hover:text-white transition">Directory</Link>
              <Link to="/jobs" className="hover:text-white transition">Job Board</Link>
              <Link to="/events" className="hover:text-white transition">Events</Link>
              <Link to="/news" className="hover:text-white transition">News</Link>
              <Link to="/campaigns" className="hover:text-white transition">Campaigns</Link>
            </div>
          </div>

          {/* NOTICES & SUPPORT */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-400">Support</h3>
            <ul className="text-sm text-emerald-100/80 space-y-2">
              <li><Link to="/notices" className="hover:text-white transition">Notices</Link></li>
              <li><Link to="/elections" className="hover:text-white transition">Elections</Link></li>
              <li><Link to="/edit-profile" className="hover:text-white transition">Account Settings</Link></li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-emerald-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* LEFT: Copyright */}
          <p className="text-sm text-emerald-200/60 font-medium">
            © 2026 SRM Alumni Network. All rights reserved.
          </p>

          {/* RIGHT: Social Icons */}
          <div className="flex gap-6 text-xl">
            <a 
              href="https://www.facebook.com/SRMUniversityOfficial/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition transform hover:scale-110"
            >
              <FaFacebookF />
            </a>
            <a 
              href="https://www.instagram.com/srmuniversityofficial/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition transform hover:scale-110"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://x.com/SRM_Univ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition transform hover:scale-110"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}
