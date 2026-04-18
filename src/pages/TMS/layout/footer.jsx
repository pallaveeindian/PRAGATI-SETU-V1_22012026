import React from "react";

const Footer = ({ text = " Welcome to TMS Portal | Latest Updates Here " }) => {
    return (
        <footer className="footer">
            <div className="marquee">
                <div className="marquee-content">
                    {text}
                </div>
            </div>

            <style>
                {`
                .footer {
  background-color: #496d9c;
  color: white;
  padding: 8px 0;
  font-size: 16px;
  margin: 0;        /*  remove extra space */
  line-height: 1.2; /*  reduce height */
}
                .marquee {
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                }
                .marquee-content {
                    display: inline-block;
                    white-space: nowrap;
                    padding-left: 100%;
                    animation: scrollText 15s linear infinite;
                    font-weight: 500;
                }
                @keyframes scrollText {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                `}
            </style>
        </footer>
    );
};

export default Footer;