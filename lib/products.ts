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
    price: 5000,
    image: '/assets/burger.jpeg',
    description: 'Beef burger with lettuce, tomato, cheese and sauce.',
    available: true,
    featured: true,
    popular: true,
  },
  {
    id: 2,
    name: 'Chicken Shawarma',
    category: 'Shawarma',
    price: 5000,
    image: '/assets/shawarma.jpeg',
    description: 'Spiced chicken wrapped in soft pita with fresh toppings.',
    available: true,
    featured: true,
    popular: true,
  },
  {
    id: 3,
    name: 'Loaded Fries',
    category: 'Loaded Fries',
    price: 5000,
    image: '/assets/Loaded_fries.jpg',
    description: 'Golden fries topped with cheese, sauce and herbs.',
    available: true,
    featured: true,
    popular: true,
  },
  {
    id: 4,
    name: 'Chicken & Chips',
    category: 'Chicken & Chips',
    price: 5000,
    image: '/assets/chips&chicken.jpeg',
    description: 'Crispy chicken served with fries and dip.',
    available: true,
    featured: true,
    popular: true,
  },
  {
    id: 5,
    name: 'Cheese Steaks',
    category: 'Cheese Steaks',
    price: 5000,
    image: '/assets/burger.jpeg',
    description: 'Tender cheese steaks with grilled onions and peppers.',
    available: true,
    featured: true,
    popular: true,
  },
  {
    id: 6,
    name: 'Noodles',
    category: 'Noodles',
    price: 3000,
    image: '/assets/noodles.jpeg',
    description: 'Delicious stir-fried noodles with vegetables and sauce.',
    available: true,
    featured: false,
    popular: false,
  },
  {
    id: 7,
    name: 'Pizza',
    category: 'Pizza',
    price: 10000,
    image: '/assets/pizza.jpeg',
    description: 'Cheesy pizza with fresh toppings and crispy crust.',
    available: true,
    featured: false,
    popular: false,
  },
];

export const categories = Array.from(
  new Set(products.map((product) => product.category)),
);

export const KRAVEAT_WHATSAPP_NUMBER = '2349030707047';
