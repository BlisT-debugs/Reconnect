import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import srmBg from "../../assets/srm2.jpg";
import { useEffect, useState } from "react";
export default function Landing() {
  const { scrollY } = useScroll();
  const [showNavbar, setShowNavbar] = useState(false);
  const navbarBg = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.9)"]);

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
  animate={{
    opacity: showNavbar ? 1 : 0,
    y: showNavbar ? 0 : -50
  }}
  transition={{ duration: 0.4 }}
  className="fixed top-0 w-full bg-white shadow-md z-50 px-8 py-4 flex justify-between items-center"
>
        <h1 className="font-bold text-lg">SRM Alumni Network</h1>
        <div className="space-x-6 hidden md:block">
          <a href="#" className="hover:text-green-600">About</a>
          <a href="#events" className="hover:text-green-600">Events</a>
          <a href="#jobs" className="hover:text-green-600">Jobs</a>
        </div>
        <Link to="/login">
          <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
            Sign In
          </button>
        </Link>
      </motion.nav>

      {/* Hero Section */}
<section
  className="min-h-screen flex items-center px-10 pt-24 bg-cover bg-center relative"
  style={{ backgroundImage: `url(${srmBg})` }}
>
    <div className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-20">
  {/* Left */}
  <h1 className="text-white font-bold text-lg">SRM</h1>

  {/* Right */}
  <div className="flex gap-6 text-white">
    <a href="#events">Events</a>
    <a href="#jobs">Jobs</a>
    <a href="#cta">Contact</a>
    <Link to="/login">
          <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
            Sign In
          </button>
        </Link>
  </div>
</div>
    <div className="absolute inset-0 bg-black/50"></div>        
<div className="relative z-10 max-w-xl text-white">
          {/* Heading Animation */}
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-7xl font-bold leading-tight"
          >
            Reconnect, <br /> Grow, and <br /> Succeed
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-white text-lg"
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
            <Link to="/register">
              <button className="bg-green-700 text-white px-6 py-3 rounded-lg hover:scale-105 hover:shadow-lg transition">
                Join Now
              </button>
            </Link>
            <Link to="/login">
              <button className="border border-green-700 text-green-700 px-6 py-3 rounded-lg hover:bg-green-50 transition">
                Explore Network
              </button>
            </Link>
          </motion.div>
        </div>


      </section>

      {/* Stats with stagger animation */}
      <section className="py-16 bg-white text-center grid grid-cols-2 md:grid-cols-4 gap-6">
        {["Alumni", "Events", "Jobs", "Countries"].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <h2 className="text-3xl font-bold text-green-700">{1000 + i * 500}+</h2>
            <p>{item}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Event */}
      <section id="events" className="py-20 bg-emerald-700 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-6 text-white"
        >
          Annual Alumni Meetup
        </motion.h2>
        <p className="text-emerald-100 mb-4">Connect with fellow alumni, industry leaders, and special guests at our biggest event of the year</p>
        <Link to="/events">
          <button className="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg hover:scale-105 transition">
            View Events
          </button>
        </Link>
      </section>

      {/* Why Join */}
      <section className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-10">Why Join</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["Networking", "Mentorship", "Jobs", "Events", "Campaigns", "Elections"].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-6 border rounded-xl hover:shadow-xl"
            >
              <h3 className="font-semibold text-lg">{item}</h3>
              <p className="text-gray-500 mt-2">Explore {item.toLowerCase()} opportunities</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Jobs */}
      <section id="jobs" className="py-20 bg-green-50 px-10">
        <h2 className="text-3xl font-bold text-center mb-10">Career Opportunities</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((job) => (
            <motion.div
              key={job}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white rounded-xl shadow"
            >
              <h3 className="font-semibold">Software Engineer</h3>
              <p className="text-gray-500">Chennai, India</p>
              <Link to="/jobs">
                <button className="mt-3 text-green-700">Apply Now →</button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-10 text-center">
        <h2 className="text-3xl font-bold mb-10">What Alumni Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((t) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="p-6 border rounded-xl"
            >
              <p>"This network helped me grow my career!"</p>
              <h4 className="mt-4 font-semibold">SRM Alumni</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 text-center bg-green-700 text-white">
        <h2 className="text-3xl font-bold">Still connected to SRM?</h2>
        <p className="mt-2">Join the alumni network today</p>
        <Link to="/register">
          <button className="mt-6 bg-white text-green-700 px-6 py-3 rounded-lg hover:scale-105 transition">
            Get Started
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white text-center py-6">
        <p>© 2026 SRM Alumni Network</p>
      </footer>
    </div>
  );
}
