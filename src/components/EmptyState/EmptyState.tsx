import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ message, icon }: EmptyStateProps) => {
  return (
    <div className={styles.emptyState}>
      {icon || (
        <div className={styles.emptyState__icon}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32 22V32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32 42H32.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      <p className={styles.emptyState__message}>{message}</p>
    </div>
  );
};
