// src/pages/HeroComponents/HeroPSInfo.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../LanguageContext.jsx";
import Login from "../Login.jsx";
import {
  FaUsers,
  FaChartLine,
  FaChalkboardTeacher,
  FaUserTie,
  FaPlay,
  FaArrowRight,
} from "react-icons/fa";
import purposeBg from "../../assets/Hero/About/purpose_bg.png";
import purposeVideo from "../../assets/Hero/About/purpose_video.mp4";

const en = {
  mainTitle: "PRAGATI SETU",
  subtitle1: "A Unified Digital Platform for",
  subtitle2: "Stronger Self Help Groups and",
  subtitle3: "Sustainable Rural Livelihoods",
  hindiLine1: "नारी की शक्ति,",
  hindiLine2: "प्रदेश की प्रगति",
  tagline: "Empowered SHGs • Prosperous Rural Communities",
  watchVideo: "Watch Full Video",
  explorePlatform: "Explore Platform",
  modules: {
    beneficiary: "Beneficiary Management System",
    training: "Training Management System",
    enterprise: "Enterprise Sakhi Management System",
    lakhpati: "Lakhpati Didi Management System",
  },
};

const hi = {
  mainTitle: "प्रगति सेतु",
  subtitle1: "स्वयं सहायता समूहों और",
  subtitle2: "सतत ग्रामीण आजीविका के लिए",
  subtitle3: "एक एकीकृत डिजिटल प्लेटफॉर्म",
  hindiLine1: "नारी की शक्ति,",
  hindiLine2: "प्रदेश की प्रगति",
  tagline: "सशक्त स्वयं सहायता समूह • समृद्ध ग्रामीण समुदाय",
  watchVideo: "पूरा वीडियो देखें",
  explorePlatform: "प्लेटफॉर्म देखें",
  modules: {
    beneficiary: "लाभार्थी प्रबंधन प्रणाली",
    training: "प्रशिक्षण प्रबंधन प्रणाली",
    enterprise: "एंटरप्राइज सखी प्रबंधन प्रणाली",
    lakhpati: "लखपति दीदी प्रबंधन प्रणाली",
  },
};

const content = { en, hi };

const modules = [
  {
    number: "01",
    key: "beneficiary",
    icon: <FaUsers />,
    type: "blue",
    to: "/beneficiary-profiling",
  },
  {
    number: "02",
    key: "training",
    icon: <FaChalkboardTeacher />,
    type: "orange",
    to: "/training-management",
  },
  {
    number: "03",
    key: "enterprise",
    icon: <FaChartLine />,
    type: "blue",
    to: "/enterprise-tracking",
  },
  {
    number: "04",
    key: "lakhpati",
    icon: <FaUserTie />,
    type: "orange",
    to: "/lakhpati-didi",
  },
];

