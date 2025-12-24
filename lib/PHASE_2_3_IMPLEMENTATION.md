# Phase 2 & 3 Complete Implementation Roadmap

## Overview
This document provides a complete list of all files needed to complete Phase 2 (Core Onboarding) and Phase 3 (AI & Documents) implementations.

## STATUS: 20% Complete → TARGET: 70% Complete
**Completed Files**: 17 (Foundation + Auth API + Query Client)
**Remaining Files**: 50+ 
**Estimated Completion**: 2-3 development sessions

---

## PHASE 2: Core Onboarding (Weeks 3-4) - CRITICAL

### Priority 1: Authentication UI Pages

#### 1. Signup Page (PROMPT 1.1)
**File**: `app/(auth)/signup/page.tsx`
```typescript
// - Email/password input fields
// - Google OAuth button
// - Form validation with React Hook Form + Zod
// - Loading states
// - Error handling & display
// - Link to login page
// - Dark theme with accent #6366f1
```

#### 2. Login Page (PROMPT 1.2)
**File**: `app/(auth)/login/page.tsx`
```typescript
// - Email input (for magic link)
// - Password input (toggle)
// - Google OAuth button
// - "Send Magic Link" option
// - Loading states
// - Error messages
// - Link to signup page
```

#### 3. AuthContext Provider
**File**: `lib/auth-context.tsx`
```typescript
// - useAuth() hook
// - getCurrentUser() function
// - logout() function
// - isLoading, isAuthenticated states
// - useEffect to check auth on mount
```

#### 4. Middleware
**File**: `lib/middleware.ts`
```typescript
// - Redirect unauthenticated users to /login
// - Redirect authenticated users away from /auth/*
// - Protect /dashboard/* routes
```

---

### Priority 2: Designer Dashboard (PROMPT 2.1)

#### 5. Dashboard Root Layout
**File**: `app/(dashboard)/layout.tsx`
```typescript
// - Collapsible sidebar navigation
// - Header with user avatar dropdown
// - Logo/branding section
// - Nav items: Dashboard, Clients, Templates, Settings
// - Logout button
// - Dark theme styling
// - Responsive mobile menu
```

#### 6. Dashboard Page
**File**: `app/(dashboard)/page.tsx`
```typescript
// - Welcome message with designer name
// - Quick stats cards (Total Clients, Active Projects, etc)
// - Recent activity feed
// - Quick action buttons (Add Client, View Projects)
// - 7-day pipeline summary
```

---

### Priority 3: Client Pipeline (PROMPT 2.2)

#### 7. Client Pipeline Page
**File**: `app/(dashboard)/clients/pipeline/page.tsx`
```typescript
// - 7-day pipeline visualization
// - Client cards showing:
//   - Avatar/initials
//   - Client name
//   - Project type
//   - Progress bar (0-100%)
//   - Status badge
// - Drag-to-move clients between days
// - Quick action buttons (View, Remind, Complete)
// - Filter by status
```

---

### Priority 4: Client Management (PROMPT 2.3)

#### 8. Clients List Page
**File**: `app/(dashboard)/clients/page.tsx`
```typescript
// - Table/card view of all clients
// - Search bar
// - Filters (Status, Date, Project Type)
// - "Add Client" button modal
// - Sort options
// - Pagination
```

#### 9. Client Detail Page
**File**: `app/(dashboard)/clients/[id]/page.tsx`
```typescript
// - Client info (name, email, company)
// - Project details
// - Current step in onboarding process
// - Assets collected
// - Scope document status
// - Quick actions
```

#### 10. Add Client Modal Component
**File**: `components/clients/add-client-modal.tsx`
```typescript
// - Form inputs: name, email, company, project type
// - Validation
// - Submit to API
// - Close on success
```

---

### Priority 5: Client API Routes

#### 11. Clients API - GET/POST
**File**: `app/api/clients/route.ts`
```typescript
// GET: List all clients with filtering
// POST: Create new client
// Query params: status, search, limit, offset
// Returns: Client[] | { id, name, email, status, progress }
```

#### 12. Client Detail API - GET/PUT
**File**: `app/api/clients/[id]/route.ts`
```typescript
// GET: Get single client by ID
// PUT: Update client details
// DELETE: Soft delete client
```

---

### Priority 6: Profile Settings (PROMPT 1.3)

#### 13. Settings Page
**File**: `app/(dashboard)/settings/page.tsx`
```typescript
// - Designer profile section:
//   - Company name input
//   - Logo upload (Supabase)
//   - Brand colors (hex picker)
//   - Business details
// - Live preview of client portal with branding
// - Save button
// - Delete account option
```

---

## PHASE 3: AI & Documents (Weeks 5-6) - BUILD ON TOP OF PHASE 2

### Priority 7: Questionnaire System

#### 14. Questionnaire Template Builder Page
**File**: `app/(dashboard)/templates/page.tsx`
```typescript
// - List of questionnaire templates
// - Create new template button
// - Edit/delete options
// - Preview template
// - Mark as default
```

