
export interface OptimizationLog {
  id: string;
  nodeType: string;
  category: string;
  metric: string;
  value: string;
  user: string;
  location: string;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Product {
  handle: string;
  title: string;
  price: number;
  sku: string;
  image: string; // Primary image for product card
  images: string[]; // All images for the product
  category: string;
  description: string; // Short plain text description
  longDescriptionHtml: string; // Full HTML description from CSV
  tags: string[]; // Extracted from HTML badges
  rating: number; // Randomly generated
  reviews: number; // Randomly generated
  vendor: string;
}

export interface UserProfile {
  age: string;
  weight: string;
  height: string;
  activityLevel: 'low' | 'moderate' | 'high' | 'elite';
  goals: string;
}
