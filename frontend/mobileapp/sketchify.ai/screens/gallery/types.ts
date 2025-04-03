interface GalleryItem {
  id: string;
  title: string;
  prompt: string;
  theme: "minimalism" | "realism" | "nature";
  createdAt: string;
  imageUrl: string;
  drawingUrl: string;
}
  
interface GalleryMetadata {
  items: GalleryItem[];
}