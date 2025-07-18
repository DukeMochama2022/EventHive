import React from "react";
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
} from "lucide-react";
import eventHero from "../assets/event1.jpg";
import eventCta from "../assets/event2.jpg";

const Home = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-20">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 text-center md:text-left">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl bg-gradient-to-r from-indigo-500 to-purple-700 md:text-5xl font-extrabold text-transparent bg-clip-text">
            Welcome to EventHive
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Your Smart Companion for Effortless Event Planning
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto md:mx-0">
            Plan weddings, birthdays, conferences, and more — all in one
            platform.
            <br />
            Trusted planners, clear pricing, smooth communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition">
              Get Started
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition">
              Explore Planners
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end mb-8 md:mb-0">
          <img
            src={eventHero}
            alt="Event"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover h-64 md:h-80"
          />
        </div>
      </section>

      {/* Who We Are */}
      <section className="flex flex-col md:flex-row items-center gap-8">
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
      </section>

      {/* Our Services */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <Package className="w-10 h-10 text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg">Event Package Listings</h3>
            <p className="text-gray-600 text-sm">
              Browse and compare planner packages by category and budget.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <CalendarCheck className="w-10 h-10 text-purple-600 mb-2" />
            <h3 className="font-semibold text-lg">Real-Time Booking System</h3>
            <p className="text-gray-600 text-sm">
              Book planners based on availability and event type.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <MessageCircle className="w-10 h-10 text-pink-600 mb-2" />
            <h3 className="font-semibold text-lg">Secure In-App Messaging</h3>
            <p className="text-gray-600 text-sm">
              Communicate directly with planners and stay updated.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <FileImage className="w-10 h-10 text-green-600 mb-2" />
            <h3 className="font-semibold text-lg">File/Image Sharing</h3>
            <p className="text-gray-600 text-sm">
              Upload mood boards, inspiration photos, and documents.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <LayoutDashboard className="w-10 h-10 text-yellow-500 mb-2" />
            <h3 className="font-semibold text-lg">Dashboard for Planners</h3>
            <p className="text-gray-600 text-sm">
              Manage bookings, payments, and packages from a single interface.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <CreditCard className="w-10 h-10 text-blue-500 mb-2" />
            <h3 className="font-semibold text-lg">Payment Integration</h3>
            <p className="text-gray-600 text-sm">
              Pay securely via M-Pesa or Stripe.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section>
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
      </section>

      {/* Advantages */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Why Choose EventHive?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <LayoutDashboard className="w-10 h-10 text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg">All-in-One Platform</h3>
            <p className="text-gray-600 text-sm">
              Manage planning, booking, and communication from one place — no
              back-and-forth emails.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <ShieldCheck className="w-10 h-10 text-purple-600 mb-2" />
            <h3 className="font-semibold text-lg">Transparent & Trusted</h3>
            <p className="text-gray-600 text-sm">
              Work with verified planners with real reviews and clear pricing.
              No hidden fees.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <Smartphone className="w-10 h-10 text-green-600 mb-2" />
            <h3 className="font-semibold text-lg">Built for Africa</h3>
            <p className="text-gray-600 text-sm">
              Mobile-first, M-Pesa ready, and locally relevant — designed for
              your market.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <CalendarClock className="w-10 h-10 text-pink-600 mb-2" />
            <h3 className="font-semibold text-lg">
              Smart Calendar & Dashboards
            </h3>
            <p className="text-gray-600 text-sm">
              Stay organized with reminders, booking status, and visual
              timelines.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center space-y-3 border border-gray-100">
            <Globe className="w-10 h-10 text-blue-500 mb-2" />
            <h3 className="font-semibold text-lg">Secure & Scalable</h3>
            <p className="text-gray-600 text-sm">
              Built with the latest tech to ensure security, scalability, and
              smooth performance.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="flex flex-col md:flex-row items-center gap-8 pt-8">
        <div className="flex-1 text-center md:text-left space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Ready to plan your next event stress-free?
          </h2>
          <p className="text-gray-700">
            🎯 Find a planner you trust
            <br />
            🎯 Book and track everything online
            <br />
            🎯 Create magical moments, effortlessly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition">
              Sign Up as a Client
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition">
              Join as a Planner
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end mt-8 md:mt-0">
          <img
            src={eventCta}
            alt="Event Call to Action"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover h-64 md:h-80"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
