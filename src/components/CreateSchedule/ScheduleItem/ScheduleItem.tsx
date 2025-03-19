import { Button, Card } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CreateScheduleItem as ScheduleItemType } from "../../../types";
import styles from "./ScheduleItem.module.scss";

interface ScheduleItemProps {
  item: ScheduleItemType;
  onRemove: () => void;
}

export const ScheduleItemComponent = ({
  item,
  onRemove,
}: ScheduleItemProps) => {
  return (
    <Card
      className={styles.scheduleItem}
      extra={
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onRemove}
          className={styles.scheduleItem__removeButton}
        />
      }
    >
      <div className={styles.scheduleItem__time}>
        {item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}
      </div>
      <div className={styles.scheduleItem__details}>
        <div>
          <strong>Предмет:</strong> {item.subjectName}
        </div>
        <div>
          <strong>Преподаватель:</strong> {item.teacherName}
        </div>
        <div>
          <strong>Кабинет:</strong> {item.roomNumber}
        </div>
      </div>
    </Card>
  );
};
