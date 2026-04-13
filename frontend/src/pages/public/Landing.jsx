import { useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import srmBg from "../../assets/srm2.jpg";
import { useEffect, useState } from "react";
import { Users, Calendar, Briefcase, Globe, MessageSquare, Megaphone, Vote, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

import { motion } from 'framer-motion';
import logo from "../../assets/srm_logo.png";
export default function Landing() {
  const { scrollY } = useScroll();
  const [showNavbar, setShowNavbar] = useState(false);
  const navbarBg = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.9)"]);
  const stats = [
  { label: "Active Alumni", value: "50,000+", icon: Users },
  { label: "Annual Events", value: "120+", icon: Calendar },
  { label: "Jobs Posted", value: "2,500+", icon: Briefcase },
  { label: "Countries", value: "85+", icon: Globe },
];

const testimonials = [
  {
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Rohit Patil",
    feedback: "This network helped me land my dream job and grow professionally.",
  },
  {
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Mehta",
    feedback: "Amazing community! I found mentors who guided me at every step.",
  },
  {
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    name: "Arjun Verma",
    feedback: "Great platform to reconnect and explore new opportunities.",
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
const targetDate = new Date("2026-06-01T00:00:00").getTime();

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

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
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
          className="px-4 py-2 rounded-full text-gray-700 hover:bg-emerald-600 hover:text-white transition text-sm font-medium"
        >
          {item.name}
        </a>
      ))}

    </div>
  </div>

  {/* 🔹 RIGHT CORNER SIGN IN */}
  <div className="absolute right-6 top-0">
    <Link to="/login">
      <button className="bg-emerald-700 text-white px-5 py-2 rounded-full shadow-md hover:bg-emerald-800 transition">
        Sign In
      </button>
    </Link>
  </div>

</motion.nav>

      {/* Hero Section */}
<section
  className="min-h-screen flex items-center px-10 pt-24 bg-cover bg-center relative"
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
            className=" text-7xl font-bold leading-tight drop-shadow-[4px_6px_10px_rgba(0,0,0,0.6)]"
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
    <button className="bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full shadow-md hover:bg-white/30 transition">
      Join Now
    </button>
  </Link>

  {/* EXPLORE */}
  <a href="#events">
    <button className="bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full shadow-md hover:bg-white/30 transition">
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
        className="text-4xl md:text-5xl font-bold mb-6 text-white"
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
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-emerald-600/80 backdrop-blur-md px-8 py-6 rounded-2xl shadow-md min-w-[110px]"
          >
            <h3 className="text-4xl font-bold text-white">
              {item.value.toString().padStart(2, "0")}
            </h3>
            <p className="text-emerald-200 mt-2 text-sm">
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

      {/* Why Join */}
      <section className="py-20 px-10 bg-white">
  <h2 className="text-5xl font-bold text-center mb-14">
    Why Join Our Network?
  </h2>

  <div className="grid md:grid-cols-3 gap-10">
    {features.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        whileHover={{ y: -10 }}
        className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition"
      >
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-5">
          {item.icon}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-xl mb-2">
          {item.title}
        </h3>

        {/* Desc */}
        <p className="text-gray-500">
          {item.desc}
        </p>
      </motion.div>
    ))}
  </div>
</section>

      {/* Jobs */}
      <section id="jobs" className="py-20 bg-gray-50 px-10">
        <h2 className="text-5xl font-bold text-left mb-6 ml-4">Job Opportunities</h2>
        <p className="text-gray-500 text-xl text-left mb-10 ml-4">
Exclusive positions shared by our alumni network  </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((job) => (
            <motion.div
              key={job}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-6 bg-white rounded-xl shadow"
            >
              <h3 className="font-semibold text-2xl">Software Engineer</h3>
              <p className="text-gray-500">Chennai, India</p>
              <Link to="/jobs">
  <button className="mt-3 px-5 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-700 hover:scale-105 transition">
    Apply Now →
  </button>
</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-10 bg-white text-center">
  
  {/* Heading */}
  <h2 className="text-5xl font-bold mb-6">
    Success Stories
  </h2>
  <p className="text-gray-500 text-xl mb-14 max-w-2xl mx-auto">
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


<section id="news" className="py-20 px-10 bg-gray-50">

  {/* Top Heading Row */}
  <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
    
    <div>
      <h2 className="text-5xl font-bold text-gray-900">News & Updates</h2>
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
        img: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
        tag: "Achievement",
        date: "April 8, 2026",
        title: "SRM Alumni Make It to Forbes 30 Under 30",
      },
      {
        img: "https://images.unsplash.com/photo-1515169067868-5387ec356754",
        tag: "Event",
        date: "March 25, 2026",
        title: "Annual Tech Summit: Shaping the Future",
      },
      {
        img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
        tag: "Program",
        date: "March 15, 2026",
        title: "Global Mentorship Program Launch",
      },
    ].map((news, i) => (

      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        whileHover={{ y: -6 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
      >

        {/* Image */}
        <div className="relative">
          <img
            src={news.img}
            alt="news"
            className="w-full h-52 object-cover transition duration-500 group-hover:scale-105"          />

          {/* Tag */}
          <span className="absolute top-3 left-3 bg-white text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
            {news.tag}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 text-left">
          <p className="text-gray-400 text-sm mb-2">{news.date}</p>
          <h3 className="text-lg font-semibold text-gray-800">
            {news.title}
          </h3>
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
      <h2 className="text-3xl md:text-4xl font-bold">
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

    {/* 🔹 RIGHT SIDE (CONTACT INFO) */}
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
  
  <h3 className="text-2xl font-semibold mb-4">
    Contact Us
  </h3>

  <div className="space-y-3 text-emerald-100">

    <div className="flex items-start gap-3">
      <MapPin size={18} className="mt-1" />
      <div>
        <p>SRM Institute of Science and Technology</p>
        <p>Kattankulathur, Chennai - 603203</p>
        <p>Tamil Nadu, India</p>
      </div>
    </div>

    <div className="flex items-center gap-3 mt-3">
      <Mail size={18} />
      <span className="font-medium">alumni@srmist.edu.in</span>
    </div>

    <div className="flex items-center gap-3">
      <Phone size={18} />
      <span>+91 98765 43210</span>
    </div>

  </div>

</div>

  </div>

</section>


{/* FOOTER */}
<footer className="bg-emerald-900 text-white py-8">

  <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

    {/* LEFT */}
    <p className="text-sm">
      © 2026 SRM Alumni Network. All rights reserved.
    </p>

    {/* RIGHT - SOCIAL ICONS */}
    <div className="flex gap-4 text-lg">

      <a 
        href="https://www.facebook.com/SRMUniversityOfficial/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-emerald-400 transition"
      >
        <FaFacebookF />
      </a>

      <a 
        href="https://www.instagram.com/srmuniversityofficial/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-emerald-400 transition"
      >
        <FaInstagram />
      </a>

      <a 
        href="https://x.com/SRM_Univ" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-emerald-400 transition"
      >
        <FaTwitter />
      </a>

    </div>

  </div>

</footer>
    </div>
  );
}
