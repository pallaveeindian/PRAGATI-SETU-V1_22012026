// src/pages/PrivacyPolicy.jsx
import React, { useEffect } from "react";
import {
  FiShield,
  FiDatabase,
  FiLock,
  FiUsers,
  FiFileText,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiCheckCircle,
} from "react-icons/fi";

import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";
import Footer from "../components/layout/Footer.jsx";
import up_logo from "../assets/upgov_logo.jpg";

export default function PrivacyPolicy() {
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="privacy-page-shell">
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="privacy-page">
        <section className="privacy-hero">
          <div className="privacy-container">
            <div className="privacy-hero-content">
              <div className="privacy-eyebrow">
                <FiShield />
                <span>PRIVACY & DATA PROTECTION</span>
              </div>
              <h1>
                <span className="privacy-title-blue">Pragati Setu</span>{" "}
                <span className="privacy-title-orange">Privacy Policy</span>{" "}
                <span className="privacy-title-blue">& Privacy Notice</span>
              </h1>
              <p className="privacy-platform-name">
                Pragati Setu: Digital Livelihoods Platform for Uttar Pradesh
              </p>
              <p className="privacy-department">
                Uttar Pradesh State Rural Livelihoods Mission (UPSRLM)
              </p>
              <div className="privacy-effective-date">
                <span>Effective Date</span>
                <strong>May 7, 2026</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="privacy-intro-section">
          <div className="privacy-container">
            <div className="privacy-intro-card">
              <div className="privacy-intro-accent"></div>
              <div className="privacy-intro-icon">
                <FiShield />
              </div>
              <div className="privacy-intro-text">
                <h2>Our Commitment to Privacy</h2>
                <p>
                  This Privacy Policy & Privacy Notice explains how personal
                  data is collected, stored, processed, transferred, and
                  protected across the Pragati Setu digital ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="privacy-content-section">
          <div className="privacy-container">
            <div className="privacy-layout">
              <aside className="privacy-sidebar">
                <div className="privacy-sidebar-card">
                  <div className="privacy-sidebar-heading">
                    <FiFileText />
                    <span>On This Page</span>
                  </div>
                  <nav className="privacy-page-nav">
                    <a href="#scope">
                      <span>01</span>Scope and Statutory Framework
                    </a>
                    <a href="#data-collected">
                      <span>02</span>Personal Data Collected
                    </a>
                    <a href="#processing">
                      <span>03</span>Grounds and Purposes
                    </a>
                    <a href="#security">
                      <span>04</span>Storage & Security
                    </a>
                    <a href="#third-parties">
                      <span>05</span>Third-Party Partners
                    </a>
                    <a href="#liability">
                      <span>06</span>Legal Disclaimers
                    </a>
                    <a href="#grievance">
                      <span>07</span>Rights & Grievance
                    </a>
                  </nav>
                </div>
              </aside>

              <div className="privacy-content">
                <article className="privacy-section-card" id="scope">
                  <div className="privacy-section-header">
                    <div className="privacy-section-number">01</div>
                    <div>
                      <span className="privacy-section-label">
                        PRIVACY FRAMEWORK
                      </span>
                      <h2>Scope and Statutory Framework</h2>
                    </div>
                  </div>
                  <div className="privacy-section-body">
                    <p>
                      This Privacy Policy & Privacy Notice ("Policy") governs
                      the collection, storage, processing, transfer, and
                      protection of personal data captured across the{" "}
                      <strong>Pragati Setu</strong> digital ecosystem,
                      comprising web portals, mobile applications (including the
                      Udhyam Sakhi application), and integrated management
                      systems.
                    </p>
                    <p>
                      Pragati Setu is owned and operated by the{" "}
                      <strong>
                        Uttar Pradesh State Rural Livelihoods Mission (UPSRLM)
                      </strong>
                      , Department of Rural Development, Government of Uttar
                      Pradesh. This Policy is framed in compliance with:
                    </p>
                    <ul className="privacy-list">
                      <li>
                        <FiCheckCircle />
                        <span>
                          The{" "}
                          <strong>
                            Digital Personal Data Protection Act, 2023 (DPDP
                            Act)
                          </strong>{" "}
                          and associated statutory Rules.
                        </span>
                      </li>
                      <li>
                        <FiCheckCircle />
                        <span>
                          The <strong>Information Technology Act, 2000</strong>{" "}
                          (and applicable security rules).
                        </span>
                      </li>
                      <li>
                        <FiCheckCircle />
                        <span>
                          The{" "}
                          <strong>
                            Guidelines for Indian Government Websites and Apps
                            (GIGW 3.0)
                          </strong>{" "}
                          issued by MeitY, NIC, and CERT-In.
                        </span>
                      </li>
                    </ul>
                  </div>
                </article>

                <article className="privacy-section-card" id="data-collected">
                  <div className="privacy-section-header">
                    <div className="privacy-section-number">02</div>
                    <div>
                      <span className="privacy-section-label">
                        DATA COLLECTION
                      </span>
                      <h2>Categories of Personal Data Collected</h2>
                    </div>
                  </div>
                  <div className="privacy-section-body">
                    <p>
                      To facilitate rural development, Self Help Group (SHG)
                      management, skill training, and livelihood enhancement,
                      Pragati Setu processes the following categories of digital
                      personal data:
                    </p>
                    <div className="privacy-data-grid">
                      <div className="privacy-data-card">
                        <div className="privacy-data-icon">
                          <FiUsers />
                        </div>
                        <div>
                          <h3>Beneficiary & Socio-Economic Profiles</h3>
                          <p>
                            Full name, contact number, age, gender, residential
                            address (village, Panchayat, block, district
                            mapping), SHG membership details, socio-economic
                            indicators, and scheme enrollment records.
                          </p>
                        </div>
                      </div>
                      <div className="privacy-data-card">
                        <div className="privacy-data-icon">
                          <FiDatabase />
                        </div>
                        <div>
                          <h3>
                            Training Management System (TMS) & Biometric
                            Attendance Data
                          </h3>
                          <p>
                            Biometric eKYC data, daily training attendance logs,
                            skill requests, trainer profiles, batch details, and
                            certification records.
                          </p>
                        </div>
                      </div>
                      <div className="privacy-data-card">
                        <div className="privacy-data-icon">
                          <FiFileText />
                        </div>
                        <div>
                          <h3>Enterprise Sakhi & Field Survey Data</h3>
                          <p>
                            Survey responses, enterprise revenue metrics,
                            business location data, market linkage details, and
                            Community Resource Person (CRP-EP) mapping captured
                            via the Udhyam Sakhi mobile app and EPSMS portal.
                          </p>
                        </div>
                      </div>
                      <div className="privacy-data-card">
                        <div className="privacy-data-icon">
                          <FiUsers />
                        </div>
                        <div>
                          <h3>Lakhpati Didi Livelihood Metrics</h3>
                          <p>
                            Household income assessments, livelihood
                            intervention plans, financial literacy progress, and
                            SVEP/MED convergence tracking.
                          </p>
                        </div>
                      </div>
                      <div className="privacy-data-card">
                        <div className="privacy-data-icon">
                          <FiLock />
                        </div>
                        <div>
                          <h3>Administrative Access & Telemetry Logs</h3>
                          <p>
                            Role-based credentials, user login IDs, IP
                            addresses, browser types, timestamped activity logs,
                            and administrative audit trails across State (SMMU),
                            District (DMMU), and Block (BMMU) levels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="privacy-section-card" id="processing">
                  <div className="privacy-section-header">
                    <div className="privacy-section-number">03</div>
                    <div>
                      <span className="privacy-section-label">
                        DATA PROCESSING
                      </span>
                      <h2>Lawful Grounds and Purposes of Processing</h2>
                    </div>
                  </div>
                  <div className="privacy-section-body">
                    <p>
                      In accordance with the DPDP Act 2023, personal data on
                      Pragati Setu is processed under statutory grounds for the
                      performance of state welfare functions and with consent
                      where applicable, strictly for the following purposes:
                    </p>
                    <div className="privacy-purpose-list">
                      <div className="privacy-purpose-item">
                        <span className="privacy-dot"></span>
                        <div>
                          <h3>Welfare Delivery & Scheme Mapping</h3>
                          <p>
                            Verifying eligibility, mapping beneficiaries to
                            relevant rural livelihood schemes, and delivering
                            targeted government benefits.
                          </p>
                        </div>
                      </div>
                      <div className="privacy-purpose-item">
                        <span className="privacy-dot"></span>
                        <div>
                          <h3>Capacity Building & Verification</h3>
                          <p>
                            Executing skill development batches, verifying
                            beneficiary attendance via biometric eKYC, and
                            processing training disbursements.
                          </p>
                        </div>
                      </div>
                      <div className="privacy-purpose-item">
                        <span className="privacy-dot"></span>
                        <div>
                          <h3>Enterprise & Livelihood Monitoring</h3>
                          <p>
                            Tracking income growth of SHG households, managing
                            non-farm enterprises, and assisting women
                            entrepreneurs in becoming Lakhpati Didis.
                          </p>
                        </div>
                      </div>
                      <div className="privacy-purpose-item">
                        <span className="privacy-dot"></span>
                        <div>
                          <h3>System Administration & Governance</h3>
                          <p>
                            Enabling multi-tier role-based operational access,
                            maintaining automated audit trails, preventing
                            duplicate beneficiary entries, and conducting
                            state-wide analytics.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="privacy-section-card" id="security">
                  <div className="privacy-section-header">
                    <div className="privacy-section-number">04</div>
                    <div>
                      <span className="privacy-section-label">
                        INFORMATION SECURITY
                      </span>
                      <h2>Data Storage, Retention, and Security Safeguards</h2>
                    </div>
                  </div>
                  <div className="privacy-section-body">
                    <p>
                      UPSRLM enforces strict technical and organizational
                      measures to safeguard all digital personal data:
                    </p>
                    <ul className="privacy-detail-list">
                      <li>
                        <strong>Geographic Data Residency:</strong>
                        <span>
                          All database infrastructure, backups, and media files
                          are hosted exclusively on secure server infrastructure
                          located within the geographical boundaries of India.
                        </span>
                      </li>
                      <li>
                        <strong>Encryption Standards:</strong>
                        <span>
                          Data in transit is secured using 2048-bit SSL/HTTPS
                          encryption, and sensitive database fields (including
                          passwords and access tokens) are stored using salted
                          cryptographic hashing.
                        </span>
                      </li>
                      <li>
                        <strong>Cybersecurity Audits:</strong>
                        <span>
                          The platform undergoes regular Vulnerability
                          Assessment and Penetration Testing (VAPT) and holds a
                          valid "Safe to Host" security clearance certificate
                          issued by an empanelled CERT-In auditor.
                        </span>
                      </li>
                      <li>
                        <strong>Role-Based Access Control (RBAC):</strong>
                        <span>
                          System access is restricted strictly on a need-to-know
                          basis across administrative tiers (SMMU, DMMU, BMMU,
                          Training Partners, CRPs) to prevent unauthorized
                          access.
                        </span>
                      </li>
                      <li>
                        <strong>Data Retention:</strong>
                        <span>
                          Personal data is retained only for as long as
                          necessary to fulfill the statutory objectives of the
                          rural livelihoods mission or as mandated by government
                          record retention schedules and audit regulations.
                        </span>
                      </li>
                    </ul>
                  </div>
                </article>

                <article className="privacy-section-card" id="third-parties">
                  <div className="privacy-section-header">
                    <div className="privacy-section-number">05</div>
                    <div>
                      <span className="privacy-section-label">
                        DATA SHARING
                      </span>
                      <h2>Disclosures and Third-Party Technical Partners</h2>
                    </div>
                  </div>
                  <div className="privacy-section-body">
                    <ol className="privacy-numbered-list">
                      <li>
                        <div className="privacy-list-number">1</div>
                        <div>
                          <h3>Non-Commercialization</h3>
                          <p>
                            UPSRLM does <strong>not</strong> sell, rent, trade,
                            or commercialize any personal data collected on
                            Pragati Setu to third parties.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="privacy-list-number">2</div>
                        <div>
                          <h3>Technical Implementation Partners</h3>
                          <p>
                            Data processing operations, platform hosting, and
                            technical maintenance are supported by authorized
                            government technical implementation partners,
                            including <strong>BDO India LLP</strong>, bound by
                            strict non-disclosure, confidentiality, and data
                            protection agreements.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="privacy-list-number">3</div>
                        <div>
                          <h3>Inter-Departmental Convergence</h3>
                          <p>
                            Data may be shared with authorized Central or State
                            Government departments solely for scheme
                            convergence, financial inclusion, or statutory
                            reporting.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </article>

                <article className="privacy-section-card" id="liability">
                  <div className="privacy-section-header">
                    <div className="privacy-section-number">06</div>
                    <div>
                      <span className="privacy-section-label">
                        LEGAL INFORMATION
                      </span>
                      <h2>Limitation of Liability and Legal Disclaimers</h2>
                    </div>
                  </div>
                  <div className="privacy-section-body">
                    <p>To the maximum extent permitted under applicable law:</p>
                    <ol className="privacy-numbered-list">
                      <li>
                        <div className="privacy-list-number">1</div>
                        <div>
                          <h3>Government Immunity & Good Faith</h3>
                          <p>
                            UPSRLM, its officers, field functionaries, and
                            technical partners shall not be held liable for any
                            indirect, incidental, consequential, or punitive
                            damages arising from the use of the platform or
                            reliance on published content, provided actions were
                            taken in good faith under statutory mandates.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="privacy-list-number">2</div>
                        <div>
                          <h3>User Data Authenticity</h3>
                          <p>
                            Users, field surveyors (CRPs), and registered
                            beneficiaries are solely responsible for ensuring
                            the accuracy and authenticity of the information
                            submitted. UPSRLM disclaims liability for incorrect
                            scheme mapping resulting from false or inaccurate
                            user inputs.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="privacy-list-number">3</div>
                        <div>
                          <h3>External Hyperlinks</h3>
                          <p>
                            Pragati Setu may contain links to external
                            non-government websites. UPSRLM does not guarantee
                            the content, privacy practices, or security of
                            external websites and explicitly disclaims liability
                            for user interactions on external links.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="privacy-list-number">4</div>
                        <div>
                          <h3>Uncontrollable Cyber Incidents</h3>
                          <p>
                            While UPSRLM implements CERT-In compliant security
                            controls, UPSRLM shall not be liable for
                            unauthorized access, data loss, or system
                            disruptions caused by Force Majeure events,
                            unauthorized third-party cyber-attacks, or telecom
                            network failures beyond reasonable technical
                            control.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </article>

                <article className="privacy-section-card" id="grievance">
                  <div className="privacy-section-header">
                    <div className="privacy-section-number">07</div>
                    <div>
                      <span className="privacy-section-label">YOUR RIGHTS</span>
                      <h2>Data Principal Rights and Grievance Redressal</h2>
                    </div>
                  </div>
                  <div className="privacy-section-body">
                    <p>
                      Under the Digital Personal Data Protection Act, registered
                      beneficiaries and platform users ("Data Principals")
                      possess the following rights:
                    </p>
                    <ul className="privacy-list">
                      <li>
                        <FiCheckCircle />
                        <span>
                          Right to access a summary of personal data processed.
                        </span>
                      </li>
                      <li>
                        <FiCheckCircle />
                        <span>
                          Right to request correction or updating of inaccurate
                          or incomplete personal profile details.
                        </span>
                      </li>
                      <li>
                        <FiCheckCircle />
                        <span>
                          Right to seek redressal of grievances regarding data
                          processing.
                        </span>
                      </li>
                    </ul>

                    <div className="privacy-grievance-box">
                      <div className="privacy-grievance-heading">
                        <FiAlertCircle />
                        <div>
                          <span>GRIEVANCE REDRESSAL</span>
                          <h3>Grievance Redressal Mechanism</h3>
                        </div>
                      </div>
                      <p>
                        In case of any privacy concerns, data queries, or
                        technical issues, users may submit a formal request
                        through the <strong>Complaint & Support</strong> section
                        on the homepage or contact the designated PMU-IT Nodal
                        Officers:
                      </p>
                      <div className="privacy-contact-list">
                        <div className="privacy-contact-item">
                          <FiMail />
                          <div>
                            <strong>
                              Head Project Manager (PMU-IT, UPSRLM)
                            </strong>
                            <span>Mr. Sachin Mishra</span>
                            <a href="mailto:SachinAKumar@bdo.in">
                              SachinAKumar@bdo.in
                            </a>
                          </div>
                        </div>
                        <div className="privacy-contact-item">
                          <FiMail />
                          <div>
                            <strong>Project Manager (PMU-IT, UPSRLM)</strong>
                            <span>Mr. Ashish Saraf</span>
                            <a href="mailto:bdopmuit@gmail.com">
                              bdopmuit@gmail.com
                            </a>
                          </div>
                        </div>
                        <div className="privacy-contact-item">
                          <FiMail />
                          <div>
                            <strong>
                              Technical Support Lead (PMU-IT, UPSRLM)
                            </strong>
                            <span>Ms. Shilpi Raizada</span>
                            <a href="mailto:ShilpiRaizada@bdo.in">
                              ShilpiRaizada@bdo.in
                            </a>
                          </div>
                        </div>
                        <div className="privacy-contact-item">
                          <FiPhone />
                          <div>
                            <strong>Helpline Numbers</strong>
                            <a href="tel:+919236434631">+91-9236434631</a>
                            <a href="tel:+919140346524">+91-9140346524</a>
                            <span>Mon – Fri, 10:30 AM – 6:30 PM</span>
                          </div>
                        </div>
                      </div>
                      <div className="privacy-grievance-note">
                        If a data grievance remains unresolved past statutory
                        timelines, users retain the right to approach the Data
                        Protection Board of India in accordance with the DPDP
                        Act, 2023.
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <style>{`
          .privacy-page-shell, .privacy-page-shell * { box-sizing: border-box; }
          .privacy-page { width: 100%; min-height: 100vh; background: #fffaf6; color: #183a61; scroll-behavior: smooth; }
          .privacy-container { width: 100%; max-width: 1500px; margin: 0 auto; padding: 0 30px; }
          .privacy-hero { position: relative; width: 100%; padding: 48px 0 42px; overflow: hidden; background: linear-gradient(120deg, #fff7f0 0%, #ffffff 48%, #f2f8fd 100%); border-bottom: 1px solid #eee4dc; }
          .privacy-hero::before { content: ""; position: absolute; width: 350px; height: 350px; top: -230px; left: -60px; border: 45px solid rgba(249, 115, 22, 0.07); border-radius: 50%; }
          .privacy-hero::after { content: ""; position: absolute; width: 380px; height: 380px; top: -235px; right: -80px; border: 45px solid rgba(11, 51, 103, 0.055); border-radius: 50%; }
          .privacy-hero-content { position: relative; z-index: 2; max-width: 1000px; margin: 0 auto; text-align: center; }
          .privacy-eyebrow { display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 11px; color: #f15a16; font-size: calc(12px * var(--font-scale, 1)); font-weight: 850; letter-spacing: 1px; }
          .privacy-eyebrow svg { font-size: 17px; }
          .privacy-hero h1 { margin: 0 auto 15px; max-width: 1050px; font-size: calc(43px * var(--font-scale, 1)); font-weight: 900; line-height: 1.18; }
          .privacy-title-blue { color: #072d63; }
          .privacy-title-orange { color: #f15a16; }
          .privacy-platform-name { margin: 0 0 5px; color: #315b87; font-size: calc(16px * var(--font-scale, 1)); font-weight: 700; }
          .privacy-department { margin: 0 0 18px; color: #64748b; font-size: calc(13px * var(--font-scale, 1)); font-weight: 600; }
          .privacy-effective-date { display: inline-flex; align-items: center; gap: 7px; padding: 8px 15px; border: 1px solid #ffd6bf; border-radius: 25px; background: #fff3ea; color: #755143; font-size: calc(11px * var(--font-scale, 1)); }
          .privacy-effective-date strong { color: #e8550d; }
          .privacy-intro-section { width: 100%; padding: 24px 0 0; background: #fffaf6; }
          .privacy-intro-card { position: relative; min-height: 105px; padding: 22px 26px 22px 45px; display: flex; align-items: center; gap: 18px; overflow: hidden; background: #ffffff; border: 1px solid #eee2d9; border-radius: 14px; box-shadow: 0 5px 18px rgba(15, 39, 72, 0.045); }
          .privacy-intro-accent { position: absolute; top: 17px; bottom: 17px; left: 20px; width: 5px; border-radius: 8px; background: #f15a16; }
          .privacy-intro-icon { width: 55px; height: 55px; flex: 0 0 55px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #fff0e6; color: #f15a16; font-size: 24px; }
          .privacy-intro-text { min-width: 0; }
          .privacy-intro-text h2 { margin: 0 0 5px; color: #0b3367; font-size: calc(17px * var(--font-scale, 1)); font-weight: 850; }
          .privacy-intro-text p { margin: 0; color: #597087; font-size: calc(13px * var(--font-scale, 1)); font-weight: 500; line-height: 1.65; }
          .privacy-content-section { width: 100%; padding: 25px 0 65px; background: #fffaf6; }
          .privacy-layout { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 24px; align-items: start; }
          .privacy-sidebar { position: sticky; top: 20px; }
          .privacy-sidebar-card { padding: 17px; background: #ffffff; border: 1px solid #e8e3df; border-radius: 12px; box-shadow: 0 5px 18px rgba(15, 39, 72, 0.045); }
          .privacy-sidebar-heading { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #eef0f3; color: #0b3367; font-size: calc(13px * var(--font-scale, 1)); font-weight: 850; }
          .privacy-sidebar-heading svg { color: #f15a16; font-size: 17px; }
          .privacy-page-nav { display: flex; flex-direction: column; gap: 5px; }
          .privacy-page-nav a { display: flex; align-items: flex-start; gap: 8px; padding: 8px; border-radius: 6px; color: #4e6580; text-decoration: none; font-size: calc(10.5px * var(--font-scale, 1)); font-weight: 650; line-height: 1.45; transition: color 0.2s ease, background 0.2s ease; }
          .privacy-page-nav a span { flex-shrink: 0; color: #f15a16; font-weight: 850; }
          .privacy-page-nav a:hover { color: #0b3367; background: #fff3ea; }
          .privacy-content { min-width: 0; display: flex; flex-direction: column; gap: 18px; }
          .privacy-section-card { scroll-margin-top: 20px; overflow: hidden; background: #ffffff; border: 1px solid #e9e3df; border-radius: 13px; box-shadow: 0 5px 18px rgba(15, 39, 72, 0.045); }
          .privacy-section-header { padding: 20px 23px; display: flex; align-items: center; gap: 14px; background: linear-gradient(90deg, #fff7f1, #ffffff); border-bottom: 1px solid #eee8e3; }
          .privacy-section-number { width: 43px; height: 43px; flex: 0 0 43px; display: flex; align-items: center; justify-content: center; border-radius: 9px; background: #f15a16; color: #ffffff; font-size: calc(12px * var(--font-scale, 1)); font-weight: 900; }
          .privacy-section-label { display: block; margin-bottom: 3px; color: #f15a16; font-size: calc(9px * var(--font-scale, 1)); font-weight: 850; letter-spacing: 0.65px; }
          .privacy-section-header h2 { margin: 0; color: #0b3367; font-size: calc(21px * var(--font-scale, 1)); font-weight: 850; line-height: 1.3; }
          .privacy-section-body { padding: 22px 24px 25px; }
          .privacy-section-body > p { margin: 0 0 16px; color: #4f657d; font-size: calc(13px * var(--font-scale, 1)); font-weight: 500; line-height: 1.75; }
          .privacy-section-body > p:last-child { margin-bottom: 0; }
          .privacy-section-body strong { color: #183f6c; font-weight: 800; }
          .privacy-list { margin: 4px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; list-style: none; }
          .privacy-list li { display: flex; align-items: flex-start; gap: 9px; color: #52687f; font-size: calc(12.5px * var(--font-scale, 1)); line-height: 1.65; }
          .privacy-list li > svg { margin-top: 3px; flex-shrink: 0; color: #f15a16; font-size: 15px; }
          .privacy-data-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
          .privacy-data-card { min-width: 0; padding: 16px; display: flex; align-items: flex-start; gap: 12px; background: #f9fbfd; border: 1px solid #e4eaf0; border-radius: 9px; }
          .privacy-data-card:last-child { grid-column: 1 / -1; }
          .privacy-data-icon { width: 39px; height: 39px; flex: 0 0 39px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: #fff0e7; color: #f15a16; font-size: 17px; }
          .privacy-data-card h3 { margin: 0 0 5px; color: #173f6c; font-size: calc(12.5px * var(--font-scale, 1)); font-weight: 800; line-height: 1.45; }
          .privacy-data-card p { margin: 0; color: #63758a; font-size: calc(11.5px * var(--font-scale, 1)); line-height: 1.65; }
          .privacy-purpose-list { display: flex; flex-direction: column; gap: 12px; }
          .privacy-purpose-item { display: flex; gap: 13px; padding: 14px 16px; background: #f9fbfd; border: 1px solid #e6ebf0; border-radius: 8px; }
          .privacy-dot { width: 9px; height: 9px; margin-top: 6px; flex-shrink: 0; border-radius: 50%; background: #f15a16; box-shadow: 0 0 0 4px #fff0e7; }
          .privacy-purpose-item h3 { margin: 0 0 4px; color: #163f6d; font-size: calc(12.5px * var(--font-scale, 1)); font-weight: 800; }
          .privacy-purpose-item p { margin: 0; color: #63758a; font-size: calc(11.5px * var(--font-scale, 1)); line-height: 1.6; }
          .privacy-detail-list { margin: 0; padding: 0 0 0 18px; display: flex; flex-direction: column; gap: 12px; }
          .privacy-detail-list li { padding-left: 5px; color: #576d83; font-size: calc(12px * var(--font-scale, 1)); line-height: 1.7; }
          .privacy-detail-list li::marker { color: #f15a16; }
          .privacy-detail-list strong { margin-right: 4px; }
          .privacy-numbered-list { margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; list-style: none; }
          .privacy-numbered-list li { padding: 14px 15px; display: flex; align-items: flex-start; gap: 13px; background: #fafcfe; border: 1px solid #e7ebef; border-radius: 8px; }
          .privacy-list-number { width: 30px; height: 30px; flex: 0 0 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #fff0e7; color: #f15a16; font-size: calc(10px * var(--font-scale, 1)); font-weight: 850; }
          .privacy-numbered-list h3 { margin: 1px 0 4px; color: #173f6c; font-size: calc(12.5px * var(--font-scale, 1)); font-weight: 800; }
          .privacy-numbered-list p { margin: 0; color: #607489; font-size: calc(11.5px * var(--font-scale, 1)); line-height: 1.65; }
          .privacy-grievance-box { margin-top: 20px; padding: 20px; background: linear-gradient(120deg, #fff8f3, #ffffff); border: 1px solid #f2d9ca; border-radius: 10px; }
          .privacy-grievance-heading { display: flex; align-items: center; gap: 11px; margin-bottom: 13px; }
          .privacy-grievance-heading > svg { flex-shrink: 0; color: #f15a16; font-size: 25px; }
          .privacy-grievance-heading span { display: block; margin-bottom: 2px; color: #f15a16; font-size: calc(9px * var(--font-scale, 1)); font-weight: 850; letter-spacing: 0.6px; }
          .privacy-grievance-heading h3 { margin: 0; color: #0b3367; font-size: calc(16px * var(--font-scale, 1)); font-weight: 850; }
          .privacy-grievance-box > p { margin: 0 0 17px; color: #576e84; font-size: calc(12px * var(--font-scale, 1)); line-height: 1.65; }
          .privacy-contact-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .privacy-contact-item { min-width: 0; padding: 13px; display: flex; align-items: flex-start; gap: 10px; background: #ffffff; border: 1px solid #e9e6e2; border-radius: 8px; }
          .privacy-contact-item > svg { margin-top: 2px; flex-shrink: 0; color: #f15a16; font-size: 17px; }
          .privacy-contact-item > div { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
          .privacy-contact-item strong { color: #143d6b; font-size: calc(11px * var(--font-scale, 1)); line-height: 1.4; }
          .privacy-contact-item span { color: #63768a; font-size: calc(10.5px * var(--font-scale, 1)); }
          .privacy-contact-item a { color: #e95d16; text-decoration: none; overflow-wrap: anywhere; font-size: calc(10.5px * var(--font-scale, 1)); font-weight: 700; }
          .privacy-contact-item a:hover { text-decoration: underline; }
          .privacy-grievance-note { margin-top: 14px; padding: 12px 14px; background: #eef6fc; border-left: 4px solid #0b4d91; border-radius: 0 7px 7px 0; color: #46627f; font-size: calc(11px * var(--font-scale, 1)); font-weight: 600; line-height: 1.6; }

          @media (min-width: 1400px) {
            .privacy-container { max-width: 1600px; padding: 0 50px; }
            .privacy-hero h1 { font-size: calc(47px * var(--font-scale, 1)); }
            .privacy-layout { grid-template-columns: 280px minmax(0, 1fr); gap: 28px; }
          }
          @media (max-width: 1200px) {
            .privacy-container { padding: 0 24px; }
            .privacy-hero h1 { font-size: calc(39px * var(--font-scale, 1)); }
            .privacy-layout { grid-template-columns: 230px minmax(0, 1fr); gap: 19px; }
          }
          @media (max-width: 1024px) {
            .privacy-container { padding: 0 20px; }
            .privacy-layout { grid-template-columns: 1fr; }
            .privacy-sidebar { position: static; }
            .privacy-page-nav { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .privacy-data-grid { grid-template-columns: 1fr; }
            .privacy-data-card:last-child { grid-column: auto; }
          }
          @media (max-width: 900px) {
            .privacy-hero { padding: 38px 0 34px; }
            .privacy-hero h1 { font-size: calc(34px * var(--font-scale, 1)); }
            .privacy-contact-list { grid-template-columns: 1fr; }
          }
          @media (max-width: 600px) {
            .privacy-container { padding: 0 14px; }
            .privacy-hero { padding: 30px 0 27px; }
            .privacy-hero h1 { font-size: calc(27px * var(--font-scale, 1)); line-height: 1.25; }
            .privacy-platform-name { font-size: calc(13px * var(--font-scale, 1)); line-height: 1.5; }
            .privacy-department { font-size: calc(11px * var(--font-scale, 1)); line-height: 1.5; }
            .privacy-effective-date { flex-wrap: wrap; justify-content: center; }
            .privacy-intro-card { padding: 16px 14px 16px 32px; align-items: flex-start; gap: 11px; }
            .privacy-intro-accent { left: 12px; top: 14px; bottom: 14px; width: 4px; }
            .privacy-intro-icon { width: 42px; height: 42px; flex-basis: 42px; font-size: 19px; }
            .privacy-intro-text h2 { font-size: calc(14px * var(--font-scale, 1)); }
            .privacy-intro-text p { font-size: calc(11px * var(--font-scale, 1)); }
            .privacy-content-section { padding: 18px 0 42px; }
            .privacy-page-nav { grid-template-columns: 1fr; }
            .privacy-section-header { padding: 16px 14px; align-items: flex-start; }
            .privacy-section-number { width: 37px; height: 37px; flex-basis: 37px; }
            .privacy-section-header h2 { font-size: calc(17px * var(--font-scale, 1)); }
            .privacy-section-body { padding: 17px 15px 20px; }
            .privacy-section-body > p { font-size: calc(11.5px * var(--font-scale, 1)); }
            .privacy-list li { font-size: calc(11px * var(--font-scale, 1)); }
            .privacy-data-card, .privacy-purpose-item, .privacy-numbered-list li { padding: 12px; }
            .privacy-grievance-box { padding: 15px; }
          }
          @media (max-width: 400px) {
            .privacy-container { padding: 0 10px; }
            .privacy-hero { padding: 25px 0 22px; }
            .privacy-hero h1 { font-size: calc(23px * var(--font-scale, 1)); }
            .privacy-eyebrow { font-size: calc(9.5px * var(--font-scale, 1)); }
            .privacy-intro-card { padding: 14px 11px 14px 27px; }
            .privacy-intro-icon { width: 36px; height: 36px; flex-basis: 36px; font-size: 16px; }
            .privacy-section-header { gap: 9px; }
            .privacy-section-header h2 { font-size: calc(15px * var(--font-scale, 1)); }
            .privacy-section-number { width: 33px; height: 33px; flex-basis: 33px; }
            .privacy-data-card { gap: 9px; }
            .privacy-data-icon { width: 34px; height: 34px; flex-basis: 34px; }
            .privacy-numbered-list li { gap: 9px; }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  );
}
