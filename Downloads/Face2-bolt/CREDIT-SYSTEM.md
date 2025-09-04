# Credit System Implementation

## Overview
The MedSpaGen application now features a comprehensive credit system that gives every new user 3 free video credits on top of their paid plan credits, with automatic credit deduction for each completed video generation.

## Credit System Structure

### Credit Types
1. **Free Credits** (`credits.free`): 3 credits given to every new user
2. **Bonus Credits** (`credits.bonus`): Additional promotional credits (future use)
3. **Plan Credits** (`subscription.videosRemaining`): Credits from paid subscription plans

### Credit Usage Priority
Credits are deducted in the following order:
1. Free credits first
2. Bonus credits second  
3. Plan/subscription credits last

## Implementation Details

### 1. User Profile Schema (`src/store/authStore.ts`)
```typescript
interface UserProfile {
  // ... existing fields
  credits: {
    free: number;        // Free credits (3 for new users)
    bonus: number;       // Promotional/bonus credits
    total: number;       // Calculated total of all credits
  };
}
```

### 2. New User Registration (`src/services/authService.ts`)
- Every new user receives 3 free credits automatically
- Existing users are migrated to include 3 free credits
- Credits are stored in Firestore user profile

### 3. Credit Deduction System
- **Frontend**: Real-time credit checking and local state updates
- **Backend**: Persistent credit deduction in Firestore
- **Validation**: Prevents video generation if no credits available

### 4. Video Generation Integration (`src/pages/generate/NewGenerate.tsx`)
- Credit check before video generation starts
- Credit deduction after successful video completion
- Error handling if credits are insufficient

## User Interface Updates

### Dashboard (`src/pages/Dashboard.tsx`)
- **Credit Display**: Visual breakdown of free, bonus, and plan credits
- **Color-coded badges**: Green (free), purple (bonus), blue (plan)
- **Total counter**: Shows combined credits available
- **Smart conditions**: Generate button enabled based on total credits

### Generate Page (`src/pages/generate/NewGenerate.tsx`)  
- **Header display**: Live credit counter in navigation
- **Real-time updates**: Credits update immediately after generation
- **Visual feedback**: Different colors for different credit types

## Credit Flow Example

### New User Registration
```
User Signs Up
├── Creates user profile
├── Assigns 3 free credits
├── Assigns plan credits (e.g., 2 for free tier)
└── Total: 5 credits (3 free + 2 plan)
```

### Video Generation
```
User Generates Video
├── Check: totalCredits > 0? ✓
├── Generate video successfully
├── Deduct 1 credit (free first)
├── Update: 2 free + 2 plan = 4 total
└── Refresh user interface
```

### Credit Deduction Order
```
Generation #1: 3 free + 0 bonus + 2 plan = 5 total
├── Deduct 1 free credit
└── Result: 2 free + 0 bonus + 2 plan = 4 total

Generation #2: 2 free + 0 bonus + 2 plan = 4 total  
├── Deduct 1 free credit
└── Result: 1 free + 0 bonus + 2 plan = 3 total

Generation #3: 1 free + 0 bonus + 2 plan = 3 total
├── Deduct 1 free credit  
└── Result: 0 free + 0 bonus + 2 plan = 2 total

Generation #4: 0 free + 0 bonus + 2 plan = 2 total
├── Deduct 1 plan credit
└── Result: 0 free + 0 bonus + 1 plan = 1 total
```

## Database Structure

### Firestore User Document
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "subscription": {
    "plan": "free",
    "videosRemaining": 2,
    "videosTotal": 2
  },
  "credits": {
    "free": 3,
    "bonus": 0,  
    "total": 5
  },
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## Key Functions

### Auth Store Methods
- `getTotalCredits()`: Returns total credits across all types
- `deductCredit()`: Local credit deduction with state update
- `updateCredits()`: Updates credit information in store

### Auth Service Functions  
- `createUserProfile()`: Sets up new user with 3 free credits
- `getUserProfile()`: Includes migration for existing users
- `deductUserCredit()`: Persistent credit deduction in Firestore
- `updateUserCredits()`: Updates Firestore credit data

## Migration Strategy
Existing users without the credits field are automatically migrated:
- Receives 3 free credits on first login
- Maintains existing subscription credits
- No data loss or disruption

## Benefits
1. **User Onboarding**: New users can try the service immediately with 3 free videos
2. **Clear Value Proposition**: Users see exactly what they get before paying
3. **Flexible System**: Supports promotional campaigns with bonus credits
4. **Transparent Usage**: Clear visual feedback on credit consumption
5. **Scalable Architecture**: Easy to extend for future credit types

## Testing
- ✅ New user registration includes 3 free credits
- ✅ Existing user migration preserves data and adds free credits
- ✅ Credit deduction works in correct priority order
- ✅ UI updates reflect credit changes in real-time
- ✅ Video generation blocked when no credits available
- ✅ TypeScript compilation successful with no errors