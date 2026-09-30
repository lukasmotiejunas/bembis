import { GalleryItem } from "../types";

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    beforeImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    afterImage: "/visualizer-preview.png",
    style: "Auksinė prabanga",
    estimatedPrice: "€590–€790",
    location: "Vilnius",
    category: ["luxury", "large-houses"],
  },
  {
    id: "2",
    beforeImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    afterImage: "/visualizer-preview1.png",
    style: "Klasikinis šiltas",
    estimatedPrice: "€660–€891",
    location: "Kaunas",
    category: ["classic", "small-houses"],
  },
  {
    id: "3",
    beforeImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    afterImage: "/visualizer-preview2.png",
    style: "Minimalus skandinaviškas",
    estimatedPrice: "€485–€655",
    location: "Klaipėda",
    category: ["minimal", "small-houses"],
  },
  {
    id: "4",
    beforeImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    afterImage: "/visualizer-preview4.png",
    style: "Žiemos baltas",
    estimatedPrice: "€847–€1143",
    location: "Vilnius",
    category: ["classic", "large-houses"],
  },
  {
    id: "5",
    beforeImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    afterImage: "/visualizer-preview3.png",
    style: "Spalvotos Kalėdos",
    estimatedPrice: "€600–€810",
    location: "Šiauliai",
    category: ["colorful", "large-houses"],
  },
  {
    id: "6",
    beforeImage: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    afterImage: "/visualizer-preview5.png",
    style: "Mėlyna/Balta",
    estimatedPrice: "€600–€810",
    location: "Panevėžys",
    category: ["luxury", "large-houses"],
  },
];

export const galleryCategories = [
  { id: "all", label: "Visi" },
  { id: "minimal", label: "Minimalus" },
  { id: "classic", label: "Klasikinis" },
  { id: "luxury", label: "Prabangus" },
  { id: "colorful", label: "Spalvingas" },
  { id: "large-houses", label: "Dideli namai" },
  { id: "small-houses", label: "Maži namai" },
];
