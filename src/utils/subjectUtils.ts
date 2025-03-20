import { ApiAssignment } from "../types";

/**
 * Returns a color based on the subject ID
 */
export const getSubjectColor = (subjectId: number): string => {
  const colors = [
    "var(--color-primary)",
    "#FFC107",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
    "#3f51b5",
    "#e91e63",
    "#009688",
  ];
  return colors[subjectId % colors.length];
};

/**
 * Returns an emoji icon based on the subject name
 */
export const getSubjectIcon = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("math") || lowerName.includes("матем")) {
    return "📊";
  } else if (lowerName.includes("history") || lowerName.includes("истор")) {
    return "🏛️";
  } else if (lowerName.includes("physics") || lowerName.includes("физик")) {
    return "⚛️";
  } else if (lowerName.includes("chemistry") || lowerName.includes("хими")) {
    return "🧪";
  } else if (lowerName.includes("biology") || lowerName.includes("биолог")) {
    return "🧬";
  } else if (
    lowerName.includes("literature") ||
    lowerName.includes("литерат")
  ) {
    return "📚";
  } else if (lowerName.includes("geography") || lowerName.includes("географ")) {
    return "🌍";
  }
  return "📖";
};

/**
 * Checks if an assignment is a test
 */
export const isTestAssignment = (assignment: ApiAssignment): boolean => {
  return !!assignment.testing;
};
