import React, { useState, useEffect } from 'react';
// import CanteenForm from './CanteenForm';
import PrernaCanteenTabs from "./PrernaCanteenTabs";

// Local asset paths
import prernaCanteenImgOne from '../../assets/prernaCanteenImgOne.jpeg';
import prernaCanteenImgTwo from '../../assets/prernaCanteenImgTwo.jpeg';
import prernaCanteenImgThree from '../../assets/prernaCanteenImgThree.jpeg';

const CAROUSEL_IMAGES = [
    prernaCanteenImgOne,
    prernaCanteenImgTwo,
    prernaCanteenImgThree
];

const PrernaCanteenWrapper = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSlidedUp, setIsSlidedUp] = useState(false);

    // Auto-play Carousel Effect
    useEffect(() => {
        if (isSlidedUp) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_IMAGES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isSlidedUp]);

    // Custom Inline Style Blocks
    const styles = {
        container: {
            position: 'relative',
            width: '100%',
            height: '100vh',
            backgroundColor: '#f9fafb',
            overflow: 'hidden',
            fontFamily: 'sans-serif'
        },
        carouselWrapper: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 20,
            transition: 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out',
            transform: isSlidedUp ? 'translateY(-100%)' : 'translateY(0)',
            opacity: isSlidedUp ? 0 : 1,
            pointerEvents: isSlidedUp ? 'none' : 'auto',
            padding: '16px',
            boxSizing: 'border-box'
        },
        carouselContainer: {
            position: 'relative',
            width: '100%',
            flexGrow: 1,
            backgroundColor: '#171717',
            overflow: 'hidden',
            borderRadius: '24px'
        },
        image: (isActive) => ({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '24px',
            transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'scale(1)' : 'scale(1.05)'
        }),
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 16px',
            borderRadius: '24px'
        },
        heading: {
            color: '#ffffff',
            fontSize: '3rem',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            margin: 0,
            textShadow: '0 4px 6px rgba(0,0,0,0.3)'
        },
        subheading: {
            color: '#ffffff',
            fontSize: '1.5rem',
            fontWeight: '300',
            letterSpacing: '0.1em',
            marginTop: '8px',
            textTransform: 'uppercase',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        },
        buttonSection: {
            width: '100%',
            backgroundColor: '#ffffff',
            padding: '20px 0 10px 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 -8px 30px rgba(0,0,0,0.02)'
        },
        triggerButton: {
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            padding: '16px 48px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.3)',
            transition: 'background-color 0.2s, transform 0.2s',
            marginBottom: '12px'
        },
        arrowContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            height: '32px'
        },
        arrow: {
            width: '14px',
            height: '14px',
            borderRight: '3.5px solid #dc2626',
            borderBottom: '3.5px solid #dc2626',
            transform: 'rotate(45deg)',
            margin: '-3px 0',
            borderRadius: '2px',
            borderBottomRightRadius: '3.5px',
            lineJoin: 'round',
            lineCap: 'round'
        },
        formWrapper: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            padding: '32px 16px',
            zIndex: 10,
            boxSizing: 'border-box',
            transition: 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out',
            transform: isSlidedUp ? 'translateY(0)' : 'translateY(100%)',
            opacity: isSlidedUp ? 1 : 0,
            pointerEvents: isSlidedUp ? 'auto' : 'none'
        },
        formContent: {
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            position: 'relative'
        },
        formCard: {
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
            padding: '24px',
            border: '1px solid #f3f4f6',
            width: '100%',
            boxSizing: 'border-box'
        }
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes arrowGlowFade {
                    0% { opacity: 0.25; filter: drop-shadow(0 0 0px transparent); }
                    50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.8)); }
                    100% { opacity: 0.25; filter: drop-shadow(0 0 0px transparent); }
                }
                .glow-arrow-1 {
                    animation: arrowGlowFade 1.6s infinite ease-in-out;
                }
                .glow-arrow-2 {
                    animation: arrowGlowFade 1.6s infinite ease-in-out;
                    animation-delay: 0.4s;
                }
            `}</style>

            {/* CAROUSEL & BUTTON WRAPPER */}
            <div style={styles.carouselWrapper}>
                <div style={styles.carouselContainer}>
                    {CAROUSEL_IMAGES.map((imgUrl, index) => (
                        <img
                            key={index}
                            src={imgUrl}
                            alt={`Prerna Cafe Slide ${index + 1}`}
                            style={styles.image(index === currentImageIndex)}
                        />
                    ))}
                    <div style={styles.overlay}>
                        <h1 style={styles.heading}>प्रेरणा कैफ़े</h1>
                        <p style={styles.subheading}>Swad Ka Safar</p>
                    </div>
                </div>

                <div style={styles.buttonSection}>
                    <button
                        onClick={() => setIsSlidedUp(true)}
                        style={styles.triggerButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Prerna Canteen
                    </button>

                    <div
                        style={styles.arrowContainer}
                        onClick={() => setIsSlidedUp(true)}
                    >
                        <div className="glow-arrow-1" style={styles.arrow}></div>
                        <div className="glow-arrow-2" style={styles.arrow}></div>
                    </div>
                </div>
            </div>

            {/* YOUR CUSTOM FORM CONTAINER */}
            <div style={styles.formWrapper}>
                <div style={styles.formContent}>
                    <div style={styles.formCard}>
                        {/* यहाँ से onBackClick फ़ंक्शन प्रॉप की तरह फॉर्म को पास किया गया है */}
                        {/* <CanteenForm onBackClick={() => setIsSlidedUp(false)} /> */}
                        <PrernaCanteenTabs onBackClick={() => setIsSlidedUp(false)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrernaCanteenWrapper;