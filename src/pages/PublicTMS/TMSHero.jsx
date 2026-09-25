// src/pages/PublicTMS/TMSHero.jsx
import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext.jsx";
import tmsHeroBg from "../../assets/TMS/tms_hero_bg.png";
import tmsHeroImg from "../../assets/TMS/tms_hero_right2.png";

const en = {
  breadcrumb1: "Our Services",
  breadcrumb2: "Training Management",
  title: "Training Management",
  description:
    "A digital Training Management System (TMS) to plan, manage and monitor trainings under UPSRLM, enabling stronger skills, empowered women and sustainable livelihoods across Uttar Pradesh.",
  explore: "Explore Features",
  knowMore: "Know More",
};

const hi = {
  breadcrumb1: "हमारी सेवाएं",
  breadcrumb2: "प्रशिक्षण प्रबंधन",
  title: "प्रशिक्षण प्रबंधन",
  description:
    "UPSRLM के अंतर्गत प्रशिक्षण की योजना, प्रबंधन और निगरानी के लिए एक डिजिटल प्रशिक्षण प्रबंधन प्रणाली, जो बेहतर कौशल, महिला सशक्तिकरण और सतत ग्रामीण आजीविका को बढ़ावा देती है।",
  explore: "विशेषताएं देखें",
  knowMore: "और जानें",
};

const content = { en, hi };
const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function TMSHero() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  return (
    <div className="tms-hero" style={{ backgroundImage: `url(${tmsHeroBg})` }}>
      <div className="tms-hero-content">
        <div className="tms-breadcrumb">
          <span className="breadcrumb-line"></span>
          <span>{t.breadcrumb1}</span>
          <span className="breadcrumb-arrow">›</span>
          <span>{t.breadcrumb2}</span>
        </div>
        <h1>{t.title}</h1>
        <p className="tms-description">{t.description}</p>
        <div className="tms-buttons">
          <button className="tms-primary-btn" onClick={() => scrollTo("tms-modules")}>
            {t.explore}
            <span>→</span>
          </button>
          <button className="tms-secondary-btn" onClick={() => scrollTo("tms-overview")}>
            {t.knowMore}
          </button>
        </div>
      </div>
      <div className="tms-hero-image">
        <img src={tmsHeroImg} alt="Training Management System" />
      </div>
      <style>{`
.tms-hero{position:relative;width:100%;height:420px;padding-top:95px;overflow:hidden;background-color:#fff8f2;background-size:46% 100%;background-position:left center;background-repeat:no-repeat}
.tms-hero-content{position:relative;z-index:4;width:45%;max-width:680px;padding:32px 20px 35px clamp(45px,5vw,85px)}
.tms-breadcrumb{display:flex;align-items:center;gap:8px;margin-bottom:12px;color:#e95d0f;font-size:12px;font-weight:700}
.breadcrumb-line{width:24px;height:2px;background:#f97316;flex-shrink:0}
.breadcrumb-arrow{color:#f97316;font-size:16px}
.tms-hero-content h1{margin:0 0 12px;color:#071b4d;font-size:calc(46px*var(--font-scale,1));font-weight:900;line-height:1.05;white-space:nowrap}
.tms-description{max-width:560px;margin:0 0 22px;color:#17375e;font-size:calc(14px*var(--font-scale,1));font-weight:500;line-height:1.55}
.tms-buttons{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.tms-primary-btn,.tms-secondary-btn{height:44px;padding:0 24px;border-radius:6px;font-size:13px;font-weight:800;cursor:pointer;transition:.25s ease}
.tms-primary-btn{min-width:185px;display:flex;align-items:center;justify-content:center;gap:20px;border:none;background:#fc5b0b;color:#fff;box-shadow:0 5px 14px rgba(252,91,11,.22)}
.tms-primary-btn:hover{background:#e94e00;transform:translateY(-2px)}
.tms-secondary-btn{min-width:135px;border:1.5px solid #193d70;background:#fff;color:#08275c}
.tms-secondary-btn:hover{background:#f8fafc}
.tms-hero-image{position:absolute;z-index:2;top:0;right:0;bottom:0;width:62%;height:100%;overflow:hidden;background:#fff}
.tms-hero-image img{display:block;width:100%;height:100%;object-fit:fill;object-position:center}
@media(min-width:1400px){.tms-hero{height:450px;padding-top:95px;background-size:45% 100%}.tms-hero-content{width:44%;padding:38px 25px 40px clamp(60px,6vw,105px)}.tms-hero-content h1{font-size:calc(50px*var(--font-scale,1))}.tms-description{max-width:580px;font-size:calc(15px*var(--font-scale,1))}.tms-hero-image{width:62%}}
@media(max-width:1200px){.tms-hero{height:400px;padding-top:90px;background-size:47% 100%}.tms-hero-content{width:46%;padding:30px 20px 32px 38px}.tms-hero-content h1{font-size:calc(40px*var(--font-scale,1));white-space:normal}.tms-description{max-width:500px;font-size:calc(13px*var(--font-scale,1))}.tms-hero-image{width:60%}.tms-primary-btn,.tms-secondary-btn{height:40px;font-size:12px}}
@media(max-width:1024px){.tms-hero{height:380px;padding-top:85px;background-size:48% 100%}.tms-hero-content{width:47%;padding:28px 18px 30px 28px}.tms-hero-content h1{font-size:calc(34px*var(--font-scale,1))}.tms-description{max-width:450px;font-size:calc(12.5px*var(--font-scale,1))}.tms-primary-btn,.tms-secondary-btn{height:38px;padding:0 15px;font-size:11px}.tms-primary-btn{min-width:150px}.tms-secondary-btn{min-width:105px}.tms-hero-image{width:58%}}
@media(max-width:900px){.tms-hero{height:auto;min-height:370px;padding-top:85px;background-size:cover;background-position:center bottom}.tms-hero-image{display:none}.tms-hero-content{width:100%;max-width:720px;padding:32px 25px 38px}.tms-hero-content h1{font-size:calc(38px*var(--font-scale,1));white-space:normal}.tms-description{max-width:650px;font-size:calc(14px*var(--font-scale,1))}}
@media(max-width:600px){.tms-hero{min-height:370px;padding-top:75px;background-size:cover;background-position:center bottom}.tms-hero-image{display:none}.tms-hero-content{padding:26px 16px 28px}.tms-breadcrumb{margin-bottom:10px;font-size:10px}.breadcrumb-line{width:18px}.tms-hero-content h1{font-size:calc(31px*var(--font-scale,1))}.tms-description{margin-bottom:20px;font-size:calc(13px*var(--font-scale,1));line-height:1.55}.tms-buttons{gap:10px}.tms-primary-btn,.tms-secondary-btn{height:40px;font-size:11px}.tms-primary-btn{min-width:155px}.tms-secondary-btn{min-width:110px}}
@media(max-width:400px){.tms-hero{min-height:390px;padding-top:70px}.tms-hero-image{display:none}.tms-hero-content{padding:23px 13px 24px}.tms-hero-content h1{font-size:calc(27px*var(--font-scale,1))}.tms-description{font-size:calc(12px*var(--font-scale,1))}.tms-buttons{width:100%;gap:8px}.tms-primary-btn,.tms-secondary-btn{flex:1;min-width:0;padding:0 10px}}
`}</style>
    </div>
  );
}