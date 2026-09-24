import React from "react";
import { motion } from "framer-motion";

import titleIntro from "../../assets/Hero/About/title_intro.png";

import beneficiary from "../../assets/Hero/About/beneficiary_management.png";

import enterprise from "../../assets/Hero/About/enterprise_tracking.png";

import training from "../../assets/Hero/About/training_capacity_building.png";

import lakhpati from "../../assets/Hero/About/lakhpati_didi_conversion.png";

import government from "../../assets/Hero/About/government_support_tracking.png";

import centerHub from "../../assets/Hero/About/center_hub.png";

// import hindiSlogan from "../../assets/Hero/About/hindi_slogan.png";

import ruralLandscape from "../../assets/Hero/About/rural_landscape_footer.png";

import mobilePurpose from "../../assets/Hero/About/ps_diag.png";


export default function PragatiPurposeGraphic() {

  const viewport = {
    once: true,
    amount: 0.2,
  };


  return (

    <div className="purpose-graphic-wrapper">


      {/* ================================= */}
      {/* DESKTOP / TABLET GRAPHIC */}
      {/* ================================= */}

      <motion.div
        className="purpose-stage"
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        viewport={viewport}
        transition={{
          duration: 0.4,
        }}
      >


        {/* ================================= */}
        {/* RURAL LANDSCAPE */}
        {/* ================================= */}

        <motion.img
          src={ruralLandscape}
          alt=""
          className="purpose-piece purpose-landscape"
          initial={{
            opacity: 0,
            y: 70,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={viewport}
          transition={{
            duration: 1,
            delay: 1.5,
            ease: "easeOut",
          }}
        />


        {/* ================================= */}
        {/* TITLE */}
        {/* ================================= */}

        <motion.img
          src={titleIntro}
          alt="Purpose of Pragati Setu"
          className="purpose-piece purpose-main-title"
          initial={{
            opacity: 0,
            y: -40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={viewport}
          transition={{
            duration: 0.8,
            delay: 0.1,
          }}
        />


        {/* ================================= */}
        {/* CENTER HUB */}
        {/* ================================= */}

        <motion.img
          src={centerHub}
          alt="Pragati Setu"
          className="purpose-piece purpose-center"
          initial={{
            opacity: 0,
            scale: 0.6,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={viewport}
          transition={{
            duration: 0.9,
            delay: 0.35,
            type: "spring",
            stiffness: 80,
          }}
          whileHover={{
            scale: 1.025,
          }}
        />


        {/* ================================= */}
        {/* 01 BENEFICIARY */}
        {/* ================================= */}

        <motion.img
          src={beneficiary}
          alt="Beneficiary Management"
          className="purpose-piece purpose-beneficiary"
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={viewport}
          transition={{
            duration: 0.8,
            delay: 0.65,
          }}
          whileHover={{
            scale: 1.035,
          }}
        />


        {/* ================================= */}
        {/* 05 GOVERNMENT */}
        {/* ================================= */}

        <motion.img
          src={government}
          alt="Government Support Tracking"
          className="purpose-piece purpose-government"
          initial={{
            opacity: 0,
            x: 100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={viewport}
          transition={{
            duration: 0.8,
            delay: 0.75,
          }}
          whileHover={{
            scale: 1.035,
          }}
        />


        {/* ================================= */}
        {/* 02 ENTERPRISE */}
        {/* ================================= */}

        <motion.img
          src={enterprise}
          alt="Enterprise Tracking"
          className="purpose-piece purpose-enterprise"
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={viewport}
          transition={{
            duration: 0.8,
            delay: 0.9,
          }}
          whileHover={{
            scale: 1.035,
          }}
        />


        {/* ================================= */}
        {/* 04 LAKHPATI DIDI */}
        {/* ================================= */}

        <motion.img
          src={lakhpati}
          alt="Lakhpati Didi Conversion"
          className="purpose-piece purpose-lakhpati"
          initial={{
            opacity: 0,
            x: 100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={viewport}
          transition={{
            duration: 0.8,
            delay: 1,
          }}
          whileHover={{
            scale: 1.035,
          }}
        />


        {/* ================================= */}
        {/* 03 TRAINING */}
        {/* ================================= */}

        <motion.img
          src={training}
          alt="Training and Capacity Building"
          className="purpose-piece purpose-training"
          initial={{
            opacity: 0,
            y: 70,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={viewport}
          transition={{
            duration: 0.8,
            delay: 1.15,
          }}
          whileHover={{
            scale: 1.035,
          }}
        />
   </motion.div>



      {/* ================================= */}
      {/* MOBILE */}
      {/* ================================= */}

      <motion.div
        className="purpose-mobile"
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.8,
        }}
      >

        <img
          src={mobilePurpose}
          alt="Purpose of Pragati Setu"
        />

      </motion.div>



      <style>{`

      .purpose-graphic-wrapper {
  width: 100%;
  max-width: none;
  margin: 0;
  min-width: 0;
}


        /* =============================== */
        /* CANVAS */
        /* =============================== */

        .purpose-stage {

          position: relative;

          width: 100%;

          aspect-ratio: 1448 / 1086;

          overflow: hidden;
        }


        .purpose-piece {

          position: absolute;

          display: block;

          height: auto;

          max-width: none;

          object-fit: contain;

          user-select: none;

          -webkit-user-drag: none;
        }



        /* =============================== */
        /* LANDSCAPE */
        /* =============================== */

        .purpose-landscape {

          left: 0%;

          top: 61.23%;

          width: 100%;

          z-index: 1;
        }



        /* =============================== */
        /* TITLE */
        /* =============================== */

        .purpose-main-title {

          left: 15.19%;

          top: 3.22%;

          width: 71.48%;

          z-index: 10;
        }



        /* =============================== */
        /* CENTER */
        /* =============================== */

        .purpose-center {

          left: 32.46%;

          top: 21.64%;

          width: 35.22%;

          z-index: 20;

          transform-origin: center;
        }



        /* =============================== */
        /* 01 */
        /* =============================== */

        .purpose-beneficiary {

          left: 3.8%;

          top: 22.56%;

          width: 36.6%;

          z-index: 30;

          cursor: pointer;

          transform-origin: center;
        }



        /* =============================== */
        /* 05 */
        /* =============================== */

        .purpose-government {

          left: 60.43%;

          top: 22.56%;

          width: 36.95%;

          z-index: 30;

          cursor: pointer;

          transform-origin: center;
        }



        /* =============================== */
        /* 02 */
        /* =============================== */

        .purpose-enterprise {

          left: 3.8%;

          top: 44.66%;

          width: 36.6%;

          z-index: 30;

          cursor: pointer;

          transform-origin: center;
        }



        /* =============================== */
        /* 04 */
        /* =============================== */

        .purpose-lakhpati {

          left: 62.16%;

          top: 44.66%;

          width: 37.29%;

          z-index: 30;

          cursor: pointer;

          transform-origin: center;
        }



        /* =============================== */
        /* 03 */
        /* =============================== */

        .purpose-training {

          left: 35.91%;

          top: 61.69%;

          width: 28.32%;

          z-index: 40;

          cursor: pointer;

          transform-origin: center;
        }



        /* =============================== */
        /* HINDI */
        /* =============================== */

        .purpose-hindi {

          left: 71.82%;

          top: 64.92%;

          width: 24.52%;

          z-index: 40;
        }



        /* =============================== */
        /* MOBILE */
        /* =============================== */

        .purpose-mobile {

          display: none;

          width: 100%;
        }


        .purpose-mobile img {

          display: block;

          width: 100%;

          max-width: 450px;

          height: auto;

          margin: 0 auto;
        }



        @media (max-width: 900px) {

          .purpose-stage {
            display: none;
          }


          .purpose-mobile {
            display: block;
          }

        }


        @media (max-width: 600px) {

          .purpose-mobile img {
            max-width: 360px;
          }

        }


        @media (max-width: 400px) {

          .purpose-mobile img {
            max-width: 310px;
          }

        }

      `}</style>

    </div>

  );

}