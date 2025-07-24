import React, { useContext, useEffect, useState } from "react";
import {
  Users,
  Star,
  Briefcase,
  HeartHandshake,
  Rocket,
  Package,
  CalendarCheck,
  MessageCircle,
  FileImage,
  LayoutDashboard,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  CalendarClock,
  Globe,
  CheckCircle,
  UserPlus,
  Search,
  CalendarCheck2,
} from "lucide-react";
import eventHero from "../assets/event1.jpg";
import eventCta from "../assets/event2.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";
import {
  MapPin,
  Tag,
  DollarSign,
  Image as ImageIcon,
  CalendarCheck as CalendarIcon,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, type: "spring" },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { delay: i * 0.15, duration: 0.7 },
  }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

const planColors = {
  Free: {
    bg: "from-gray-100 to-gray-200",
    border: "border-gray-300",
    text: "text-gray-800",
    icon: "text-gray-500",
    button: "bg-gray-400 hover:bg-gray-500",
    badge: "bg-gray-500",
  },
  Basic: {
    bg: "from-blue-100 to-blue-300",
    border: "border-blue-400",
    text: "text-blue-800",
    icon: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    badge: "bg-blue-600",
  },
  Pro: {
    bg: "from-purple-100 to-purple-300",
    border: "border-purple-400",
    text: "text-purple-800",
    icon: "text-purple-600",
    button: "bg-purple-700 hover:bg-purple-800",
    badge: "bg-purple-700",
  },
  Enterprise: {
    bg: "from-indigo-100 to-indigo-300",
    border: "border-indigo-400",
    text: "text-indigo-800",
    icon: "text-indigo-600",
    button: "bg-indigo-700 hover:bg-indigo-800",
    badge: "bg-indigo-700",
  },
};

