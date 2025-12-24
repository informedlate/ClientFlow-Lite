# ClientFlow Lite

> A full-stack web application for designers to manage client relationships, collect requirements via AI-powered questionnaires, generate scope documents, and handle payments.
>
> ## 🎯 Project Overview
>
> ClientFlow Lite is a comprehensive business management platform specifically designed for design professionals. It streamlines the entire client onboarding and project management workflow from initial contact through final delivery.
>
> ### Core Features
>
> - **User Authentication & Management** - Secure designer account management
> - - **AI-Powered Questionnaires** - Dynamically generate client requirement questionnaires
>   - - **Smart Scope Documents** - Auto-generate professional scope documents from client responses
>     - - **Asset Collection Portal** - Centralized asset collection and management
>       - - **Payment Processing** - Integrated payment handling and invoicing
>         - - **Email Automation** - Automated client communications and notifications
>           - - **Client Portal** - Unified interface for client interactions
>            
>             - ## 🏗️ Tech Stack
>            
>             - ### Frontend
>             - - **Framework:** Next.js 14+ (React)
>               - - **Language:** TypeScript
> - **Styling:** Tailwind CSS
> - - **State Management:** React Query / Zustand
>   - - **Form Handling:** React Hook Form + Zod
>     - - **Deployment:** Vercel
>      
>       - ### Backend
>       - - **Framework:** Next.js API Routes / Node.js Express
>         - - **Language:** TypeScript
>           - - **Database:** Supabase (PostgreSQL)
>             - - **Authentication:** Supabase Auth / JWT
>               - - **ORM:** Prisma
>                 - - **Validation:** Zod
>                  
>                   - ### External Services
>                   - - **AI:** Claude API (Anthropic)
>                     - - **Email:** Resend
>                       - - **Payments:** Stripe
>                         - - **Document Signing:** DocuSign
>                           - - **Version Control:** GitHub
>                            
>                             - ## 📁 Project Structure
>                            
>                             - ```
>                               ClientFlow-Lite/
>                               ├── frontend/                 # Next.js frontend application
>                               │   ├── app/                 # App router pages
>                               │   ├── components/          # Reusable React components
>                               │   ├── lib/                 # Utilities and helpers
>                               │   ├── styles/              # Global styles
>                               │   └── public/              # Static assets
>                               ├── backend/                 # Express backend (if needed)
>                               │   ├── routes/              # API routes
>                               │   ├── controllers/         # Route handlers
>                               │   ├── models/              # Database models
>                               │   └── middleware/          # Custom middleware
>                               ├── database/                # Database setup
>                               │   ├── migrations/          # Prisma migrations
>                               │   ├── schema.prisma        # Prisma schema
>                               │   └── seeds/               # Database seeds
>                               ├── docs/                    # Documentation
>                               │   ├── SETUP.md            # Installation guide
>                               │   ├── API.md              # API documentation
>                               │   └── ARCHITECTURE.md     # Architecture overview
>                               └── package.json            # Root package configuration
>                               ```
>
> ## 🚀 Quick Start
>
> ### Prerequisites
> - Node.js 18+
> - - npm or yarn
>   - - Git
>     - - Supabase account
>       - - Stripe account
>         - - Resend account
>           - - Claude API key
>            
>             - ### Installation
>            
>             - 1. **Clone the repository**
>               2. ```bash
>                  git clone https://github.com/informedlate/ClientFlow-Lite.git
>                  cd ClientFlow-Lite
>                  ```
>
> 2. **Install dependencies**
> 3. ```bash
>    npm install
>    # or
>    yarn install
>    ```
>
> 3. **Configure environment variables**
> 4. ```bash
>    cp .env.example .env.local
>    # Edit .env.local with your API keys and credentials
>    ```
>
> 4. **Setup database**
> 5. ```bash
>    npx prisma migrate dev
>    npx prisma db seed
>    ```
>
> 5. **Run development server**
> 6. ```bash
>    npm run dev
>    # or
>    yarn dev
>    ```
>
> 6. **Open browser**
> 7. ```
>    http://localhost:3000
>    ```
>
> ## 📖 Documentation
>
> - [Complete Setup Guide](docs/SETUP.md)
> - - [API Reference](docs/API.md)
>   - - [Architecture Overview](docs/ARCHITECTURE.md)
>     - - [Database Schema](docs/DATABASE.md)
>      
>       - ## 🔄 Development Phases
>      
>       - ### Phase 1: Foundation (Weeks 1-2)
>       - - Project setup and configuration
>         - - Authentication system
> - Basic UI components
> - - Database schema
>  
>   - ### Phase 2: Core Onboarding (Weeks 3-4)
>   - - Designer dashboard
>     - - Client management
>       - - Questionnaire templates
>         - - Initial email setup
>          
>           - ### Phase 3: AI & Documents (Weeks 5-6)
>           - - Claude API integration
>             - - Dynamic questionnaire generation
>               - - Scope document generator
>                 - - Asset collection portal
>                  
>                   - ### Phase 4: Payments & Contracts (Weeks 7-8)
>                   - - Stripe integration
>                     - - Invoice generation
>                       - - DocuSign integration
>                         - - Email automation
>                          
>                           - ### Phase 5: Polish & Launch (Weeks 9-10)
>                           - - UI/UX refinement
>                             - - Performance optimization
>                               - - Security audit
>                                 - - Production deployment
>                                  
>                                   - ## 📚 API Endpoints
>                                  
>                                   - See [API Documentation](docs/API.md) for full endpoint reference.
>                                  
>                                   - ### Key Endpoints
> - `GET/POST /api/auth/*` - Authentication
> - - `GET/POST /api/designers/*` - Designer management
>   - - `GET/POST /api/clients/*` - Client management
>     - - `GET/POST /api/questionnaires/*` - Questionnaire management
>       - - `GET/POST /api/scope-documents/*` - Scope document generation
>         - - `GET/POST /api/invoices/*` - Invoice management
>           - - `POST /api/payments/*` - Payment processing
>            
>             - ## 🔐 Security
>            
>             - - Environment variables for sensitive data
>               - - JWT token-based authentication
>                 - - Role-based access control (RBAC)
>                   - - HTTPS/TLS encryption
>                     - - SQL injection protection via Prisma ORM
>                       - - CSRF token validation
>                         - - Input validation and sanitization
>                          
>                           - ## 🧪 Testing
>                          
>                           - ```bash
>                             # Run unit tests
>                             npm run test
>
>                             # Run integration tests
>                             npm run test:integration
>
>                             # Run e2e tests
>                             npm run test:e2e
>
>                             # Generate coverage report
>                             npm run test:coverage
>                             ```
>
> ## 📦 Deployment
>
> ### Frontend (Vercel)
> ```bash
> npm run build
> npm run start
> # or use Vercel CLI
> vercel deploy
> ```
>
> ### Backend
> - Option 1: Continue using Vercel for API routes
> - - Option 2: Deploy Express to Railway/Render
>  
>   - See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.
>  
>   - ## 🤝 Contributing
>  
>   - 1. Create a feature branch (`git checkout -b feature/amazing-feature`)
>     2. 2. Commit your changes (`git commit -m 'Add amazing feature'`)
>        3. 3. Push to the branch (`git push origin feature/amazing-feature`)
>           4. 4. Open a Pull Request
>             
>              5. ## 📝 License
>             
>              6. This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.
>             
>              7. ## 👤 Author
>
> Created by Chris DiMarco
>
> ## 🆘 Support
>
> For support, open an issue on GitHub or contact support@clientflow.app
>
> ## 🗺️ Roadmap
>
> - [ ] Mobile app (React Native)
> - [ ] - [ ] Advanced analytics dashboard
> - [ ] - [ ] Automated contract generation
> - [ ] - [ ] Multi-currency support
> - [ ] - [ ] Team collaboration features
> - [ ] - [ ] White-label options
> - [ ] - [ ] Integration marketplace
>
> - [ ] ---
>
> - [ ] **Last Updated:** December 2024
> - [ ] **Status:** In Development
> - [ ] 
