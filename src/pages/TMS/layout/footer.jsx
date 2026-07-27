import React, { useEffect, useState } from "react";

const messages = [
  "प्रशिक्षण प्रबंधन प्रणाली (TMS) पोर्टल में आपका स्वागत है।",
  '⚙️ तकनीकी समस्या होने पर कृपया होमपेज पर उपलब्ध "Complaint & Support" अनुभाग में अपनी शिकायत दर्ज करें।',
  "📖 पोर्टल के संचालन संबंधी किसी भी जानकारी के लिए कृपया Pragati Setu Resource Centre में उपलब्ध User Manuals देखें।",
  "🙏 आपके सहयोग के लिए धन्यवाद।",
  "Welcome to the TMS Portal.",
  "⚙️ In case of any technical issue, please register your grievance using the Complaint & Support section on the homepage.",
  "📖 For any guidance regarding the portal, please refer to the User Manuals available in the Pragati Setu Resource Centre.",
  "🙏 Thank you for your support.",
];

const Footer = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 18000); // Change message after one animation completes

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="footer">
      <div className="marquee">
        <div key={index} className="marquee-content">
          {messages[index]}
        </div>
      </div>

      <style>{`
        .footer{
          background-color:#496d9c;
          color:white;
          padding:8px 0;
          font-size:16px;
          margin:0;
          line-height:1.5;
        }

        .marquee{
          width:100%;
          overflow:hidden;
          position:relative;
        }

        .marquee-content{
          display:inline-block;
          white-space:nowrap;
          font-weight:500;
          animation:scrollText 18s linear;
        }

        @keyframes scrollText{
          from{
            transform:translateX(100vw);
          }
          to{
            transform:translateX(-100%);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
