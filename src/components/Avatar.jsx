import React, { useMemo } from 'react';

const Avatar = ({ seed, size = 100 }) => {
    // Using 'pixel-art' style from DiceBear
    const avatarUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
    }, [seed]);

    const styles = {
        width: `${size}px`,
        height: `${size}px`,
        border: '4px solid #fff',
        backgroundColor: '#f0f0f0', // Light bg to make pixel art pop
        imageRendering: 'pixelated',
        boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)',
        margin: '0 auto',
        display: 'block'
    };

    return (
        <img
            src={avatarUrl}
            alt={`Avatar for ${seed}`}
            style={styles}
        />
    );
};

export default Avatar;
