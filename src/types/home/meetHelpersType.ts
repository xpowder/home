export interface HelperCard {
  img: string; // URL or path to the helper's image
  name: string; // Helper's display name
  jobDone: string; // e.g. "98 jobs completed"
  location: string; // City or region
  rating: string; // Rating value, e.g. "4.9"
  category: string[]; // List of service categories
  color: string; // Tailwind background class, e.g. "bg-primary"
  providerId?: string; // Optional provider ID for linking
}
