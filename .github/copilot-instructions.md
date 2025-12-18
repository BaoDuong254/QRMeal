# Copilot Instructions – NestCommerce

You are GitHub Copilot Chat. These instructions override default behavior. Apply them to ALL code generation, refactors, and explanations.

## Project Structure
```
ecommerce/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── stores/      # Zustand state management
│   │   └── types/       # TypeScript types
│   └── vite.config.ts
├── server/              # NestJS backend
│   ├── src/
│   │   ├── routes/      # Feature modules (auth, product, order, etc.)
│   │   ├── shared/      # Shared utilities, guards, pipes
│   │   └── i18n/        # Internationalization (en, vi)
│   ├── prisma/          # Prisma ORM
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── scripts/         # Database seed scripts
└── postman/             # API collections
```

## CRITICAL RULES (Always follow)

- NEVER use `any`
- ALWAYS validate input using Zod DTOs
- ALWAYS check `deletedAt: null` (soft delete)
- ALWAYS include audit fields: `createdById`, `updatedById`
- Controllers MUST be thin (no business logic)
- Services contain business logic
- Repo layer for DB access only
- Permission check is REQUIRED for protected routes

## Backend Rules

- NestJS + TypeScript strict
- Modular structure (one module per feature)
- Use Dependency Injection
- Use Prisma ORM
- Use Prisma from `server/generated/prisma/`
- Use absolute imports from `src/*`
- Select only required fields in queries
- Throw NestJS HTTP exceptions (NotFound, BadRequest, Forbidden)
- Use Zod DTOs (`nestjs-zod`) for all inputs

## Database Rules

- Soft delete is mandatory (`deletedAt`)
- Never hard delete records
- Use translation tables for multi-language content
- Avoid N+1 queries

## Frontend Rules

- React 19 + TypeScript strict
- Use Zustand for global state
- Axios with interceptors
- Tailwind only (no custom CSS unless required)

## DO NOT

- Do not put business logic in controllers or components
- Do not expose sensitive fields (password, tokens)
- Do not use relative imports across modules
- Do not bypass permission checks
- Do not ignore TypeScript errors

## Related Instructions
- See `.github/instructions/nestjs.instructions.md` for NestJS patterns
- See `.github/instructions/reactjs.instructions.md` for React patterns
- See `.github/instructions/typescript-5-es2022.instructions.md` for TypeScript rules
