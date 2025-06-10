import React from 'react';
import styles from './ShinyText.module.scss';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
    fontSize?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '', fontSize}) => {
    const animationDuration = `${speed}s`;
    const font = `${fontSize}px`;

    return (
        <div
            className={`${styles['shiny-text']} ${disabled ? styles.disabled : ''} ${className}`}
            style={{ animationDuration, fontSize: font }}
        >
            {text}
        </div>
    );
};
