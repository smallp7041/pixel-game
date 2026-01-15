import React from 'react';

const PixelButton = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
    const baseColor = variant === 'primary' ? 'var(--pixel-primary)' : 'var(--pixel-secondary)';

    const styles = {
        position: 'relative',
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: baseColor,
        color: '#2d1b2e',
        fontFamily: 'var(--font-pixel)',
        fontSize: '1rem',
        border: 'none',
        boxShadow: `
      inset -4px -4px 0px 0px rgba(0,0,0,0.5),
      inset 4px 4px 0px 0px rgba(255,255,255,0.5),
      4px 4px 0px 0px rgba(0,0,0,0.8)
    `,
        imageRendering: 'pixelated',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transform: 'translate(0, 0)',
        transition: 'transform 0.1s, box-shadow 0.1s',
    };

    const handleMouseDown = (e) => {
        if (!disabled) {
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = `
            inset -2px -2px 0px 0px rgba(0,0,0,0.5),
            inset 2px 2px 0px 0px rgba(255,255,255,0.5),
            2px 2px 0px 0px rgba(0,0,0,0.8)
        `;
        }
    };

    const handleMouseUp = (e) => {
        if (!disabled) {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = `
            inset -4px -4px 0px 0px rgba(0,0,0,0.5),
            inset 4px 4px 0px 0px rgba(255,255,255,0.5),
            4px 4px 0px 0px rgba(0,0,0,0.8)
        `;
        }
    };

    return (
        <button
            style={styles}
            onClick={onClick}
            disabled={disabled}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={className}
        >
            {children}
        </button>
    );
};

export default PixelButton;
