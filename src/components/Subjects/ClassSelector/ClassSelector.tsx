import React, { useState } from "react";
import { TeamOutlined, DownOutlined } from "@ant-design/icons";
import { ApiAllClassesResponse } from "../../../types";
import styles from "./ClassSelector.module.scss";

interface ClassSelectorProps {
  classes: ApiAllClassesResponse["classes"];
  selectedClass: number | null;
  selectedClassName: string;
  onClassSelect: (classId: number) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = React.memo(
  ({ classes, selectedClass, selectedClassName, onClassSelect }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <div className={styles.classSelector}>
        <div
          className={styles.classSelector__toggle}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <TeamOutlined />
          <span>
            {selectedClassName
              ? `Класс: ${selectedClassName}`
              : "Выбрать класс"}
          </span>
          <DownOutlined className={styles.classSelector__dropdownIcon} />
        </div>

        {showDropdown && (
          <div className={styles.classSelector__dropdown}>
            {classes.map((classItem) => (
              <div
                key={classItem.idClass}
                className={`${styles.classSelector__option} ${
                  selectedClass === classItem.idClass
                    ? styles.classSelector__optionActive
                    : ""
                }`}
                onClick={() => {
                  onClassSelect(classItem.idClass);
                  setShowDropdown(false);
                }}
              >
                {classItem.classNumber}
                {classItem.classLetter}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
