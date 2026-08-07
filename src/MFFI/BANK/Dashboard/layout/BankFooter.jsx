import React, { useState } from 'react';

const BankFooter = () => {
    return (
        <footer
            style={{
                 padding: '14px 24px',
                background: 'rgba(255, 255, 255, 0.32)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#0f172a',
                borderTop: '1px solid rgba(255, 255, 255, 0.6)',
                textAlign: 'center',
                fontSize: '14px',
                boxSizing: 'border-box',
                boxShadow: '0 -2px 16px rgba(15, 23, 42, 0.08)',
            }}
        >
            © 2026 MFFI Dashboard · All rights reserved
        </footer>
    );
};

export default BankFooter;
