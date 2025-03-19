import { Button } from "antd";
import { TimeSlot } from "../../../types";
import styles from "./TimeSlotSelector.module.scss";

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedSlot: number;
  onSelectSlot: (index: number) => void;
}

export const TimeSlotSelector = ({
  timeSlots,
  selectedSlot,
  onSelectSlot,
}: TimeSlotSelectorProps) => {
  return (
    <div className={styles.timeSlotSelector}>
      <div className={styles.timeSlotSelector__label}>
        Выберите время занятия:
      </div>
      <div className={styles.timeSlotSelector__buttons}>
        {timeSlots.map((slot, index) => (
          <Button
            key={index}
            type={selectedSlot === index ? "primary" : "default"}
            onClick={() => onSelectSlot(index)}
            className={styles.timeSlotSelector__button}
          >
            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
          </Button>
        ))}
      </div>
    </div>
  );
};