export default function Info() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  const setInlineVideoMode = async (video) => {
    video.controls = false;
    video.removeAttribute("controls");
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    try {
      await video.play();
    } catch (error) {
      console.log("Inline video playback prevented:", error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isFullscreen = () =>
      document.fullscreenElement === video ||
      document.webkitFullscreenElement === video ||
      video.webkitDisplayingFullscreen;

    setInlineVideoMode(video);

    const handleFullscreenChange = () => {
      if (!isFullscreen()) setInlineVideoMode(video);
    };
    const handleWebkitEndFullscreen = () => setInlineVideoMode(video);

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (isFullscreen()) return;
        if (entry.isIntersecting) {
          setInlineVideoMode(video);
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    video.addEventListener("webkitendfullscreen", handleWebkitEndFullscreen);

    return () => {
      observer.disconnect();
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      video.removeEventListener(
        "webkitendfullscreen",
        handleWebkitEndFullscreen,
      );
      video.pause();
    };
  }, []);

  const handleWatchFullVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
      video.muted = false;
      video.defaultMuted = false;
      video.controls = true;
      video.loop = true;

      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }

      await video.play();
    } catch (error) {
      console.error("Fullscreen video error:", error);
      video.muted = false;
      video.defaultMuted = false;
      video.controls = true;
      try {
        await video.play();
      } catch (playError) {
        console.error("Video playback error:", playError);
      }
    }
  };

  return (
    <>
      <section
        className="purpose-section"
        style={{ backgroundImage: `url(${purposeBg})` }}
      >
        <div className="purpose-main">
          <div className="purpose-left">
            <h1>{t.mainTitle}</h1>
            <h2>
              {t.subtitle1}
              <br />
              {t.subtitle2}
              <br />
              {t.subtitle3}
            </h2>
            <span className="purpose-line"></span>
            <div className="purpose-hindi">
              <span>{t.hindiLine1}</span>
              <strong>{t.hindiLine2}</strong>
            </div>
            <p className="purpose-tagline">{t.tagline}</p>
            <div className="purpose-buttons">
              <button
                type="button"
                className="purpose-video-btn"
                onClick={handleWatchFullVideo}
              >
                <span className="purpose-play">
                  <FaPlay />
                </span>
                <span>{t.watchVideo}</span>
                <FaArrowRight />
              </button>
              <button
                type="button"
                className="purpose-explore-btn"
                onClick={() => setIsLoginOpen(true)}
              >
                <span>{t.explorePlatform}</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
          <div className="purpose-video-wrapper">
            <video
              ref={videoRef}
              className="purpose-video"
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
            >
              <source src={purposeVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="purpose-bottom">
          <div className="purpose-module-grid">
            {modules.map((item) => (
              <button
                type="button"
                key={item.number}
                className="purpose-module-card"
                onClick={() => navigate(item.to)}
              >
                <div className={`purpose-module-icon ${item.type}`}>
                  {item.icon}
                </div>
                <div className="purpose-module-content">
                  <strong>{item.number}</strong>
                  <span>{t.modules[item.key]}</span>
                </div>
                <span className="purpose-module-arrow">›</span>
              </button>
            ))}
          </div>
        </div>
        <style>{`
.purpose-section,.purpose-section *{box-sizing:border-box}
.purpose-section{position:relative;width:100%;height:100vh;margin:0;padding:0;overflow:hidden;background-color:#f7eadb;background-size:cover;background-position:center;background-repeat:no-repeat}
.purpose-main{position:relative;z-index:2;width:92%;max-width:1460px;min-height:475px;margin:15vh auto 0;display:grid;grid-template-columns:42% 58%;gap:32px;align-items:center;padding:34px 0 45px}
.purpose-left{position:relative;z-index:3;padding-left:clamp(5px,2vw,30px)}
.purpose-left h1{margin:0 0 5px;color:#072a65;font-size:clamp(45px,4.3vw,72px);font-weight:900;line-height:1;letter-spacing:1px}
.purpose-left h2{margin:0 0 14px;color:#172033;font-size:clamp(18px,1.8vw,28px);font-weight:500;line-height:1.28}
.purpose-line{display:block;width:58px;height:4px;margin:0 0 18px;background:#ff5b0b;border-radius:20px}
.purpose-hindi{display:flex;flex-direction:column;margin-bottom:12px;line-height:1.1}
.purpose-hindi span{color:#ff5b0b;font-size:clamp(31px,3vw,46px);font-weight:800}
.purpose-hindi strong{margin-left:45px;color:#072a65;font-size:clamp(31px,3vw,46px);font-weight:900}
.purpose-tagline{margin:0 0 25px;color:#243b63;font-size:calc(14px*var(--font-scale,1));font-weight:700}
.purpose-buttons{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.purpose-video-btn,.purpose-explore-btn{height:48px;display:inline-flex;align-items:center;justify-content:center;gap:12px;padding:0 22px;border-radius:10px;font-family:inherit;font-size:calc(13px*var(--font-scale,1));font-weight:800;cursor:pointer;transition:.25s ease}
.purpose-video-btn{min-width:205px;border:none;background:#ff5b0b;color:#fff;box-shadow:0 7px 18px rgba(255,91,11,.25)}
.purpose-video-btn:hover{background:#e94e00;transform:translateY(-2px)}
.purpose-play{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#fff;color:#ff5b0b;font-size:9px}
.purpose-explore-btn{min-width:170px;border:1.5px solid #36547d;background:rgba(255,255,255,.95);color:#18365f}
.purpose-explore-btn:hover{background:#fff;transform:translateY(-2px)}
.purpose-video-wrapper{position:relative;width:100%;overflow:hidden;border:2px solid rgba(255,255,255,.75);border-radius:15px;background:#000;box-shadow:0 10px 30px rgba(26,52,89,.24)}
.purpose-video{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#000}
.purpose-video:fullscreen,.purpose-video:-webkit-full-screen{width:100vw;height:100vh;object-fit:contain;background:#000}
.purpose-bottom{position:relative;z-index:3;width:100%;padding:26px 3% 38px;margin-top:17vh;background:#fff6ef}
.purpose-module-grid{width:100%;max-width:1450px;margin:0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.purpose-module-card{position:relative;width:100%;min-width:0;min-height:82px;display:flex;align-items:center;gap:12px;padding:11px 34px 11px 11px;background:#fff;border:1px solid #edf0f4;border-radius:11px;box-shadow:0 5px 15px rgba(25,49,82,.08);font-family:inherit;text-align:left;cursor:pointer;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}
.purpose-module-card:hover{transform:translateY(-4px);border-color:#ffd8c3;box-shadow:0 10px 22px rgba(25,49,82,.13)}
.purpose-module-card:focus-visible{outline:3px solid rgba(255,91,11,.3);outline-offset:3px}
.purpose-module-icon{width:52px;height:52px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:9px;color:#fff;font-size:22px}
.purpose-module-icon.blue{background:linear-gradient(145deg,#1478d4,#06489c)}
.purpose-module-icon.orange{background:linear-gradient(145deg,#ff7a22,#f14e00)}
.purpose-module-content{min-width:0;display:flex;flex-direction:column;gap:4px}
.purpose-module-content strong{color:#092962;font-size:calc(18px*var(--font-scale,1));font-weight:900}
.purpose-module-content span{color:#18365f;font-size:calc(14px*var(--font-scale,1));font-weight:800;line-height:1.25}
.purpose-module-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#7890ad;font-size:22px}
@media(min-width:1400px){.purpose-main{max-width:1500px;min-height:500px;padding-top:40px}.purpose-video-wrapper{max-width:730px;justify-self:end}.purpose-module-grid{max-width:1500px}.purpose-module-content span{font-size:calc(15px*var(--font-scale,1))}}
@media(max-width:1200px){.purpose-main{width:94%;grid-template-columns:42% 58%;gap:24px;min-height:450px}.purpose-module-card{gap:9px;padding-right:28px}.purpose-module-icon{width:46px;height:46px;font-size:19px}.purpose-module-content span{font-size:calc(12px*var(--font-scale,1))}}
@media(max-width:1024px){.purpose-main{grid-template-columns:44% 56%;min-height:420px}.purpose-left h1{font-size:43px}.purpose-left h2{font-size:17px}.purpose-hindi span,.purpose-hindi strong{font-size:29px}.purpose-hindi strong{margin-left:25px}.purpose-module-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:900px){.purpose-main{grid-template-columns:1fr;gap:28px;padding:40px 0 45px}.purpose-left{max-width:650px}.purpose-video-wrapper{width:100%;max-width:760px;margin:0 auto}.purpose-module-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.purpose-section{background-position:center top}.purpose-main{width:calc(100% - 28px);padding:30px 0 38px}.purpose-left{padding:0}.purpose-left h1{font-size:37px}.purpose-left h2{font-size:16px}.purpose-hindi span,.purpose-hindi strong{font-size:26px}.purpose-hindi strong{margin-left:18px}.purpose-buttons{gap:10px}.purpose-video-btn,.purpose-explore-btn{height:43px;padding:0 15px;font-size:calc(11px*var(--font-scale,1))}.purpose-video-btn{min-width:170px}.purpose-explore-btn{min-width:140px}.purpose-bottom{padding:22px 14px 28px}.purpose-module-grid{grid-template-columns:1fr}.purpose-module-card{min-height:76px}}
@media(max-width:400px){.purpose-left h1{font-size:31px}.purpose-left h2{font-size:14px}.purpose-hindi span,.purpose-hindi strong{font-size:23px}.purpose-buttons{width:100%}.purpose-video-btn,.purpose-explore-btn{width:100%;min-width:0}.purpose-module-card{min-height:70px}.purpose-module-content span{font-size:calc(12px*var(--font-scale,1))}}
`}</style>
      </section>
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
