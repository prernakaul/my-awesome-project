# AI Travel Agent - User Commands Reference

## Overview
This document lists all available commands and interactions for the AI Travel Agent application.

---

## Quick Action Buttons
These buttons appear on the empty chat screen:
- **"Suggest destinations for me"** - Get personalized USA destination recommendations
- **"Plan a weekend getaway"** - Get weekend trip suggestions
- **"Beach vacation ideas"** - Get beach destination recommendations

---

## Local Commands (Handled Without Claude API)

### View Your Preferences
Shows your stored preferences from Redis in a table format.

```
show my preferences
show me my preferences
tell me my preferences
view my preferences
list my preferences
what are my preferences
my redis preferences
preferences
```

### View All Stored Preferences (Debug/Admin)
Shows all users' preferences stored in Redis, grouped by name and user ID.

```
show me all stored redis preferences
show all preferences
all stored redis preferences
all users
```

### Update Your Preferences
Update specific preference fields through natural language.

```
update my travel style to Adventure
change my budget to $500
set my dietary requirements to vegetarian
I'm actually vegan
I prefer luxury hotels instead of budget
my name is [Your Name]
```

**Supported fields for updates:**
- `name` - Your name
- `tripDuration` / `duration` - How long you want to travel
- `travelTimeline` / `timeline` / `when` - When you plan to travel
- `preferredMonth` / `month` - Preferred travel month
- `travelerCount` / `travelers` - Number of travelers
- `travelerRelationships` / `traveling with` / `who` - Who you're traveling with
- `budget` / `budgetMax` / `budgetMin` - Your budget range
- `travelStyle` / `style` - Your travel style preference
- `accommodationType` / `hotel` / `stay` - Accommodation preference
- `dietaryRequirements` / `dietary` / `diet` - Food restrictions
- `accessibilityNeeds` / `accessibility` - Accessibility requirements
- `mobilityLevel` / `mobility` - Mobility level
- `preferredActivities` / `activities` - Activities you enjoy
- `avoidActivities` / `avoid` - Activities to avoid

---

## Claude API Commands (AI-Powered)

### Get Destination Recommendations
Ask for personalized destination suggestions based on your preferences.

```
Suggest destinations for me
Where should I travel?
Recommend some places to visit
What are the best destinations for my preferences?
I want to go somewhere warm
Suggest beach destinations
Mountain vacation ideas
```

### Plan an Itinerary
After selecting a destination, get a detailed day-by-day itinerary.

```
I'd like to plan a trip to [City], [State]
Create an itinerary for [Destination]
Plan my trip to [City]
```
*Note: Clicking "Plan This Trip" on a destination card automatically sends this command.*

### Modify Itinerary
Ask Claude to adjust the generated itinerary.

```
Add more outdoor activities
I need wheelchair accessible options
Include vegetarian restaurants only
Make it more budget-friendly
Add another day to the itinerary
```

### General Travel Questions
Ask any travel-related questions.

```
What's the best time to visit [City]?
What should I pack for [Destination]?
Are there any visa requirements?
What's the weather like in [Month]?
```

---

## Workflow

1. **Onboarding** - Complete the 7-question preference flow (name, duration, timeline, travelers, budget, style, activities)
2. **Get Recommendations** - Ask for destination suggestions or click a quick action button
3. **Select Destination** - Click "Plan This Trip" on your chosen destination
4. **Review Itinerary** - View the day-by-day plan with activities, meals, and tips
5. **Refine** - Update preferences or ask for modifications

---

## Tips

- Your preferences are automatically saved to Redis and persist across sessions
- The "Reset Preferences" button in the header clears your data and restarts onboarding
- The status indicator in the header shows if your profile is synced to Redis
- Itineraries include estimated costs, meal suggestions, and travel tips
- You can update preferences mid-conversation and get adjusted recommendations
