import React from 'react';

const PixelCard = ({ children, title, className = '' }) => {
    const styles = {
        backgroundColor: '#3e3546', // Darker background for card
        border: '4px solid var(--pixel-border)',
        boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.5)',
        padding: '24px',
        color: 'var(--pixel-text)',
        position: 'relative',
        maxWidth: '600px',
        width: '100%',
        margin: '20px auto', // Center horizontally
    };

    const titleStyles = {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.2rem',
        textShadow: '2px 2px #000',
        borderBottom: '2px dashed var(--pixel-primary)',
        paddingBottom: '10px'
    };

    return (
        <div style={styles} className={className}>
            {title && <h2 style={titleStyles}>{title}</h2>}
            {children}
        </div>
    );
};

export default PixelCard;
