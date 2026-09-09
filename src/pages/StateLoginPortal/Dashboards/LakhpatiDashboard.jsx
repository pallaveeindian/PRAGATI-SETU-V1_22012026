// src/pages/StateLoginPortal/Dashboards/LakhpatiDashboard.jsx

import React from "react";

const LakhpatiDashboard = () => {
  return (
    <>
      <div className="under-development-page">
        <div className="floating-bg">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="development-card">
          <div className="gear-wrapper">
            <div className="gear gear-large">⚙</div>

            <div className="gear gear-small gear-one">⚙</div>

            <div className="gear gear-small gear-two">⚙</div>

            <div className="pulse-ring"></div>
          </div>

          <h1>Module Under Development</h1>

          <div className="divider"></div>

          <p>
            We are working hard to build this module with the best experience.
            <br />
            It will be available very soon.
          </p>

          <div className="loader-row">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="status-badge">🚀 Coming Soon</div>
        </div>
      </div>

      <style>{`

      *{
          box-sizing:border-box;
      }

      .under-development-page{
          min-height:100vh;
          width:100%;
          display:flex;
          justify-content:center;
          align-items:center;
          background:
          radial-gradient(circle at top,#ffebee 0%,#fff5f5 40%,#ffffff 100%);
          overflow:hidden;
          position:relative;
          padding:40px;
      }

      /* Floating background particles */

      .floating-bg span{
          position:absolute;
          width:12px;
          height:12px;
          border-radius:50%;
          background:#ff4d4f;
          opacity:.15;
          animation:float 10s linear infinite;
      }

      .floating-bg span:nth-child(1){
          left:8%;
          animation-duration:9s;
      }

      .floating-bg span:nth-child(2){
          left:24%;
          width:18px;
          height:18px;
          animation-duration:13s;
      }

      .floating-bg span:nth-child(3){
          left:50%;
          animation-duration:8s;
      }

      .floating-bg span:nth-child(4){
          left:76%;
          width:20px;
          height:20px;
          animation-duration:12s;
      }

      .floating-bg span:nth-child(5){
          left:92%;
          animation-duration:10s;
      }

      @keyframes float{

          0%{
              transform:translateY(100vh) scale(.5);
              opacity:0;
          }

          30%{
              opacity:.25;
          }

          100%{
              transform:translateY(-120px) scale(1.2);
              opacity:0;
          }

      }

      .development-card{

          position:relative;

          width:min(700px,100%);

          background:white;

          border-radius:26px;

          padding:60px 50px;

          text-align:center;

          box-shadow:
          0 25px 60px rgba(214,40,40,.15);

          border:2px solid #ffd6d6;

      }

      .development-card::before{

          content:"";

          position:absolute;

          inset:0;

          border-radius:26px;

          padding:2px;

          background:linear-gradient(
          135deg,
          #ff5b5b,
          #d62828,
          #ff7a7a);

          -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);

          -webkit-mask-composite:xor;

          pointer-events:none;

      }

      .gear-wrapper{

          position:relative;

          width:220px;

          height:220px;

          margin:auto;

      }

      .pulse-ring{

          position:absolute;

          width:180px;

          height:180px;

          left:20px;

          top:20px;

          border-radius:50%;

          border:4px solid rgba(214,40,40,.15);

          animation:pulse 2.4s infinite;

      }

      @keyframes pulse{

          0%{
              transform:scale(.85);
              opacity:1;
          }

          100%{
              transform:scale(1.25);
              opacity:0;
          }

      }

      .gear{

          position:absolute;

          color:#d62828;

          user-select:none;

          filter:drop-shadow(0 10px 15px rgba(214,40,40,.25));

      }

      .gear-large{

          font-size:110px;

          left:50%;

          top:50%;

          transform:translate(-50%,-50%);

          animation:rotateCW 8s linear infinite;

      }

      .gear-one{

          font-size:62px;

          left:10px;

          bottom:25px;

          animation:rotateCCW 5s linear infinite;

      }

      .gear-two{

          font-size:55px;

          right:18px;

          top:18px;

          animation:rotateCCW 4s linear infinite;

      }

      @keyframes rotateCW{

          from{
              transform:translate(-50%,-50%) rotate(0deg);
          }

          to{
              transform:translate(-50%,-50%) rotate(360deg);
          }

      }

      @keyframes rotateCCW{

          from{
              transform:rotate(360deg);
          }

          to{
              transform:rotate(0deg);
          }

      }

      h1{

          margin-top:25px;

          color:#b71c1c;

          font-size:38px;

          font-weight:800;

          letter-spacing:.5px;

      }

      .divider{

          width:90px;

          height:5px;

          border-radius:30px;

          margin:18px auto 25px;

          background:linear-gradient(
          90deg,
          #ff4d4f,
          #d62828);

      }

      p{

          color:#666;

          font-size:18px;

          line-height:1.8;

      }

      .loader-row{

          margin-top:35px;

          display:flex;

          justify-content:center;

          gap:12px;

      }

      .loader-row span{

          width:12px;

          height:12px;

          border-radius:50%;

          background:#d62828;

          animation:bounce 1.3s infinite;

      }

      .loader-row span:nth-child(2){
          animation-delay:.2s;
      }

      .loader-row span:nth-child(3){
          animation-delay:.4s;
      }

      @keyframes bounce{

          0%,80%,100%{
              transform:scale(1);
              opacity:.4;
          }

          40%{
              transform:scale(1.8);
              opacity:1;
          }

      }

      .status-badge{

          margin:35px auto 0;

          display:inline-block;

          padding:12px 24px;

          border-radius:50px;

          background:#d62828;

          color:white;

          font-weight:700;

          letter-spacing:.5px;

          box-shadow:
          0 12px 25px rgba(214,40,40,.35);

      }

      @media(max-width:768px){

          .development-card{
              padding:40px 25px;
          }

          h1{
              font-size:28px;
          }

          p{
              font-size:16px;
          }

          .gear-wrapper{
              width:170px;
              height:170px;
          }

          .gear-large{
              font-size:85px;
          }

          .gear-one{
              font-size:48px;
          }

          .gear-two{
              font-size:42px;
          }

          .pulse-ring{
              width:140px;
              height:140px;
              left:15px;
              top:15px;
          }

      }

      `}</style>
    </>
  );
};

export default LakhpatiDashboard;
