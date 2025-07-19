# E-commerce Application

A modern, full-stack e-commerce application built with .NET Core API and Angular 17, featuring snow sports gear and equipment.

## 🏔️ Features

### Core E-commerce Features

- **Product Catalog**: Browse snow sports gear with filtering and search
- **Shopping Cart**: Add, remove, and manage cart items with real-time updates
- **User Authentication**: Secure login/register system with JWT tokens
- **Checkout Process**: Protected checkout flow with cart validation
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features

- **Modern Angular 17**: Built with standalone components and signals
- **.NET Core API**: RESTful API with Entity Framework Core
- **Real-time Cart Sync**: Optimized cart synchronization with server
- **Route Guards**: Protected routes for authentication and cart validation
- **Material Design**: Beautiful UI components from Angular Material
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

### Frontend (Angular 17)

```
client/
├── src/
│   ├── app/
│   │   ├── core/           # Core services, guards, interceptors
│   │   ├── features/       # Feature modules (shop, cart, checkout, etc.)
│   │   ├── layout/         # Layout components (header, footer)
│   │   └── shared/         # Shared components and models
│   ├── environments/       # Environment configurations
│   └── assets/            # Static assets
```

### Backend (.NET Core)

```
API/
├── Controllers/           # API endpoints
├── DTOs/                 # Data transfer objects
├── Extensions/           # Extension methods
├── Middleware/           # Custom middleware
└── RequestHelpers/       # Helper classes

Core/
├── Entities/             # Domain entities
├── Interfaces/           # Repository interfaces
└── Specifications/       # Query specifications

Infrastructure/
├── Data/                 # Database context and repositories
├── Services/             # Business logic services
└── Migrations/           # Entity Framework migrations
```

## 🚀 Getting Started

### Prerequisites

- **.NET 8.0 SDK**
- **Node.js 18+**
- **SQL Server** (or SQLite for development)
- **Angular CLI 17**

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Ecommerce
   ```

2. **Navigate to API directory**

   ```bash
   cd API
   ```

3. **Install dependencies**

   ```bash
   dotnet restore
   ```

4. **Update connection string** in `appsettings.json`

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "your-connection-string-here"
     }
   }
   ```

5. **Run migrations**

   ```bash
   dotnet ef database update
   ```

6. **Start the API**
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001`

### Frontend Setup

1. **Navigate to client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Update API URL** in `src/environments/environment.ts`

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "https://localhost:5001/api/",
   };
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`

## 🛠️ Development

### Key Technologies

#### Frontend

- **Angular 17**: Latest Angular with standalone components
- **Angular Material**: UI component library
- **RxJS**: Reactive programming
- **Angular Signals**: Modern state management
- **TypeScript**: Type-safe JavaScript

#### Backend

- **.NET 8**: Latest .NET framework
- **Entity Framework Core**: ORM for database operations
- **ASP.NET Core Identity**: Authentication and authorization
- **AutoMapper**: Object mapping
- **Swagger**: API documentation

### Project Structure

#### Core Services

- **AccountService**: User authentication and management
- **ShopService**: Product catalog and filtering
- **CartService**: Shopping cart operations with real-time sync
- **SnackbarService**: User notifications

#### Guards

- **authGuard**: Protects auth pages from authenticated users
- **requireAuthGuard**: Protects routes requiring authentication
- **emptyCartGuard**: Prevents checkout with empty cart

#### Key Features Implementation

##### Shopping Cart

- Real-time synchronization with server
- Optimized performance with Map-based lookups
- Debounced updates to prevent excessive API calls

##### Authentication

- JWT token-based authentication
- Automatic token refresh
- Route protection with return URL functionality

##### Product Catalog

- Advanced filtering and search
- Pagination support
- Specification pattern for complex queries

## 🧪 Testing

### Backend Testing

```bash
cd API
dotnet test
```

### Frontend Testing

```bash
cd client
ng test
```

## 📦 Deployment

### Backend Deployment

1. Build the application

   ```bash
   dotnet publish -c Release
   ```

2. Deploy to your preferred hosting platform (Azure, AWS, etc.)

### Frontend Deployment

1. Build for production

   ```bash
   ng build --configuration production
   ```

2. Deploy the `dist` folder to your hosting platform

## 🔧 Configuration

### Environment Variables

#### Backend

- `ConnectionStrings:DefaultConnection`: Database connection string
- `JWT:Key`: JWT secret key
- `JWT:Issuer`: JWT issuer
- `JWT:Audience`: JWT audience

#### Frontend

- `apiUrl`: Backend API URL
- `production`: Environment flag

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Order management system
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] PWA capabilities

---

**Built with ❤️ using Angular 17 and .NET 8**
