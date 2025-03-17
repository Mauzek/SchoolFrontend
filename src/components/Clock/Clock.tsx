import React, { useEffect, useState } from "react";
import styles from "./Clock.module.scss";

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Вычисляем углы для стрелок часов
  const secondsRatio = time.getSeconds() / 60;
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + time.getHours()) / 12;

  // Преобразуем соотношения в градусы (360 градусов = полный круг)
  const secondsDegrees = secondsRatio * 360;
  const minutesDegrees = minutesRatio * 360;
  const hoursDegrees = hoursRatio * 360;

  return (
    <div className={styles.clockContainer}>
      <div className={styles.clock}>
        <div className={styles.clockFace}>
          {/* Маркеры часов */}
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className={styles.hourMarker}
              style={{ transform: `rotate(${index * 30}deg)` }}
            >
              <div className={styles.hourDot}></div>
            </div>
          ))}

          {/* Маркеры минут */}
          {[...Array(60)].map(
            (_, index) =>
              index % 5 !== 0 && (
                <div
                  key={`min-${index}`}
                  className={styles.minuteMarker}
                  style={{ transform: `rotate(${index * 6}deg)` }}
                >
                  <div className={styles.minuteDot}></div>
                </div>
              )
          )}

          {/* Цифры часов */}
          {[...Array(12)].map((_, index) => {
            const hour = index === 0 ? 12 : index;
            const angle = index * 30;
            const radians = (angle - 90) * (Math.PI / 180);
            const radius = 75; // Расстояние от центра до цифр

            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;

            return (
              <div
                key={`num-${index}`}
                className={styles.hourNumber}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                {hour}
              </div>
            );
          })}

          {/* Маркеры четвертей часа */}
          {[0, 90, 180, 270].map((angle, index) => (
            <div
              key={`quarter-${index}`}
              className={styles.quarterMarker}
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className={styles.quarterDot}></div>
            </div>
          ))}

          {/* Стрелки часов */}
          <div
            className={styles.hourHand}
            style={{ transform: `rotate(${hoursDegrees}deg)` }}
          ></div>
          <div
            className={styles.minuteHand}
            style={{ transform: `rotate(${minutesDegrees}deg)` }}
          ></div>
          <div
            className={styles.secondHand}
            style={{ transform: `rotate(${secondsDegrees}deg)` }}
          ></div>

          {/* Центральная точка */}
          <div className={styles.centerPoint}></div>
        </div>

        {/* Текущее время в цифровом формате */}
        <div className={styles.digitalTime}>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
};
