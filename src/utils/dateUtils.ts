export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Не указано';
  
  const date = new Date(dateString);
  
  // Проверяем, является ли дата валидной
  if (isNaN(date.getTime())) {
    return 'Некорректная дата';
  }
  
  // Форматируем дату в формат "ДД.ММ.ГГГГ"
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
};

export const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return 'Не указано';
  
  const date = new Date(dateTimeString);
  
  // Проверяем, является ли дата валидной
  if (isNaN(date.getTime())) {
    return 'Некорректная дата';
  }
  
  // Форматируем дату и время в формат "ДД.ММ.ГГГГ ЧЧ:ММ"
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