// Helper for animated counter with float/fallback
function useAnimatedCount(target, duration = 1500) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return setCount(end);
    let incrementTime = Math.max(10, Math.floor(duration / end));
    let current = start;
    const timer = setInterval(() => {
      current += Math.ceil(end / (duration / incrementTime));
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function AnimatedCounter({ value, duration = 1500, className = "" }) {
  const count = useAnimatedCount(value, duration);
  return <span className={className}>{count.toLocaleString()}</span>;
}

const Home = () => {
  const [previewPackages, setPreviewPackages] = React.useState([]);
  const [loadingPreview, setLoadingPreview] = React.useState(true);
  const { backendURL, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  React.useEffect(() => {
    const fetchPreview = async () => {
      setLoadingPreview(true);
      try {
        const res = await axios.get(backendURL + "/api/packages");
        console.log("Packages API response:", res.data);
        setPreviewPackages(res.data.data?.slice(0, 3) || []);
      } catch {
        setPreviewPackages([]);
      } finally {
        setLoadingPreview(false);
      }
    };
    fetchPreview();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="max-w-5xl mx-auto py-12 px-4 space-y-20"
    >
      {/* Hero Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 py-8 px-2 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-white mb-12"
      >
        {/* Image */}
        <motion.div
          variants={fadeInUp}
          custom={1}
          className="flex-1 flex justify-center md:justify-end mb-6 md:mb-0 order-1 md:order-none"
        >
          <motion.img
            src={eventHero}
            alt="Event"
            className="rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md object-cover h-56 sm:h-64 md:h-80 border-4 border-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>
        {/* Text content */}
        <motion.div
          variants={fadeInUp}
          custom={2}
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-5"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-700 text-transparent bg-clip-text drop-shadow mb-2">
            Welcome to <span className="text-blue-700">EventHive</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            Your Smart Companion for Effortless Event Planning
          </p>
          <p className="text-gray-600 max-w-xl mx-auto md:mx-0">
            Plan weddings, birthdays, conferences, and more — all in one
            platform.
            <br />
            Trusted planners, clear pricing, smooth communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start mt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition w-full sm:w-auto"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition w-full sm:w-auto"
              onClick={() => navigate("/packages")}
            >
              Explore Packages
            </button>
          </div>
        </motion.div>
      </motion.section>

      {/* Who We Are */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col md:flex-row items-center gap-8"
      >
        <div className="flex-shrink-0 bg-blue-100 rounded-full p-6">
          <Users className="text-blue-600 w-12 h-12" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Who We Are</h2>
          <p className="text-gray-700 mb-2">
            At EventHive, we believe that planning an event should be exciting —
            not stressful.
          </p>
          <p className="text-gray-600">
            We are a passionate team of developers and creatives building tools
            to help clients and planners connect, collaborate, and create
            unforgettable experiences.
            <br />
            Whether you’re organizing a small birthday or a grand wedding,
            EventHive gives you everything you need in one easy-to-use system.
          </p>
        </div>
      </motion.section>

      {/* How It Works / Feature Highlights */}
      <section className="my-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              className="flex flex-col items-center"
            >
              {i === 0 && (
                <>
                  <UserPlus className="w-10 h-10 text-blue-600 mb-2" />
                  <span className="font-semibold text-blue-700">Sign Up</span>
                  <span className="text-xs text-gray-500 mt-1">
                    Create your free account
                  </span>
                </>
              )}
              {i === 1 && (
                <>
                  <Search className="w-10 h-10 text-purple-600 mb-2" />
                  <span className="font-semibold text-purple-700">
                    Browse Packages
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Find the perfect event package
                  </span>
                </>
              )}
              {i === 2 && (
                <>
                  <CalendarCheck2 className="w-10 h-10 text-green-600 mb-2" />
                  <span className="font-semibold text-green-700">Book</span>
                  <span className="text-xs text-gray-500 mt-1">
                    Reserve your date and planner
                  </span>
                </>
              )}
              {i === 3 && (
                <>
                  <MessageCircle className="w-10 h-10 text-pink-600 mb-2" />
                  <span className="font-semibold text-pink-700">Chat</span>
                  <span className="text-xs text-gray-500 mt-1">
                    Communicate and share details
                  </span>
                </>
              )}
              {i === 4 && (
                <>
                  <Star className="w-10 h-10 text-yellow-500 mb-2" />
                  <span className="font-semibold text-yellow-600">Review</span>
                  <span className="text-xs text-gray-500 mt-1">
                    Rate your experience
                  </span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Animated Stats/Counters */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="my-16"
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Our Impact
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          EventHive is trusted by thousands of clients and planners across the
          region. Here’s a snapshot of our growing community and the impact
          we’ve made together:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          {[1000, 500, 2000, 350].map((val, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col items-center"
            >
              <span
                className={`text-4xl font-extrabold ${
                  [
                    "text-blue-700",
                    "text-purple-700",
                    "text-green-700",
                    "text-yellow-600",
                  ][i]
                } mb-2`}
              >
                <AnimatedCounter value={val} />+
              </span>
              <span className="text-gray-700 font-semibold">
                {["Events Booked", "Planners", "Clients", "Reviews"][i]}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Subscription Plans */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="my-16"
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Subscription Plans
        </h2>
        <DynamicPlansSection />
      </motion.section>

      {/* Our Services */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 32px rgba(80,80,200,0.08)",
              }}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100"
            >
              {i === 0 && (
                <>
                  <Package className="w-10 h-10 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-lg">
                    Event Package Listings
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Browse and compare planner packages by category and budget.
                  </p>
                </>
              )}
              {i === 1 && (
                <>
                  <CalendarCheck className="w-10 h-10 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-lg">
                    Real-Time Booking System
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Book planners based on availability and event type.
                  </p>
                </>
              )}
              {i === 2 && (
                <>
                  <MessageCircle className="w-10 h-10 text-pink-600 mb-2" />
                  <h3 className="font-semibold text-lg">
                    Secure In-App Messaging
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Communicate directly with planners and stay updated.
                  </p>
                </>
              )}
              {i === 3 && (
                <>
                  <FileImage className="w-10 h-10 text-green-600 mb-2" />
                  <h3 className="font-semibold text-lg">File/Image Sharing</h3>
                  <p className="text-gray-600 text-sm">
                    Upload mood boards, inspiration photos, and documents.
                  </p>
                </>
              )}
              {i === 4 && (
                <>
                  <LayoutDashboard className="w-10 h-10 text-yellow-500 mb-2" />
                  <h3 className="font-semibold text-lg">
                    Dashboard for Planners
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Manage bookings, payments, and packages from a single
                    interface.
                  </p>
                </>
              )}
              {i === 5 && (
                <>
                  <CreditCard className="w-10 h-10 text-blue-500 mb-2" />
                  <h3 className="font-semibold text-lg">Payment Integration</h3>
                  <p className="text-gray-600 text-sm">
                    Pay securely via M-Pesa or Stripe.
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Who We Serve */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Who We Serve
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-blue-600 mt-1" />
            <div>
              <p className="text-gray-700 font-medium">
                Individuals planning weddings, birthdays, baby showers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Briefcase className="w-8 h-8 text-purple-600 mt-1" />
            <div>
              <p className="text-gray-700 font-medium">
                Corporate and academic institutions organizing events
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Users className="w-8 h-8 text-green-600 mt-1" />
            <div>
              <p className="text-gray-700 font-medium">
                Churches, NGOs, and community-based organizations
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Rocket className="w-8 h-8 text-pink-600 mt-1" />
            <div>
              <p className="text-gray-700 font-medium">
                Event planners looking to grow their business and reach more
                clients
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Advantages */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Why Choose EventHive?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 32px rgba(80,80,200,0.08)",
              }}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100"
            >
              {i === 0 && (
                <>
                  <LayoutDashboard className="w-10 h-10 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-lg">All-in-One Platform</h3>
                  <p className="text-gray-600 text-sm">
                    Manage planning, booking, and communication from one place —
                    no back-and-forth emails.
                  </p>
                </>
              )}
              {i === 1 && (
                <>
                  <ShieldCheck className="w-10 h-10 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-lg">
                    Transparent & Trusted
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Work with verified planners with real reviews and clear
                    pricing. No hidden fees.
                  </p>
                </>
              )}
              {i === 2 && (
                <>
                  <Smartphone className="w-10 h-10 text-green-600 mb-2" />
                  <h3 className="font-semibold text-lg">Built for Africa</h3>
                  <p className="text-gray-600 text-sm">
                    Mobile-first, M-Pesa ready, and locally relevant — designed
                    for your market.
                  </p>
                </>
              )}
              {i === 3 && (
                <>
                  <CalendarClock className="w-10 h-10 text-pink-600 mb-2" />
                  <h3 className="font-semibold text-lg">
                    Smart Calendar & Dashboards
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Stay organized with reminders, booking status, and visual
                    timelines.
                  </p>
                </>
              )}
              {i === 4 && (
                <>
                  <Globe className="w-10 h-10 text-blue-500 mb-2" />
                  <h3 className="font-semibold text-lg">Secure & Scalable</h3>
                  <p className="text-gray-600 text-sm">
                    Built with the latest tech to ensure security, scalability,
                    and smooth performance.
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Packages Preview Section */}
      <section>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-8 text-center">
          Featured Event Packages
        </h2>
        {loadingPreview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : previewPackages.length === 0 ? (
          <div className="text-center text-gray-500 font-semibold py-8">
            No packages available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6">
            {previewPackages.map((pkg, i) => (
              <motion.div
                key={pkg._id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={i}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 8px 32px rgba(80,80,200,0.08)",
                }}
                className="bg-white rounded-2xl shadow-lg p-5 flex flex-col h-full border border-blue-100 hover:shadow-xl transition group"
              >
                <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {pkg.image ? (
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="object-cover w-full h-full rounded-xl group-hover:scale-105 transition"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-blue-300" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-1 truncate">
                  {pkg.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Tag className="w-4 h-4 text-purple-500" />
                  <span>{pkg.category?.name || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{pkg.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-green-700">
                    Ksh {pkg.price}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/packages")}
                  className="mt-auto flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
                >
                  <CalendarIcon className="w-4 h-4" /> View & Book
                </button>
              </motion.div>
            ))}
          </div>
        )}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/packages")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:from-blue-700 hover:to-purple-700 transition"
          >
            See All Packages
          </motion.button>
        </div>
      </section>

      {/* FAQ Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="my-16 max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Frequently Asked Questions
        </h2>
        <FAQ />
      </motion.section>

      {/* Call-to-Action Banner */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="my-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white"
        >
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">
              Ready to plan your next event?
            </h3>
            <p className="text-white/90 mb-4">
              Sign up now to get started, or contact our support team for a
              personalized demo or help.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-end">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition w-full sm:w-auto"
            >
              Sign Up Free
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-purple-50 transition w-full sm:w-auto text-center"
            >
              Contact Support
            </button>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

// FAQ component
function FAQ() {
  const faqs = [
    {
      q: "What is EventHive?",
      a: "EventHive is an all-in-one event management platform that connects clients with trusted planners, streamlines bookings, and enables seamless communication.",
    },
    {
      q: "How do I subscribe to a plan?",
      a: "Simply click on the 'Choose' button under your preferred plan and follow the sign-up and payment instructions.",
    },
    {
      q: "Can I upgrade or downgrade my plan later?",
      a: "Yes! You can change your subscription at any time from your dashboard.",
    },
    {
      q: "How do i book an event?",
      a: "You can book an event by clicking on the 'Book' button on the event page and following the instructions.",
    },
    {
      q: "Is there a free plan?",
      a: "Yes, we offer a Free Starter plan with limited features so you can try out EventHive before upgrading.",
    },
    {
      q: "How do I contact support?",
      a: "You can reach us via the contact details in the footer or through your dashboard's support section.",
    },
  ];
  const [open, setOpen] = React.useState(null);
  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <motion.div
          key={idx}
          layout
          initial={{ borderRadius: 12 }}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-blue-700 focus:outline-none focus:bg-blue-50 hover:bg-blue-50 transition"
            onClick={() => setOpen(open === idx ? null : idx)}
            aria-expanded={open === idx}
          >
            {faq.q}
            <motion.span
              animate={{ rotate: open === idx ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-2"
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === idx && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-3 text-gray-700 text-sm overflow-hidden"
              >
                {faq.a}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function DynamicPlansSection() {
  const { backendURL, userData } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line
  }, [backendURL]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/plans`);
      const data = await res.json();
      setPlans(data.plans || []);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlanId = () => {
    if (!userData) return null;
    if (typeof userData.plan === "string") return userData.plan;
    if (userData.plan?._id) return userData.plan._id;
    return null;
  };
  const currentPlanId = getCurrentPlanId();

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading plans...</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => {
        const isCurrent = currentPlanId === plan._id;
        const color = planColors[plan.name] || planColors["Free"];
        return (
          <motion.div
            key={plan._id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 8px 32px rgba(80,80,200,0.08)",
            }}
            className={`relative bg-gradient-to-br ${
              color.bg
            } rounded-2xl shadow-lg p-8 flex flex-col items-center border-4 transition-all duration-200 overflow-visible ${
              isCurrent
                ? `${color.border} scale-105 ring-4 ring-green-300 mt-8` // add top margin for badge
                : "border-transparent hover:scale-105 hover:shadow-2xl"
            }`}
            style={{ minHeight: "340px" }}
          >
            {/* Plan Badge Above Card - Responsive */}
            {isCurrent && (
              <div
                className="absolute left-1/2 flex justify-center w-full"
                style={{ top: "-2.5rem" }}
              >
                <span
                  className={`px-5 py-2 rounded-full text-base font-bold shadow-xl ${color.badge} text-white border-2 border-white drop-shadow-lg whitespace-nowrap`}
                >
                  Current Plan
                </span>
              </div>
            )}
            <h3 className={`text-2xl font-extrabold mb-2 ${color.text}`}>
              {plan.name}
            </h3>
            <div className={`text-3xl font-bold mb-4 ${color.text}`}>
              {plan.price === 0 ? "$0/mo" : `$${plan.price}/mo`}
            </div>
            <ul
              className={`${color.text.replace(
                "800",
                "900"
              )} text-sm mb-6 space-y-2`}
            >
              {plan.features &&
                Object.entries(plan.features).map(([key, value]) =>
                  value ? (
                    <li key={key} className="flex items-center gap-2">
                      <CheckCircle className={`inline w-5 h-5 ${color.icon}`} />
                      {typeof value === "boolean"
                        ? key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                        : `${key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) =>
                              str.toUpperCase()
                            )}: ${value}`}
                    </li>
                  ) : null
                )}
            </ul>
            <button
              className={`font-semibold px-6 py-2 rounded-lg shadow transition text-white w-full ${
                isCurrent ? "bg-green-400 cursor-not-allowed" : color.button
              }`}
              disabled
            >
              {isCurrent ? "Current Plan" : `Choose ${plan.name}`}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

export default Home;
