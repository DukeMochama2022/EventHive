import React, { useEffect, useState } from "react";
import eventHiveLogo from "../assets/Party Popper Logo for EventHive.png";

function Footer() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.body.offsetHeight;
      // Show footer if user is at (or very near) the bottom (20px buffer)
      setShowFooter(scrollPosition >= pageHeight - 20);
    };
    window.addEventListener("scroll", handleScroll);
    // Check on mount in case already at bottom
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showFooter) return null;

  const linkSections = [
    {
      title: "Navigation",
      links: [
        { name: "Home", href: "/" },
        { name: "Packages", href: "/packages" },
        { name: "Contact", href: "/contact" },
        { name: "Login", href: "/login" },
        { name: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Contact",
      links: [
        { name: "support@eventhive.com", href: "mailto:support@eventhive.com" },
        { name: "+254 112 197 987", href: "tel:+254112197987" },
        { name: "+254 290 000 000", href: "tel:+254290000000" },
        { name: "Nairobi, Kenya", href: "https://maps.app.goo.gl/1234567890" },
      ],
    },
    {
      title: "Follow Us",
      links: [
        { name: "Instagram", href: "https://instagram.com" },
        { name: "Twitter", href: "https://twitter.com" },
        { name: "Facebook", href: "https://facebook.com" },
      ],
    },
  ];

  return (
    <div className="fixed left-0 bottom-0 w-full z-50 bg-white text-gray-800 shadow-inner">
      <div className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-10 py-6 lg:py-10 border-b border-gray-300 text-gray-700">
          {/* Logo and Description Section */}
          <div className="flex flex-col items-start w-full lg:w-auto">
            <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
              <img
                src={eventHiveLogo}
                alt="EventHive Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-15 lg:h-15 object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold text-blue-700">
                EventHive
              </span>
            </div>
            <p className="text-sm sm:text-base max-w-full lg:max-w-[410px] mt-2 leading-relaxed">
              EventHive is your gateway to discovering, booking, and managing
              the best events around you. Join our community and never miss out
              on memorable experiences!
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full lg:w-auto">
            {linkSections.map((section, index) => (
              <div key={index} className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-3 lg:mb-5">
                  {section.title}
                </h3>
                <ul className="text-xs sm:text-sm space-y-1 lg:space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i} className="break-words">
                      <a
                        href={link.href}
                        className="hover:underline transition-colors duration-200 hover:text-blue-600"
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright Section */}
        <div className="py-3 lg:py-4">
          <p className="text-xs sm:text-sm lg:text-base text-center text-gray-500/80 px-2">
            Copyright 2025 © EventHive. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
