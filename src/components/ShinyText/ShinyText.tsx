import React from 'react';
import styles from './ShinyText.module.scss';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`${styles['shiny-text']} ${disabled ? styles.disabled : ''} ${className}`}
            style={{ animationDuration }}
        >
            {text}
        </div>
    );
};
