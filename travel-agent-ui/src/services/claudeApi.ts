import { ClaudeMessage, UserPreferences, Destination } from '../types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const TRAVEL_SYSTEM_PROMPT = `You are an expert AI travel agent specializing in USA domestic travel. You help users plan personalized trips based on their preferences, budget, and needs.

## Your Workflow

### Phase 1: Understanding Preferences
When preferences are provided, acknowledge them briefly. If missing key info, ask follow-up questions about:
- Trip duration and timing
- Budget range
- Travel style (adventure, relaxation, cultural, etc.)
- Any accessibility needs or dietary requirements

### Phase 2: Destination Recommendations
When the user asks for destinations or trip suggestions:
- Suggest 3-5 USA destinations that match their preferences
- Format each destination as a structured block (see format below)
- Include estimated costs, best activities, and why it matches their needs
- Consider weather for their travel month

### Phase 3: Itinerary Creation
When the user selects a destination:
- Create a detailed day-by-day itinerary
- Include specific activities, restaurants, and logistics
- Account for their budget, dietary needs, and accessibility requirements
- Suggest morning, afternoon, and evening activities

### Phase 4: Preference Updates
If the user mentions they have different preferences than what you assumed (e.g., "I'm actually vegetarian", "I need wheelchair access"):
- Acknowledge the update
- Note what changed using format: [PREFERENCE_UPDATE: field=value]
- Adjust any recommendations accordingly

## Output Formats

### Destination Format:
\`\`\`destination
CITY: [City Name]
STATE: [State]
DESCRIPTION: [2-3 sentence description]
HIGHLIGHTS: [comma-separated list]
BEST_FOR: [comma-separated list of travel styles]
COST_RANGE: $[low]-$[high] per day
WHY_MATCH: [Why this matches their preferences]
\`\`\`

### Itinerary Day Format:
\`\`\`itinerary_day
DAY: [number]
TITLE: [Day theme/title]
ACTIVITIES:
- TIME: [time] | NAME: [activity] | DURATION: [duration] | COST: $[amount] | DESCRIPTION: [details]
MEALS:
- BREAKFAST: [suggestion]
- LUNCH: [suggestion]
- DINNER: [suggestion]
NOTES: [any tips for this day]
\`\`\`

## Important Guidelines
- Only suggest destinations within the USA
- Always consider accessibility needs if mentioned
- Be mindful of dietary restrictions for restaurant recommendations
- Include both free and paid activities for budget flexibility
- Mention weather expectations for the travel period`;

