import React, { useContext, useState } from "react";
import { LanguageContext } from "../LanguageContext.jsx";

const content = {
  en: {
    label: "FREQUENTLY ASKED QUESTIONS",
    title: "Find Quick Answers",
    faqs: [
      { question: "What is Pragati Setu?", answer: "Pragati Setu is a government-grade digital platform designed to strengthen and manage Self Help Group (SHG)–related activities across Uttar Pradesh.", color: "#2563eb" },
      { question: "What is the purpose of Pragati Setu?", answer: "Pragati Setu supports SHG women through beneficiary management, livelihood monitoring, financial inclusion and targeted interventions.", color: "#22c55e" },
      { question: "What kind of data is captured?", answer: "The platform captures beneficiary profiles, SHG details, enterprises, training, skills, financial status and progress indicators.", color: "#0ea5e9" },
      { question: "Who can use Pragati Setu?", answer: "Field functionaries, Community-Based Organizations and government officials at block, district and state levels can use Pragati Setu.", color: "#2563eb" },
      { question: "How does it help SHG women?", answer: "It enables targeted training, financial access, enterprise support and continuous livelihood monitoring for SHG women.", color: "#f97316" },
      { question: "How do I access the dashboard?", answer: "Click Login in the top navigation bar. After successful login, you will be redirected to your dashboard.", color: "#ef4444" },
    ],
  },
  hi: {
    label: "अक्सर पूछे जाने वाले प्रश्न",
    title: "त्वरित उत्तर खोजें",
    faqs: [
      { question: "प्रगति सेतु क्या है?", answer: "प्रगति सेतु उत्तर प्रदेश में स्वयं सहायता समूहों से जुड़ी गतिविधियों को मजबूत और प्रबंधित करने के लिए एक डिजिटल प्लेटफ़ॉर्म है।", color: "#2563eb" },
      { question: "प्रगति सेतु का उद्देश्य क्या है?", answer: "इसका उद्देश्य SHG महिलाओं को आजीविका, वित्तीय समावेशन और लक्षित सहायता के माध्यम से सशक्त बनाना है।", color: "#22c55e" },
      { question: "किस प्रकार का डेटा संग्रहित होता है?", answer: "लाभार्थी प्रोफाइल, SHG विवरण, उद्यम, प्रशिक्षण, कौशल और वित्तीय स्थिति से संबंधित डेटा संग्रहित होता है।", color: "#0ea5e9" },
      { question: "प्रगति सेतु का उपयोग कौन करता है?", answer: "फील्ड कर्मचारी तथा ब्लॉक, जिला और राज्य स्तर के अधिकारी इसका उपयोग करते हैं।", color: "#2563eb" },
      { question: "यह SHG महिलाओं की कैसे मदद करता है?", answer: "यह प्रशिक्षण, वित्तीय सहायता, उद्यम विकास और आजीविका निगरानी में सहायता करता है।", color: "#f97316" },
      { question: "डैशबोर्ड कैसे खोलें?", answer: "ऊपर दिए गए लॉगिन विकल्प पर क्लिक करें। सफल लॉगिन के बाद डैशबोर्ड खुल जाएगा।", color: "#ef4444" },
    ],
  },
};