#### 15. Template Editor Page
**File**: `app/(dashboard)/templates/[id]/editor/page.tsx`
```typescript
// - Drag-and-drop question builder
// - Add/remove questions
// - Question types: Text, Multiple Choice, Long Text
// - Save template
// - Reorder questions
```

#### 16. Client Questionnaire Form Page
**File**: `app/portal/[clientId]/questionnaire/page.tsx`
```typescript
// - Display questionnaire (branded with designer's colors)
// - Form inputs for answers
// - Progress bar
// - Save and continue
// - Submit answers
// - Show "Thank you" message
```

#### 17. Questionnaire API Routes
**File**: `app/api/questionnaires/route.ts`
**File**: `app/api/questionnaires/[id]/submit/route.ts`

---

### Priority 8: AI Response Analysis

#### 18. AI Analysis API
**File**: `app/api/ai/analyze/route.ts`
```typescript
// POST: Analyze questionnaire responses
// - Call lib/claude.ts analyzeResponses()
// - Store analysis in database
// - Generate follow-up questions
// - Return: { analysis, followUpQuestions, suggestedScope }
```

#### 19. Analysis Results Page
**File**: `app/(dashboard)/clients/[id]/analysis/page.tsx`
```typescript
// - Display AI analysis of responses
// - Follow-up questions needed
// - Suggested scope points
// - Button to generate scope document
```

---

### Priority 9: Scope Document Generation

#### 20. Scope Generator API
**File**: `app/api/documents/scope/generate/route.ts`
```typescript
// POST: Generate scope document
// - Call lib/claude.ts generateScopeDocument()
// - Input: questionnaire responses, designer settings
// - Output: markdown scope document
// - Store in database
// - Return: { documentId, content }
```

#### 21. Scope Editor Page (PROMPT 5.2)
**File**: `app/(dashboard)/documents/[id]/editor/page.tsx`
```typescript
// - Rich text editor (TipTap or similar)
// - Markdown preview
// - Formatting toolbar
// - "Regenerate Section" button (calls Claude for section)
// - Side-by-side PDF preview
// - Version history
// - Save changes
```

#### 22. Scope Document API
**File**: `app/api/documents/[id]/route.ts`
**File**: `app/api/documents/[id]/save/route.ts`
**File**: `app/api/documents/[id]/export/pdf/route.ts`

---

### Priority 10: Document Actions

#### 23. Send for Signature API (PROMPT 5.3)
**File**: `app/api/documents/[id]/sign/route.ts`
```typescript
// POST: Send document for signature
// - Convert to PDF
// - Upload to DocuSign/PandaDoc
// - Send signature request
// - Track status
```

#### 24. DocuSign Webhook Handler
**File**: `app/api/webhooks/docusign/route.ts`
```typescript
// POST: Handle DocuSign signature events
// - Signature completed event
// - Update database status
// - Trigger invoice creation
// - Send confirmation email
```

---

## Library Files Needed

### 25. Theme Provider
**File**: `lib/theme-provider.tsx`
```typescript
// - Toggle dark/light mode
// - localStorage persistence
// - useTheme hook
```

### 26. Session Provider  
**File**: `lib/session-provider.tsx`
```typescript
// - Wrap app with Supabase session context
// - Handle session persistence
// - Check auth on app load
```

### 27. Prisma Client
**File**: `lib/prisma.ts`
```typescript
// - Initialize Prisma client
// - Singleton pattern to avoid multiple instances
```

### 28. API Helper Functions
**File**: `lib/api-utils.ts`
```typescript
// - getAuthenticatedUser()
// - createResponse()
// - handleError()
// - validateRequest()
```

### 29. Validation Schemas (Zod)
**File**: `lib/validations.ts`
```typescript
// - clientSchema
// - questionnaireSchema
// - authSchema
// - etc.
```

### 30. Email Templates
**File**: `lib/email-templates/`
```typescript
// - welcomeEmail.tsx
// - questionnaireLink.tsx
// - scopeDocumentReady.tsx
// - signatureRequest.tsx
// - etc.
```

---

## Component Files Needed

