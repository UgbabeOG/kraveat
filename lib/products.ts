export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  available: boolean;
  featured?: boolean;
  popular?: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Burger',
    category: 'Burger',
    price: 4500,
    image: '/assets/imagewithlogo2.jpeg',
    description: 'Beef burger with lettuce, tomato, cheese and sauce.',
    available: true,
    featured: true,
    popular: true,
  },
  {
    id: 2,
    name: 'Chicken Shawarma',
    category: 'Shawarma',
    price: 3500,
    image: '/assets/imagewithlogo3.jpeg',
    description: 'Spiced chicken wrapped in soft pita with fresh toppings.',
    available: true,
    featured: true,
    popular: true,
  },
  {
    id: 3,
    name: 'Loaded Fries',
    category: 'Loaded Fries',
    price: 2800,
    image: '/assets/imagewithlogo4.jpeg',
    description: 'Golden fries topped with cheese, sauce and herbs.',
    available: true,
    featured: true,
    popular: true,
  },
  {
    id: 4,
    name: 'Chicken & Chips',
    category: 'Chicken & Chips',
    price: 4200,
    image: '/assets/imagewithlogo5.jpeg',
    description: 'Crispy chicken served with fries and dip.',
    available: true,
    featured: true,
    popular: true,
  },
];

export const categories = Array.from(
  new Set(products.map((product) => product.category)),
);

export const KRAVEAT_WHATSAPP_NUMBER = '2349030707047';