export default function HeroFAQs() {
  const { lang } = useContext(LanguageContext);
  const [activeIndex, setActiveIndex] = useState(0); // first FAQ open by default
  const t = content[lang] || content.en;

  const toggleFAQ = (index) => setActiveIndex(activeIndex === index ? null : index);

  return (
    <div className="faq-wrap">
      <div className="faq-head">
        <div className="faq-label">
          <span className="faq-label-line"></span>
          {t.label}
        </div>
        <h2>{t.title}</h2>
      </div>

      <div className="faq-list">
        {t.faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div key={index} className={`faq-card ${isOpen ? "open" : ""}`} style={{ "--faq-color": faq.color }}>
              <button type="button" className="faq-question" onClick={() => toggleFAQ(index)}>
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon">{isOpen ? "−" : "+"}</span>
              </button>

              <div className="faq-answer-wrapper">
                <div className="faq-answer-inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .faq-wrap { width: 100%; max-width: none; margin: 0; padding: 5px 30px; box-sizing: border-box; background: #FFF9F7; }

        .faq-head { width: 100%; margin-bottom: 20px;}
        .faq-label { display: flex; align-items: center; gap: 7px; margin-bottom: 6px; color: #f97316; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
        .faq-label-line { display: block; width: 20px; height: 2px; background: #f97316; border-radius: 10px; flex-shrink: 0; }
        .faq-head h2 { margin: 0; color: #123d75; font-size: 32px; font-weight: 800; line-height: 1.15; }

        .faq-list { width: 100%; display: flex; flex-direction: column; gap: 9px; }

        .faq-card { position: relative; width: 100%; overflow: hidden; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 7px; box-shadow: 0 3px 10px rgba(15, 23, 42, 0.05); box-sizing: border-box; transition: background 0.3s ease, box-shadow 0.3s ease; }
        /* Colored left border */
        .faq-card::before { content: ""; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: var(--faq-color); }
        .faq-card.open { background: #fcfdff; box-shadow: 0 5px 15px rgba(15, 23, 42, 0.07); }

        .faq-question { width: 100%; min-height: 48px; padding: 12px 16px 12px 20px; border: none; outline: none; background: transparent; display: flex; align-items: center; justify-content: space-between; gap: 15px; text-align: left; cursor: pointer; }
        .faq-question-text { flex: 1; min-width: 0; color: #0f2748; font-size: 14px; font-weight: 700; line-height: 1.35; }
        .faq-icon { width: 25px; height: 25px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #475569; font-size: 20px; font-weight: 400; line-height: 1; }

        .faq-answer-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s ease; }
        .faq-card.open .faq-answer-wrapper { grid-template-rows: 1fr; }
        .faq-answer-inner { overflow: hidden; }
        .faq-answer-inner p { margin: 0 48px 14px 20px; color: #64748b; font-size: 12.5px; line-height: 1.55; }

        @media (min-width: 1400px) {
          .faq-wrap { padding: 10px 50px; }
          .faq-head h2 { font-size: 34px; }
          .faq-question { min-height: 52px; }
          .faq-question-text { font-size: 15px; }
          .faq-answer-inner p { font-size: 13.5px; }
        }

        @media (max-width: 1200px) {
          .faq-wrap { width: 100%; max-width: none; padding: 5px 24px; }
          .faq-head h2 { font-size: 30px; }
          .faq-question-text { font-size: 13.5px; }
        }

        @media (max-width: 1024px) {
          .faq-wrap { padding: 5px 20px; }
          .faq-head { margin-bottom: 18px; }
          .faq-head h2 { font-size: 28px; }
          .faq-question { min-height: 47px; }
          .faq-question-text { font-size: 13px; }
          .faq-answer-inner p { font-size: 12px; }
        }

        @media (max-width: 900px) {
          .faq-wrap { padding: 5px 18px; }
          .faq-head { margin-bottom: 16px; }
          .faq-head h2 { font-size: 27px; }
          .faq-list { gap: 8px; }
          .faq-question { padding: 11px 15px 11px 18px; }
        }

        @media (max-width: 600px) {
          .faq-wrap { padding: 0 14px; }
          .faq-head { margin-bottom: 15px; }
          .faq-label { font-size: 9px; gap: 6px; }
          .faq-label-line { width: 16px; }
          .faq-head h2 { font-size: 23px; }
          .faq-question { min-height: 45px; padding: 11px 12px 11px 16px; }
          .faq-question-text { font-size: 12.5px; }
          .faq-icon { width: 22px; height: 22px; font-size: 18px; }
          .faq-answer-inner p { margin: 0 38px 12px 16px; font-size: 11.5px; }
        }

        @media (max-width: 400px) {
          .faq-wrap { padding: 0 10px; }
          .faq-head { margin-bottom: 13px; }
          .faq-label { font-size: 8.5px; }
          .faq-label-line { width: 15px; }
          .faq-head h2 { font-size: 20px; }
          .faq-list { gap: 7px; }
          .faq-card { border-radius: 6px; }
          .faq-question { min-height: 42px; padding: 10px 10px 10px 14px; }
          .faq-question-text { font-size: 11.5px; line-height: 1.3; }
          .faq-icon { width: 20px; height: 20px; font-size: 17px; }
          .faq-answer-inner p { margin: 0 30px 11px 14px; font-size: 10.5px; line-height: 1.5; }
        }
      `}</style>
    </div>
  );
}
