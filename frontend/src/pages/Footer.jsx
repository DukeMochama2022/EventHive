import React, { useEffect, useState } from "react";

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
    <div className="fixed left-0 bottom-0 w-full z-50 px-6 md:px-16 lg:px-24 xl:px-32 bg-white text-gray-800 shadow-inner">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-300 text-gray-700">
        <div>
          <img
            className="w-34 md:w-32"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoColored.svg"
            alt="dummyLogoColored"
          />
          <p className="max-w-[410px] mt-6">
            EventHive is your gateway to discovering, booking, and managing the
            best events around you. Join our community and never miss out on
            memorable experiences!
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {linkSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="hover:underline transition"
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
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        Copyright 2025 © EventHive. All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer;
