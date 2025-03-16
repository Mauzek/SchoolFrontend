import React from 'react';
import styles from './ShinyText.module.scss';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
    fontSizes?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' , fontSizes = 4}) => {
    const animationDuration = `${speed}s`;
    const fontSize = `${fontSizes}em`;

    return (
        <div
            className={`${styles['shiny-text']} ${disabled ? styles.disabled : ''} ${className}`}
            style={{ animationDuration , fontSize }}
        >
            {text}
        </div>
    );
};