class ClaudeApiService {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || null;
  }

  private buildUserContext(preferences: UserPreferences | null): string {
    if (!preferences) {
      return 'No user preferences available yet.';
    }

    const parts: string[] = ['User Profile:'];

    if (preferences.tripDuration) {
      parts.push(`- Trip duration: ${preferences.tripDuration}`);
    }
    if (preferences.travelTimeline) {
      parts.push(`- Travel timeline: ${preferences.travelTimeline}`);
    }
    if (preferences.preferredMonth) {
      parts.push(`- Preferred month: ${preferences.preferredMonth}`);
    }
    if (preferences.travelerCount) {
      parts.push(`- Number of travelers: ${preferences.travelerCount}`);
    }
    if (preferences.travelerAges) {
      parts.push(`- Traveler ages: ${preferences.travelerAges}`);
    }
    if (preferences.travelerRelationships) {
      parts.push(`- Traveling with: ${preferences.travelerRelationships}`);
    }
    if (preferences.budgetMin || preferences.budgetMax) {
      const currency = preferences.budgetCurrency || 'USD';
      const min = preferences.budgetMin || '0';
      const max = preferences.budgetMax || 'flexible';
      parts.push(`- Budget: ${min}-${max} ${currency}`);
    }
    if (preferences.travelStyle) {
      parts.push(`- Travel style: ${preferences.travelStyle}`);
    }
    if (preferences.accommodationType) {
      parts.push(`- Accommodation preference: ${preferences.accommodationType}`);
    }
    if (preferences.dietaryRequirements) {
      parts.push(`- Dietary requirements: ${preferences.dietaryRequirements}`);
    }
    if (preferences.accessibilityNeeds) {
      parts.push(`- Accessibility needs: ${preferences.accessibilityNeeds}`);
    }
    if (preferences.mobilityLevel) {
      parts.push(`- Mobility level: ${preferences.mobilityLevel}`);
    }
    if (preferences.preferredActivities) {
      parts.push(`- Preferred activities: ${preferences.preferredActivities}`);
    }
    if (preferences.avoidActivities) {
      parts.push(`- Activities to avoid: ${preferences.avoidActivities}`);
    }

    return parts.length > 1 ? parts.join('\n') : 'No specific preferences set.';
  }

  async sendMessage(
    messages: ClaudeMessage[],
    preferences: UserPreferences | null
  ): Promise<string> {
    if (!this.apiKey) {
      console.warn('No API key available, using mock response');
      return this.getMockResponse(messages, preferences);
    }

    try {
      const userContext = this.buildUserContext(preferences);
      const systemPrompt = `${TRAVEL_SYSTEM_PROMPT}\n\n## Current User Context\n${userContext}`;

      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Claude API error:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      return this.getMockResponse(messages, preferences);
    }
  }

  private getMockResponse(messages: ClaudeMessage[], preferences: UserPreferences | null): string {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

    // Mock destination response
    if (lastMessage.includes('destination') || lastMessage.includes('suggest') || lastMessage.includes('where should')) {
      return `Based on your preferences, here are my top recommendations for your trip:

\`\`\`destination
CITY: San Diego
STATE: California
DESCRIPTION: A beautiful coastal city with perfect weather, stunning beaches, and world-class attractions. Great for families and couples alike.
HIGHLIGHTS: Balboa Park, San Diego Zoo, Gaslamp Quarter, La Jolla Cove, Coronado Beach
BEST_FOR: beach lovers, families, foodies, relaxation
COST_RANGE: $150-$300 per day
WHY_MATCH: Matches your preference for ${preferences?.travelStyle || 'relaxed'} travel with excellent dining and outdoor activities.
\`\`\`

\`\`\`destination
CITY: Austin
STATE: Texas
DESCRIPTION: The live music capital of the world offers incredible food, vibrant nightlife, and a unique blend of Texas culture with modern creativity.
HIGHLIGHTS: 6th Street, Barton Springs, South Congress, BBQ Trail, Live Music Venues
BEST_FOR: music lovers, foodies, nightlife, cultural experiences
COST_RANGE: $120-$250 per day
WHY_MATCH: Perfect for experiencing local culture and amazing food scene within budget.
\`\`\`

\`\`\`destination
CITY: Sedona
STATE: Arizona
DESCRIPTION: A stunning desert oasis known for its red rock formations, spiritual energy, and outdoor adventures. Ideal for those seeking natural beauty and relaxation.
HIGHLIGHTS: Red Rock State Park, Vortex Sites, Chapel of the Holy Cross, Oak Creek Canyon, Hiking Trails
BEST_FOR: nature lovers, hiking, wellness, photography
COST_RANGE: $130-$280 per day
WHY_MATCH: Offers incredible natural scenery and ${preferences?.travelStyle?.includes('adventure') ? 'adventure activities' : 'peaceful retreats'}.
\`\`\`

Which destination appeals to you most? I can create a detailed day-by-day itinerary for any of these!`;
    }

    // Mock itinerary response - extract city from message
    if (lastMessage.includes('trip to') || lastMessage.includes('itinerary') || lastMessage.includes('plan a trip')) {
      // Try to extract city and state from message
      const tripMatch = messages[messages.length - 1]?.content.match(/trip to ([^,.]+),?\s*([^,.]*)/i);
      let city = 'the destination';
      let state = '';

      if (tripMatch) {
        city = tripMatch[1].trim();
        state = tripMatch[2]?.trim() || '';
      } else if (lastMessage.includes('sedona')) {
        city = 'Sedona';
        state = 'Arizona';
      } else if (lastMessage.includes('austin')) {
        city = 'Austin';
        state = 'Texas';
      } else if (lastMessage.includes('san diego')) {
        city = 'San Diego';
        state = 'California';
      }

      // Generate dynamic itinerary based on city
      const itineraries: Record<string, string> = {
        'sedona': `Great choice! Here's your personalized Sedona itinerary:

\`\`\`itinerary_day
DAY: 1
TITLE: Red Rock Discovery
ACTIVITIES:
- TIME: 8:00 AM | NAME: Sunrise at Airport Mesa | DURATION: 1.5 hours | COST: $0 | DESCRIPTION: Watch the sunrise paint the red rocks in stunning colors from this famous vortex site
- TIME: 10:00 AM | NAME: Breakfast at Coffee Pot Restaurant | DURATION: 1 hour | COST: $20 | DESCRIPTION: Classic Sedona breakfast spot with 101 omelet varieties
- TIME: 11:30 AM | NAME: Cathedral Rock Trail | DURATION: 3 hours | COST: $5 | DESCRIPTION: Iconic hike with panoramic views of Sedona's most photographed formation
- TIME: 3:00 PM | NAME: Tlaquepaque Arts Village | DURATION: 2 hours | COST: $0 | DESCRIPTION: Browse galleries and artisan shops in this beautiful Mexican-inspired village
- TIME: 6:00 PM | NAME: Sunset at Red Rock Crossing | DURATION: 1.5 hours | COST: $0 | DESCRIPTION: Perfect spot to watch Cathedral Rock glow at sunset
MEALS:
- BREAKFAST: Coffee Pot Restaurant
- LUNCH: Pack snacks for the trail
- DINNER: Elote Cafe (Mexican cuisine)
NOTES: Bring plenty of water and sun protection. The trails can be strenuous but rewarding.
\`\`\`

\`\`\`itinerary_day
DAY: 2
TITLE: Spiritual Sedona & Oak Creek
ACTIVITIES:
- TIME: 9:00 AM | NAME: Chapel of the Holy Cross | DURATION: 1 hour | COST: $0 | DESCRIPTION: Stunning chapel built into the red rocks with breathtaking views
- TIME: 10:30 AM | NAME: Bell Rock Vortex | DURATION: 2 hours | COST: $0 | DESCRIPTION: Easy hike around one of Sedona's most accessible vortex sites
- TIME: 1:00 PM | NAME: Lunch in Uptown Sedona | DURATION: 1.5 hours | COST: $30 | DESCRIPTION: Explore the shops and grab lunch at one of the many restaurants
- TIME: 3:00 PM | NAME: Slide Rock State Park | DURATION: 3 hours | COST: $20 | DESCRIPTION: Natural water slide and swimming holes in Oak Creek Canyon
- TIME: 7:00 PM | NAME: Stargazing | DURATION: 2 hours | COST: $0 | DESCRIPTION: Sedona is a Dark Sky Community - perfect for stargazing
MEALS:
- BREAKFAST: Hotel breakfast
- LUNCH: The Hudson (upscale American)
- DINNER: Mariposa Latin Inspired Grill
NOTES: Slide Rock can get crowded - arrive early. Bring water shoes!
\`\`\`

Would you like me to continue with more days, or adjust anything in this itinerary?`,

        'austin': `Great choice! Here's your personalized Austin itinerary:

\`\`\`itinerary_day
DAY: 1
TITLE: Keep Austin Weird
ACTIVITIES:
- TIME: 9:00 AM | NAME: Breakfast Tacos at Veracruz All Natural | DURATION: 1 hour | COST: $15 | DESCRIPTION: Iconic Austin breakfast tacos - try the migas!
- TIME: 10:30 AM | NAME: South Congress Avenue | DURATION: 3 hours | COST: $0 | DESCRIPTION: Explore eclectic shops, street art, and the famous "I Love You So Much" mural
- TIME: 2:00 PM | NAME: Barton Springs Pool | DURATION: 2 hours | COST: $9 | DESCRIPTION: Cool off in this natural spring-fed pool kept at 68°F year-round
- TIME: 5:00 PM | NAME: Lady Bird Lake Kayaking | DURATION: 2 hours | COST: $35 | DESCRIPTION: Paddle along downtown Austin's scenic waterway
- TIME: 8:00 PM | NAME: 6th Street Live Music | DURATION: 3 hours | COST: $0-20 | DESCRIPTION: Experience Austin's legendary live music scene
MEALS:
- BREAKFAST: Veracruz All Natural
- LUNCH: Torchy's Tacos
- DINNER: Franklin Barbecue (arrive early!) or Terry Black's
NOTES: Wear comfortable walking shoes. 6th Street gets lively at night!
\`\`\`

\`\`\`itinerary_day
DAY: 2
TITLE: Culture & Nature
ACTIVITIES:
- TIME: 9:00 AM | NAME: Texas State Capitol | DURATION: 1.5 hours | COST: $0 | DESCRIPTION: Tour the stunning pink granite capitol building
- TIME: 11:00 AM | NAME: Blanton Museum of Art | DURATION: 2 hours | COST: $12 | DESCRIPTION: World-class art collection at UT Austin
- TIME: 1:30 PM | NAME: East Austin Food Tour | DURATION: 2 hours | COST: $40 | DESCRIPTION: Sample diverse cuisines in Austin's hippest neighborhood
- TIME: 4:00 PM | NAME: Mount Bonnell | DURATION: 1.5 hours | COST: $0 | DESCRIPTION: Climb 100 steps for panoramic views of Lake Austin
- TIME: 7:30 PM | NAME: Congress Avenue Bridge Bats | DURATION: 1 hour | COST: $0 | DESCRIPTION: Watch 1.5 million bats emerge at sunset (seasonal)
MEALS:
- BREAKFAST: Jo's Coffee (try the iced turbo)
- LUNCH: East Austin food tour
- DINNER: Uchi (upscale Japanese)
NOTES: Bat viewing is best March-October. Arrive 30 min before sunset.
\`\`\`

Would you like me to continue with more days, or adjust anything in this itinerary?`,

        'default': `Great choice! Here's your personalized ${city}${state ? ', ' + state : ''} itinerary:

\`\`\`itinerary_day
DAY: 1
TITLE: Exploring ${city}
ACTIVITIES:
- TIME: 9:00 AM | NAME: Local Breakfast Spot | DURATION: 1 hour | COST: $20 | DESCRIPTION: Start your day with a delicious local breakfast
- TIME: 10:30 AM | NAME: Main Attractions Tour | DURATION: 3 hours | COST: $25 | DESCRIPTION: Visit the top-rated attractions and landmarks in ${city}
- TIME: 2:00 PM | NAME: Lunch at Popular Local Restaurant | DURATION: 1.5 hours | COST: $30 | DESCRIPTION: Experience local cuisine at a highly-rated restaurant
- TIME: 4:00 PM | NAME: Nature/Park Visit | DURATION: 2 hours | COST: $10 | DESCRIPTION: Explore the natural beauty near ${city}
- TIME: 7:00 PM | NAME: Evening Entertainment | DURATION: 2 hours | COST: $40 | DESCRIPTION: Enjoy dinner and local entertainment
MEALS:
- BREAKFAST: Local cafe
- LUNCH: Regional specialty restaurant
- DINNER: Fine dining experience
NOTES: Check local weather and pack accordingly. Book popular restaurants in advance.
\`\`\`

\`\`\`itinerary_day
DAY: 2
TITLE: ${city} Deep Dive
ACTIVITIES:
- TIME: 9:00 AM | NAME: Museum or Cultural Site | DURATION: 2 hours | COST: $15 | DESCRIPTION: Immerse yourself in local history and culture
- TIME: 11:30 AM | NAME: Shopping District | DURATION: 2 hours | COST: $0 | DESCRIPTION: Browse local shops and boutiques
- TIME: 2:00 PM | NAME: Scenic Lunch Spot | DURATION: 1.5 hours | COST: $35 | DESCRIPTION: Dine with a view
- TIME: 4:00 PM | NAME: Outdoor Activity | DURATION: 2 hours | COST: $20 | DESCRIPTION: Hiking, biking, or water activities nearby
- TIME: 7:00 PM | NAME: Sunset Experience | DURATION: 2 hours | COST: $0 | DESCRIPTION: Find the perfect spot to watch the sunset
MEALS:
- BREAKFAST: Hotel or nearby bakery
- LUNCH: Scenic restaurant
- DINNER: Local favorite
NOTES: This itinerary can be customized based on your specific interests!
\`\`\`

Would you like me to continue with more days, or adjust anything in this itinerary?`
      };

      const cityKey = city.toLowerCase();
      return itineraries[cityKey] || itineraries['default'];
    }

    // Mock preference update response
    if (lastMessage.includes('vegetarian') || lastMessage.includes('vegan') || lastMessage.includes('dietary')) {
      return `Got it! I've noted your dietary preferences.

[PREFERENCE_UPDATE: dietaryRequirements=vegetarian]

I'll make sure all future restaurant recommendations include excellent vegetarian options. San Diego actually has a fantastic vegetarian food scene! Let me update the restaurant suggestions:

- **Breakfast**: Cafe Gratitude (plant-based) or Trilogy Sanctuary (vegan-friendly with ocean views)
- **Lunch**: Plumeria (Thai vegetarian) or Donna Jean (upscale vegan)
- **Dinner**: Kindred (vegan comfort food) or Sipz (Asian fusion vegetarian)

Would you like me to revise the full itinerary with these new dining options?`;
    }

    // Default response
    return `I'm your AI travel agent, ready to help you plan an amazing trip within the USA!

I can see from your profile that you're interested in ${preferences?.travelStyle || 'exploring new places'}.

To get started, would you like me to:
1. **Suggest destinations** based on your preferences
2. **Create a detailed itinerary** for a specific city
3. **Answer questions** about travel planning

Just let me know how I can help!`;
  }

  parseDestinations(response: string): Destination[] {
    const destinations: Destination[] = [];
    const destinationRegex = /```destination\n([\s\S]*?)```/g;
    let match;

    while ((match = destinationRegex.exec(response)) !== null) {
      const block = match[1];
      const destination = this.parseDestinationBlock(block);
      if (destination) {
        destinations.push(destination);
      }
    }

    return destinations;
  }

  private parseDestinationBlock(block: string): Destination | null {
    try {
      const getField = (field: string): string => {
        const regex = new RegExp(`${field}:\\s*(.+)`, 'i');
        const match = block.match(regex);
        return match ? match[1].trim() : '';
      };

      const city = getField('CITY');
      const state = getField('STATE');

      if (!city || !state) return null;

      const costRange = getField('COST_RANGE');
      const costMatch = costRange.match(/\$(\d+)-\$(\d+)/);

      return {
        id: `${city}-${state}`.toLowerCase().replace(/\s+/g, '-'),
        city,
        state,
        description: getField('DESCRIPTION'),
        highlights: getField('HIGHLIGHTS').split(',').map(h => h.trim()).filter(Boolean),
        bestFor: getField('BEST_FOR').split(',').map(b => b.trim()).filter(Boolean),
        estimatedCost: {
          low: costMatch ? parseInt(costMatch[1]) : 100,
          high: costMatch ? parseInt(costMatch[2]) : 300
        },
        imageUrl: this.getDestinationImageUrl(city)
      };
    } catch (error) {
      console.error('Error parsing destination block:', error);
      return null;
    }
  }

  parsePreferenceUpdates(response: string): Record<string, string> {
    const updates: Record<string, string> = {};
    const updateRegex = /\[PREFERENCE_UPDATE:\s*(\w+)=([^\]]+)\]/g;
    let match;

    while ((match = updateRegex.exec(response)) !== null) {
      updates[match[1]] = match[2].trim();
    }

    return updates;
  }

  getDestinationImageUrl(city: string): string {
    // Use curated travel images for known destinations, fallback to Lorem Picsum
    const cityImages: Record<string, string> = {
      'san diego': 'https://images.unsplash.com/photo-1538964173425-93c8f373dbe0?w=400&h=300&fit=crop',
      'austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&h=300&fit=crop',
      'sedona': 'https://images.unsplash.com/photo-1502375751885-4f494926ce5c?w=400&h=300&fit=crop',
      'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
      'los angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400&h=300&fit=crop',
      'miami': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=300&fit=crop',
      'seattle': 'https://images.unsplash.com/photo-1438401171849-74ac270044ee?w=400&h=300&fit=crop',
      'denver': 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=400&h=300&fit=crop',
      'chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=300&fit=crop',
      'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
      'new orleans': 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400&h=300&fit=crop',
      'nashville': 'https://images.unsplash.com/photo-1545419913-775e3e0e8f84?w=400&h=300&fit=crop',
      'savannah': 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=400&h=300&fit=crop',
      'boston': 'https://images.unsplash.com/photo-1501979376754-1d87814c7e55?w=400&h=300&fit=crop',
      'portland': 'https://images.unsplash.com/photo-1507245351456-d770d66af46c?w=400&h=300&fit=crop',
    };

    const lowerCity = city.toLowerCase();
    if (cityImages[lowerCity]) {
      return cityImages[lowerCity];
    }

    // Fallback: Use Lorem Picsum with a seed based on city name for consistency
    const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/400/300`;
  }

  getActivityImageUrl(activity: string): string {
    // Use Lorem Picsum with seed for consistent images
    const seed = activity.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/400/200`;
  }
}

export const claudeApiService = new ClaudeApiService();
