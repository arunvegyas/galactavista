# Galactavista - Cross-Platform VR Real Estate Platform

A unified VR real estate platform with shared codebase across web and mobile platforms.

## 🏗️ Architecture

### Shared Code Structure
```
shared/
├── types/          # Shared TypeScript types
├── utils/          # Shared utilities and API client
└── constants/      # Shared constants and configuration
```

### Platform-Specific Apps
- **Web Frontend**: React web application (`frontend/`)
- **Mobile App**: React Native with Expo (`mobile/`)
- **Backend API**: Go REST API (`backend/`)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Go 1.21+
- Expo CLI (`npm install -g @expo/cli`)

### Backend Setup
```bash
cd backend
go mod download
go run cmd/main.go
```

### Web Frontend
```bash
cd frontend
npm install
npm start
```

### Mobile App
```bash
cd mobile
npm install
npx expo start
```

## 📱 Features

### Cross-Platform Functionality
- **Property Browsing**: View properties with images and details
- **Search & Filters**: Advanced property search with filters
- **User Authentication**: Login/register with role-based access
- **VR Experiences**: Immersive property tours (coming soon)
- **Favorites**: Save and manage favorite properties
- **User Profiles**: Manage account and preferences

### Platform-Specific Features
- **Web**: Full-featured dashboard, advanced search, VR viewer
- **Mobile**: Native mobile experience, offline support, push notifications

## 🔧 Development

### Shared Code
The `shared/` directory contains code used by both web and mobile:
- **Types**: TypeScript interfaces and types
- **API Client**: Unified API client for both platforms
- **Constants**: Shared configuration and constants

### Adding New Features
1. Define types in `shared/types/`
2. Add API methods in `shared/utils/api.ts`
3. Implement UI in both `frontend/` and `mobile/`
4. Update backend API if needed

### Code Sharing Strategy
- **Types**: 100% shared between platforms
- **API Logic**: Shared API client with platform-specific extensions
- **UI Components**: Platform-specific implementations
- **Business Logic**: Shared utilities and constants

## 🏛️ Project Structure

```
Galactavista/
├── shared/                 # Shared code
│   ├── types/             # TypeScript types
│   ├── utils/             # Utilities and API client
│   └── constants/         # Shared constants
├── frontend/              # React web app
│   ├── src/
│   │   ├── components/    # Web-specific components
│   │   ├── pages/         # Web pages
│   │   ├── hooks/         # Web-specific hooks
│   │   └── services/      # Web API service
├── mobile/                # React Native app
│   ├── app/               # Expo Router screens
│   ├── components/        # Mobile-specific components
│   └── constants/         # Mobile constants
├── backend/               # Go API server
│   ├── cmd/               # Application entry point
│   ├── internal/          # Internal packages
│   └── pkg/               # Public packages
└── docs/                  # Documentation
```

## 🔐 Authentication

The platform supports multiple user roles:
- **Buyer**: Browse properties, save favorites
- **Seller**: List properties, manage listings
- **Agent**: Full access, manage multiple properties
- **Admin**: System administration

## 🎯 Next Steps

### Phase 1: Core Features ✅
- [x] Shared codebase setup
- [x] Basic property browsing
- [x] User authentication
- [x] Cross-platform navigation

### Phase 2: Advanced Features 🚧
- [ ] VR experience integration
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Property management dashboard

### Phase 3: Production Ready 🎯
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Analytics integration
- [ ] Deployment automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes in shared code first
4. Implement platform-specific UI
5. Test on both web and mobile
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Galactavista** - Revolutionizing real estate with VR technology across all platforms. 