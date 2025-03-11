
interface GalleryItem {
    id: string;
    filename: string;
    prompt: string;
    createdAt: string;
    filepath: string;
  }
  
  interface GalleryMetadata {
    items: GalleryItem[];
  }