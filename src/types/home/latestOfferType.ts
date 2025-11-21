export interface LatestOfferCardType {
  img: string; // Path or URL to the main offer image
  featured: boolean; // Whether this offer is featured
  active: boolean; // Availability status
  avatar: string; // Path or URL to the provider's avatar image
  name: string; // Provider's name
  location: string; // City or region
  serviceType: string; // Broad service category, e.g. "Cleaning"
  serviceName: string; // Specific service name
  rating: string;
  price: string; // Price as a string (e.g. "250")
}
