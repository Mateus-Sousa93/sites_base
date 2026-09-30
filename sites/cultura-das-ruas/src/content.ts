export const brand = {
  name: 'Cultura das Ruas',
  url: 'https://ruas.estudioconceito.com',
  contact: 'https://wa.me/5534992011427?text=Ol%C3%A1%2C%20Est%C3%BAdio%20Conceito!%20Vi%20a%20loja%20demonstrativa%20Cultura%20das%20Ruas%20e%20quero%20conversar%20sobre%20um%20site%20para%20minha%20marca.',
};

export type Category = 'Sneakers' | 'Roupas';
export type Product = {
  id: string;
  name: string;
  kind: string;
  category: Category;
  price: number;
  quadrant: 'one' | 'two' | 'three' | 'four';
  sizes: string[];
  tag?: string;
};

export const products: Product[] = [
  { id: 'vertice', name: 'Vértice 01', kind: 'Sneaker', category: 'Sneakers', price: 699.9, quadrant: 'one', sizes: ['38', '39', '40', '41', '42'], tag: 'Novo' },
  { id: 'urbano', name: 'Urbano 02', kind: 'Sneaker', category: 'Sneakers', price: 649.9, quadrant: 'two', sizes: ['38', '39', '40', '41', '42'], tag: 'Drop 01' },
  { id: 'essencial', name: 'Essencial', kind: 'Moletom oversized', category: 'Roupas', price: 349.9, quadrant: 'three', sizes: ['P', 'M', 'G', 'GG'] },
  { id: 'concreto', name: 'Concreto', kind: 'Camiseta oversized', category: 'Roupas', price: 179.9, quadrant: 'four', sizes: ['P', 'M', 'G', 'GG'] },
];

export const money = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
