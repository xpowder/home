# Providers API Setup Guide

## API Endpoint
The providers API endpoint is: `/api/profile/providers`

## Query Parameters
- `limit` (default: 50) - Number of providers to return
- `offset` (default: 0) - Pagination offset
- `city` - Filter by city (city ID or name)
- `category` - Filter by category (category ID or name)
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter
- `min_reviews` - Minimum number of reviews
- `search` - Search term (searches name, service title)
- `sort` - Sort order: `rating`, `-rating`, `price`, `-price`, `reviews`, `-reviews`, `years`, `-years`

## Example Usage

### Basic Request
```
GET /api/profile/providers?limit=50&offset=0
```

### With Filters
```
GET /api/profile/providers?category=plumbing&city=casablanca&limit=20&offset=0
```

### With Sorting
```
GET /api/profile/providers?sort=-rating&limit=10&offset=0
```

## Response Format

```json
{
  "status": "success",
  "count": 100,
  "limit": 50,
  "offset": 0,
  "providers": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "service_title": "Professional Plumber",
      "service_category": {
        "en": "Plumbing",
        "fr": "Plomberie",
        "ar": "سباكة"
      },
      "city": {
        "en": "Casablanca",
        "fr": "Casablanca",
        "ar": "الدار البيضاء"
      },
      "starting_price_mad": 200.0,
      "average_rating": 4.8,
      "total_reviews": 67,
      "years_experience": 10,
      "profile_picture": "url",
      "service_images": ["url1", "url2"]
    }
  ]
}
```

## Frontend Implementation

The API is integrated in the following components:

1. **Services Page** (`/services`) - Main provider listing page
2. **Home Page Latest Offers** - Shows latest providers
3. **Home Page Meet Helpers** - Shows top-rated providers
4. **Related Services** - Shows providers in same category

## Frontend Service Function

```typescript
import { searchProviders } from "@/services/provider.services";

// Basic usage
const response = await searchProviders({
  limit: 50,
  offset: 0
});

// With filters
const response = await searchProviders({
  category: "category-id",
  city: "city-id",
  limit: 20,
  offset: 0,
  sort: "-rating"
});

// Access providers
const providers = response.providers;
const totalCount = response.count;
```

## Field Mapping

The backend returns:
- `average_rating` → mapped to `rating` in frontend
- `total_reviews` → mapped to `review_count` in frontend

This mapping is handled automatically in the `searchProviders` function.

## Testing

To test the API:

1. **Start Backend Server**
   ```bash
   cd Backend-Homezup/src
   python manage.py runserver
   ```

2. **Test in Browser**
   Open: `http://localhost:8000/api/profile/providers?limit=50&offset=0`

3. **Test in Frontend**
   - Navigate to `/services` page
   - Use search filters on homepage
   - Check browser console for any errors

## Troubleshooting

### No Providers Returned
- Check if providers exist in database with `is_active_provider=True` and `profile_completed=True`
- Verify filters are correct (category/city IDs match database)

### CORS Errors
- Ensure backend `.env` has: `CORS_ALLOWED_ORIGINS=http://localhost:3000`
- Restart backend server after changing `.env`

### API Connection Errors
- Verify backend is running on `http://localhost:8000`
- Check `.env.local` has: `NEXT_PUBLIC_TEST_BACKEND_LOCALLY=true`
- Verify `NEXT_PUBLIC_BACKEND_API_URL` is correct

### Empty Response
- Check backend logs for errors
- Verify database has provider data
- Check if filters are too restrictive

