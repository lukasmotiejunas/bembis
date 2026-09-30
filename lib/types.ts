export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specs: {
    length?: string;
    lightColor?: string;
    numLEDs?: number;
    powerType?: string;
    indoorOutdoor?: string;
    ipRating?: string;
    cableLength?: string;
  };
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DecorStyle =
  | "classic-warm"
  | "winter-white"
  | "golden-luxury"
  | "colorful"
  | "minimal-scandinavian"
  | "surprise-me";

export type LightColor =
  | "warm-white"
  | "pure-white"
  | "golden"
  | "multicolor"
  | "red-white";

export type DecorationLevel = "minimal" | "classic" | "full" | "spectacular";

export type DecorationArea =
  | "roofline"
  | "windows"
  | "entrance"
  | "trees"
  | "bushes"
  | "fence"
  | "balcony"
  | "columns"
  | "garden";

export interface VisualizationPreferences {
  style: DecorStyle;
  lightColor: LightColor;
  decorationLevel: DecorationLevel;
  areas: DecorationArea[];
  specialRequest?: string;
  selectedProductId?: string;
}

export interface VisualizationResult {
  originalImage: string;
  generatedImage: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  preferences: VisualizationPreferences;
}

export interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  installationDate: string;
  notes: string;
  originalImage?: string;
  generatedImage?: string;
  preferences?: VisualizationPreferences;
}

export interface GalleryItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  style: string;
  estimatedPrice: string;
  location: string;
  category: string[];
}

export type VisualizationStep = "upload" | "style" | "customize" | "generating" | "result";
