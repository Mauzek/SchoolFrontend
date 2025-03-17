// <-------Header.tsx------->
// Определение типа для навигационных ссылок 
export interface NavLink {
    to: string;
    icon: React.ReactNode;
    text: string;
  }
// <-------NewsSection.tsx------->
// Определение типа для новостей
export interface NewsItem {
    id: number;
    title: string;
    content: string;
    date: string;
    image?: string;
    category: string;
  }

// <-------ProfileHeader.tsx------->
// Определение типа для свойств компонента ProfileHeader
export interface ProfileHeaderProps {
    photo: string | null;
    name: string;
    details: React.ReactNode[];
    photoAlt: string;
  }
