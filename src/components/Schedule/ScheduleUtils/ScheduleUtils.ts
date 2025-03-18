// Function to get week dates based on offset
export const getWeekDates = (
    offset: number = 0
  ): { startDate: string; endDate: string } => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
    // Calculate the date of Monday (first day of the week)
    const monday = new Date(now);
    // If today is Sunday (0), we need to go back 6 days to get to Monday
    // Otherwise, we go back (dayOfWeek - 1) days
    monday.setDate(
      now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7
    );
  
    // Calculate the date of Saturday (last day of the week)
    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5); // 5 days after Monday is Saturday
  
    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date): string => {
      return date.toISOString().split("T")[0];
    };
  
    return {
      startDate: formatDate(monday),
      endDate: formatDate(saturday),
    };
  };
  
  // Generate an array of dates for the week (Monday to Saturday)
  export const generateWeekDates = (startDate: string): string[] => {
    const dates: string[] = [];
    const start = new Date(startDate);
  
    for (let i = 0; i < 6; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
  
    return dates;
  };
  
  // Function to get day name in Russian
  export const getDayName = (date: string): string => {
    const days = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };
  
  // Function to format time (e.g., "08:00:00" -> "08:00")
  export const formatTime = (time: string): string => {
    return time.substring(0, 5);
  };
  
  // Function to get week date range for display
  export const getWeekDateRange = (weekDates: string[]): string => {
    if (weekDates.length === 0) return "";
  
    const startDate = new Date(weekDates[0]);
    const endDate = new Date(weekDates[weekDates.length - 1]);
  
    const formatDateForDisplay = (date: Date): string => {
      return date.toLocaleDateString("ru-RU");
    };
  
    return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(
      endDate
    )}`;
  };
  