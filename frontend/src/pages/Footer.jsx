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
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"],
    },
    {
      title: "Need Help?",
      links: [
        "Delivery Information",
        "Return & Refund Policy",
        "Payment Methods",
        "Track your Order",
        "Contact Us",
      ],
    },
    {
      title: "Follow Us",
      links: ["Instagram", "Twitter", "Facebook", "YouTube"],
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
                    <a href="#" className="hover:underline transition">
                      {link}
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
