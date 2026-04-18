import React, { useState, useContext } from "react";
import { LanguageContext } from "../LanguageContext.jsx";

/**
 * HeroFAQs
 */

export default function HeroFAQs() {
  const { lang } = useContext(LanguageContext);

  const content = {
    en: {
      title: "Frequently Asked",
      highlight: "Questions?",
      faqs: [
        {
          question: "What is Pragati Setu?",
          answer:
            "Pragati Setu is a government-grade digital platform designed to strengthen and manage Self Help Group (SHG)–related activities across the state. It acts as a digital bridge connecting rural women, SHGs, Community-Based Organizations, and government systems through structured data and transparent workflows.",
          color: "#2563eb",
        },
        {
          question: "What is the purpose of Pragati Setu?",
          answer:
            "Pragati Setu aims to enable livelihood-based empowerment of SHG women by capturing beneficiary and enterprise data, supporting skill-based employment, financial inclusion, and continuous livelihood monitoring for informed decision-making and targeted interventions.",
          color: "#16a34a",
        },
        {
          question: "What kind of data is captured in Pragati Setu?",
          answer:
            "The platform captures comprehensive data including beneficiary profiles, SHG and enterprise details, livelihood activities, skill mapping, training interventions, financial inclusion status, and progress indicators.",
          color: "#0ea5e9",
        },
        {
          question: "Who uses Pragati Setu?",
          answer:
            "Pragati Setu is used by field functionaries, Community-Based Organizations, and government officials at block, district, and state levels.",
          color: "#9333ea",
        },
        {
          question: "How does Pragati Setu empower SHG women?",
          answer:
            "By organizing and analyzing livelihood data, Pragati Setu enables targeted skill training, financial access, enterprise support, and continuous monitoring.",
          color: "#15803d",
        },
        {
          question: "How do I navigate to dashboard?",
          answer:
            "Click on Login in the top navigation bar. After login, you will be redirected to your dashboard.",
          color: "#be123c",
        },
      ],
    },

    hi: {
      title: "अक्सर पूछे जाने वाले",
      highlight: "प्रश्न?",
      faqs: [
        {
          question: "प्रगति सेतु क्या है?",
          answer:
            "प्रगति सेतु एक सरकारी डिजिटल प्लेटफ़ॉर्म है जो स्वयं सहायता समूह (SHG) से जुड़ी गतिविधियों के प्रबंधन को मजबूत करता है। यह ग्रामीण महिलाओं, SHG और सरकारी तंत्र के बीच एक डिजिटल सेतु का कार्य करता है।",
          color: "#2563eb",
        },
        {
          question: "प्रगति सेतु का उद्देश्य क्या है?",
          answer:
            "इसका उद्देश्य SHG महिलाओं को सशक्त बनाना है, जिसमें लाभार्थी डेटा, रोजगार, वित्तीय समावेशन और आजीविका की निगरानी शामिल है।",
          color: "#16a34a",
        },
        {
          question: "प्रगति सेतु में किस प्रकार का डेटा संग्रहित होता है?",
          answer:
            "इसमें लाभार्थी प्रोफाइल, SHG विवरण, उद्यम, कौशल, प्रशिक्षण और वित्तीय स्थिति से जुड़ा डेटा शामिल होता है।",
          color: "#0ea5e9",
        },
        {
          question: "प्रगति सेतु का उपयोग कौन करता है?",
          answer:
            "इसका उपयोग ब्लॉक, जिला और राज्य स्तर के अधिकारी तथा फील्ड कर्मचारी करते हैं।",
          color: "#9333ea",
        },
        {
          question: "यह SHG महिलाओं को कैसे सशक्त बनाता है?",
          answer:
            "यह प्लेटफ़ॉर्म डेटा के आधार पर प्रशिक्षण, वित्तीय सहायता और उद्यम विकास को सक्षम बनाता है।",
          color: "#15803d",
        },
        {
          question: "डैशबोर्ड कैसे खोलें?",
          answer:
            "ऊपर दिए गए लॉगिन बटन पर क्लिक करें और लॉगिन करने के बाद डैशबोर्ड खुल जाएगा।",
          color: "#be123c",
        },
      ],
    },
  };

  const t = content[lang] || content.en;

  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="hero-faq-wrapper">
      {/* HEADER */}
      <div className="faq-header">
        <h2 className="faq-title">
          {t.title} <span>{t.highlight}</span>
        </h2>
      </div>

      {/* FAQ LIST */}
      <div className="faq-list">
        {t.faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            style={{ borderLeftColor: faq.color }}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className="faq-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>

            <div
              className="faq-answer"
              style={{
                maxHeight: activeIndex === index ? "300px" : "0px",
              }}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* STYLES */}
      <style>{`
        /* ===== WRAPPER ===== */
        .hero-faq-wrapper {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ===== HEADER ===== */
        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .faq-title {
          font-size: 36px;
          font-weight: 800;
          color: #0f172a;
        }

        .faq-title span {
          color: #fd7301;
        }

        .faq-viewall {
          padding: 8px 18px;
          background: transparent;
          border: 1.5px solid #0f172a;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        /* ===== FAQ LIST ===== */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* ===== FAQ ITEM ===== */
        .faq-item {
          background: #ffffff;
          border-radius: 10px;
          border-left: 6px solid;
          padding: 20px 24px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
          transition: all 0.3s ease;
        }

        .faq-item.active {
          background: #fffaf5;
        }

        /* QUESTION */
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          cursor: pointer;
        }

        .faq-icon {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          transition: transform 0.3s ease;
        }

        .faq-item.active .faq-icon {
          transform: rotate(180deg);
        }

        /* ANSWER */
        .faq-answer {
          overflow: hidden;
          transition: max-height 0.45s ease;
        }

        .faq-answer p {
          margin-top: 14px;
          font-size: 15.5px;
          line-height: 1.7;
          color: #334155;
          max-width: 1000px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .faq-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .faq-title {
            font-size: 28px;
          }
            .hero-faq-wrapper {
          
          margin-left: 10px;
          margin-right: 10px
        }
        }
      `}</style>
    </div>
  );
}
