// src/pages/HeroComponents/HeroPSInfo.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { LanguageContext } from "../LanguageContext.jsx";
import Login from "../Login.jsx";
import { FaPlay, FaArrowRight } from "react-icons/fa";
import purposeVideo from "../../assets/Hero/About/purpose_video.mp4";

const content = {
  en: {
    watchVideo: "Watch Full Video",
    explorePlatform: "Explore Platform",
  },

  hi: {
    watchVideo: "पूरा वीडियो देखें",
    explorePlatform: "प्लेटफॉर्म देखें",
  },
};

export default function Info() {
  const videoRef = useRef(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  // =====================================================
  // BACKGROUND VIDEO MODE
  // =====================================================

  const setBackgroundVideoMode = async (video) => {
    if (!video) return;

    video.controls = false;
    video.removeAttribute("controls");

    video.muted = true;
    video.defaultMuted = true;

    video.loop = true;

    try {
      await video.play();
    } catch (error) {
      console.log("Background video autoplay prevented:", error);
    }
  };

  // =====================================================
  // LOGIN MODAL BODY SCROLL
  // =====================================================

  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginOpen]);

  // =====================================================
  // VIDEO SETUP
  // =====================================================

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const isFullscreen = () =>
      document.fullscreenElement === video ||
      document.webkitFullscreenElement === video ||
      video.webkitDisplayingFullscreen;

    setBackgroundVideoMode(video);

    const handleFullscreenChange = () => {
      if (!isFullscreen()) {
        setBackgroundVideoMode(video);
      }
    };

    const handleWebkitEndFullscreen = () => {
      setBackgroundVideoMode(video);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    video.addEventListener("webkitendfullscreen", handleWebkitEndFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );

      video.removeEventListener(
        "webkitendfullscreen",
        handleWebkitEndFullscreen,
      );
    };
  }, []);

  // =====================================================
  // WATCH FULL VIDEO
  // =====================================================

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
      <section className="purpose-section">
        {/* FULL BACKGROUND VIDEO */}

        <video
          ref={videoRef}
          className="purpose-background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src={purposeVideo} type="video/mp4" />
        </video>

        {/* OPTIONAL DARK OVERLAY */}

        <div className="purpose-video-overlay"></div>

        {/* ONLY TWO BUTTONS */}

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

        <style>{`

          .purpose-section,
          .purpose-section *{
            box-sizing:border-box;
          }


          /* =========================================
             FULL VIDEO SECTION
          ========================================= */

          .purpose-section{
  position:relative;
  width:100%;
  aspect-ratio:16/9;
  margin:0;
  padding:0;
  overflow:hidden;
  background:#000;
}


          /* =========================================
             BACKGROUND VIDEO
          ========================================= */

          .purpose-background-video{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:contain;
  object-position:center;
  background:#000;
}


          .purpose-background-video:fullscreen,
          .purpose-background-video:-webkit-full-screen{
            width:100vw;
            height:100vh;

            object-fit:contain;

            background:#000;
          }


          /* =========================================
             LIGHT OVERLAY
          ========================================= */

          .purpose-video-overlay{
            position:absolute;
            inset:0;

            z-index:2;

            pointer-events:none;

            background:
              linear-gradient(
                180deg,
                rgba(0,0,0,.04) 0%,
                rgba(0,0,0,.02) 55%,
                rgba(0,0,0,.30) 100%
              );
          }


          /* =========================================
             BUTTONS
          ========================================= */

          .purpose-buttons{
            position:absolute;

            left:50%;
            bottom:55px;

            transform:translateX(-50%);

            z-index:5;

            display:flex;
            align-items:center;
            justify-content:center;

            gap:16px;

            width:max-content;
          }


          .purpose-video-btn,
          .purpose-explore-btn{
            height:50px;

            display:inline-flex;
            align-items:center;
            justify-content:center;

            gap:11px;

            padding:0 24px;

            border-radius:9px;

            font-family:inherit;

            font-size:
              calc(
                13px *
                var(--font-scale,1)
              );

            font-weight:800;

            cursor:pointer;

            transition:
              transform .25s ease,
              background .25s ease,
              box-shadow .25s ease;
          }


          /* WATCH VIDEO */

          .purpose-video-btn{
            min-width:205px;

            border:none;

            background:#ff5b0b;
            color:#fff;

            box-shadow:
              0 8px 22px
              rgba(255,91,11,.30);
          }


          .purpose-video-btn:hover{
            background:#e94e00;

            transform:
              translateY(-3px);
          }


          .purpose-play{
            width:25px;
            height:25px;

            display:flex;
            align-items:center;
            justify-content:center;

            flex-shrink:0;

            border-radius:50%;

            background:#fff;
            color:#ff5b0b;

            font-size:9px;
          }


          /* EXPLORE */

          .purpose-explore-btn{
            min-width:185px;

            border:1.5px solid #fff;

            background:
              rgba(255,255,255,.95);

            color:#18365f;

            box-shadow:
              0 8px 22px
              rgba(0,0,0,.15);
          }


          .purpose-explore-btn:hover{
            background:#fff;

            transform:
              translateY(-3px);
          }


          /* =========================================
             1400+
          ========================================= */

          @media(min-width:1400px){

            .purpose-buttons{
              bottom:65px;
            }

            .purpose-video-btn,
            .purpose-explore-btn{
              height:54px;

              padding:0 28px;

              font-size:
                calc(
                  14px *
                  var(--font-scale,1)
                );
            }

          }


          /* =========================================
             1024
          ========================================= */

          @media(max-width:1024px){

            .purpose-section{
              min-height:520px;
            }

            .purpose-buttons{
              bottom:40px;
            }

          }


          /* =========================================
             600 MOBILE
          ========================================= */

          @media(max-width:600px){

            .purpose-section{
              height:70vh;

              min-height:460px;
            }

            .purpose-background-video{
              object-position:center;
            }

            .purpose-buttons{
              bottom:25px;

              width:
                calc(
                  100% - 28px
                );

              gap:10px;
            }

            .purpose-video-btn,
            .purpose-explore-btn{
              flex:1;

              min-width:0;

              height:44px;

              padding:0 12px;

              gap:7px;

              font-size:
                calc(
                  10px *
                  var(--font-scale,1)
                );
            }

            .purpose-play{
              width:21px;
              height:21px;

              font-size:7px;
            }

          }


          /* =========================================
             400 SMALL MOBILE
          ========================================= */

          @media(max-width:400px){

            .purpose-section{
              min-height:420px;
            }

            .purpose-buttons{
              flex-direction:column;

              bottom:20px;

              width:
                calc(
                  100% - 24px
                );
            }

            .purpose-video-btn,
            .purpose-explore-btn{
              width:100%;

              flex:none;
            }

          }

        `}</style>
      </section>

      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
