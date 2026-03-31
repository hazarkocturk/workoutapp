# Authentication Guidelines

## Auth Provider

**ZORUNLU:** Tüm authentication işlemleri için **Clerk** kullanılmalıdır.

- Asla custom auth, NextAuth, Supabase Auth veya başka bir auth sistemi kullanma.
- Asla manuel JWT yönetimi veya session yönetimi yapma.
- Kullanıcı kimliği her zaman Clerk'ten alınmalıdır.

## Server-Side Auth

Server Components ve helper fonksiyonlarında `@clerk/nextjs/server` paketinden `auth()` kullan:

```ts
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  // ...
}
```

## Client-Side Auth

Client Components'ta `@clerk/nextjs` paketinden hook'ları kullan:

```ts
import { useAuth, useUser } from "@clerk/nextjs";

export function MyComponent() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  // ...
}
```

## Route Protection

Route koruması `middleware.ts` dosyasında merkezi olarak tanımlanmalıdır. Her sayfaya ayrı ayrı auth kontrolü ekleme.

```ts
// middleware.ts (proje root'unda)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

## User ID in Database Queries

- Kullanıcıya ait veriler her zaman Clerk'ten gelen `userId` ile sorgulanmalıdır.
- `userId` her zaman `string` (varchar) tipindedir — integer veya UUID değildir.
- Helper fonksiyonlar `userId` parametresini Clerk'ten alıp DB sorgularında kullanmalıdır.

```ts
// src/db/helpers/workouts.ts
export async function getWorkoutsByUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

## UI Components

Auth UI için Clerk'in hazır bileşenlerini kullan:

```tsx
import { SignIn, SignUp, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Login butonu yerleşimi
<SignedIn>
  <UserButton />
</SignedIn>
<SignedOut>
  <SignInButton />
</SignedOut>
```

## What NOT to Do

```ts
// ❌ Asla custom session yönetimi yapma
const session = cookies().get("session"); // yanlış

// ❌ Asla başka auth kütüphanesi kullanma
import { getServerSession } from "next-auth"; // yanlış

// ❌ Asla userId'yi hardcode etme veya manuel türetme
const userId = request.headers.get("x-user-id"); // yanlış

// ❌ Asla middleware olmadan her sayfaya ayrı auth kontrolü ekleme
// Her page.tsx dosyasına tekrar tekrar auth() + redirect() yazma
```
