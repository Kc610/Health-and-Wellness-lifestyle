
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
  price: string;
  sku: string;
  image: string;
  category: string;
  description: string;
}

export interface UserProfile {
  age: string;
  weight: string;
  height: string;
  activityLevel: 'low' | 'moderate' | 'high' | 'elite';
  goals: string;
}