### Components/Layout
- `components/layout/sidebar.tsx`
- - `components/layout/header.tsx`
  - - `components/layout/footer.tsx`
   
    - ### Components/Clients
    - - `components/clients/client-card.tsx`
      - - `components/clients/client-table.tsx`
        - - `components/clients/add-client-form.tsx`
         
          - ### Components/Questionnaire
          - - `components/questionnaire/question-editor.tsx`
            - - `components/questionnaire/question-input.tsx`
             
              - ### Components/Documents
              - - `components/documents/editor.tsx`
                - - `components/documents/preview.tsx`
                 
                  - ### Components/UI (if using shadcn/ui)
                  - - `components/ui/button.tsx`
                    - - `components/ui/input.tsx`
                      - - `components/ui/card.tsx`
                        - - `components/ui/dialog.tsx`
                          - - `components/ui/tabs.tsx`
                            - - `components/ui/form.tsx`
                              - - `components/ui/table.tsx`
                                - - etc.
                                 
                                  - ---

                                  ## Database Migrations Needed

                                  ### Phase 2 Migrations
                                  - [ ] Create questionnaire_templates table
                                  - [ ] - [ ] Create questionnaire_responses table
                                  - [ ] - [ ] Create questionnaire_analysis table
                                 
                                  - [ ] ### Phase 3 Migrations
                                  - [ ] - [ ] Create scope_documents table
                                  - [ ] - [ ] Create document_versions table
                                  - [ ] - [ ] Add signature_status to scope_documents
                                 
                                  - [ ] ---
                                 
                                  - [ ] ## API Routes Summary
                                 
                                  - [ ] **Authentication**
                                  - [ ] - ✅ POST /api/auth (signup, login, logout)
                                 
                                  - [ ] **Clients**
                                  - [ ] - ⏳ GET /api/clients
                                  - [ ] - ⏳ POST /api/clients
                                  - [ ] - ⏳ GET /api/clients/[id]
                                  - [ ] - ⏳ PUT /api/clients/[id]
                                  - [ ] - ⏳ DELETE /api/clients/[id]
                                 
                                  - [ ] **Questionnaires**
                                  - [ ] - ⏳ GET /api/questionnaires
                                  - [ ] - ⏳ POST /api/questionnaires
                                  - [ ] - ⏳ POST /api/questionnaires/[id]/submit
                                 
                                  - [ ] **AI & Analysis**
                                  - [ ] - ⏳ POST /api/ai/analyze
                                 
                                  - [ ] **Documents**
                                  - [ ] - ⏳ POST /api/documents/scope/generate
                                  - [ ] - ⏳ GET /api/documents/[id]
                                  - [ ] - ⏳ PUT /api/documents/[id]/save
                                  - [ ] - ⏳ GET /api/documents/[id]/export/pdf
                                  - [ ] - ⏳ POST /api/documents/[id]/sign
                                 
                                  - [ ] **Webhooks**
                                  - [ ] - ⏳ POST /api/webhooks/docusign
                                 
                                  - [ ] ---
                                 
                                  - [ ] ## Implementation Order
                                 
                                  - [ ] ### Batch 1: Authentication UI (1-2 hours)
                                  - [ ] 1. Signup page
                                  - [ ] 2. Login page
                                  - [ ] 3. AuthContext provider
                                  - [ ] 4. Middleware protection
                                 
                                  - [ ] ### Batch 2: Dashboard Layout (1-2 hours)
                                  - [ ] 5. Dashboard layout
                                  - [ ] 6. Dashboard page
                                  - [ ] 7. Header & Sidebar components
                                 
                                  - [ ] ### Batch 3: Client Management (2-3 hours)
                                  - [ ] 8. Clients page
                                  - [ ] 9. Client detail page
                                  - [ ] 10. Client API routes
                                  - [ ] 11. Add client modal
                                 
                                  - [ ] ### Batch 4: Client Pipeline (1-2 hours)
                                  - [ ] 12. Pipeline page
                                  - [ ] 13. Client cards
                                 
                                  - [ ] ### Batch 5: Settings (1 hour)
                                  - [ ] 14. Settings page with branding
                                 
                                  - [ ] ### Batch 6: Questionnaires (2-3 hours)
                                  - [ ] 15. Templates page
                                  - [ ] 16. Template editor
                                  - [ ] 17. Client questionnaire form
                                  - [ ] 18. Questionnaire APIs
                                 
                                  - [ ] ### Batch 7: AI Analysis (1-2 hours)
                                  - [ ] 19. Analysis API
                                  - [ ] 20. Analysis results page
                                 
                                  - [ ] ### Batch 8: Scope Documents (2-3 hours)
                                  - [ ] 21. Scope generator API
                                  - [ ] 22. Scope editor page
                                  - [ ] 23. Document APIs
                                 
                                  - [ ] ### Batch 9: E-Signature (1-2 hours)
                                  - [ ] 24. Sign API
                                  - [ ] 25. DocuSign webhook handler
                                 
                                  - [ ] ### Batch 10: Support Files (1-2 hours)
                                  - [ ] 26-30. Library files, components, validations
                                 
                                  - [ ] ---
                                 
                                  - [ ] ## Testing Checklist
                                 
                                  - [ ] After implementation of each section:
                                  - [ ] - [ ] Form validation works
                                  - [ ] - [ ] API calls return correct data
                                  - [ ] - [ ] Errors handled gracefully
                                  - [ ] - [ ] Dark theme applied correctly
                                  - [ ] - [ ] Responsive on mobile
                                  - [ ] - [ ] Navigation works
                                  - [ ] - [ ] Auth guards work
                                  - [ ] - [ ] Database operations work
                                 
                                  - [ ] ---
                                 
                                  - [ ] ## Next Steps
                                 
                                  - [ ] 1. Create all authentication UI pages
                                  - [ ] 2. Build dashboard layout
                                  - [ ] 3. Implement client management
                                  - [ ] 4. Add questionnaire system
                                  - [ ] 5. Connect AI analysis
                                  - [ ] 6. Build scope editor
                                  - [ ] 7. Add e-signature flow
                                 
                                  - [ ] Total estimated time: 15-20 hours for complete Phase 2 + 3 implementation
