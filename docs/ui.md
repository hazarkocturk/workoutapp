# UI Guidelines

## Component Library

**ZORUNLU:** Tüm UI bileşenleri için **shadcn/ui** kütüphanesi kullanılmalıdır.

- Asla custom component yaratma. Shadcn/ui'da mevcut olan her bileşen için onun shadcn versiyonunu kullan.
- Yeni bir bileşene ihtiyaç duyulduğunda önce `npx shadcn@latest add <component>` ile shadcn'den ekle.
- Tailwind class'larını yalnızca shadcn bileşenlerini **stilize etmek** için kullan, sıfırdan bileşen inşa etmek için değil.

## ÖNEMLİ: `asChild` Prop'u Kullanılmaz

Bu proje shadcn/ui'ın **@base-ui/react** tabanlı versiyonunu kullanır — Radix UI **değildir**. Bu nedenle bileşenler `asChild` prop'unu desteklemez.

Bir bileşeni trigger/wrapper olarak başka bir bileşene devretmek için `render` prop kullan:

```tsx
// ❌ Yanlış — asChild bu projede çalışmaz
<DialogTrigger asChild>
  <Button>Aç</Button>
</DialogTrigger>

// ✅ Doğru — render prop ile devret
<DialogTrigger render={<Button />}>
  Aç
</DialogTrigger>
```

Bu kural `DialogTrigger`, `DialogClose`, `PopoverTrigger` ve diğer tüm Base UI primitive'leri için geçerlidir.

## Date Formatting

Date gösterimi için **date-fns** kütüphanesi kullanılmalıdır.

Format standardı:

```ts
import { format } from "date-fns";

// Kullanım:
format(date, "do MMM yyyy")

// Örnekler:
// 1st Sep 2025
// 2nd Aug 2025
// 3rd Jan 2026
// 4th Jun 2024
```

Başka date format kullanma. Tüm kullanıcıya gösterilen tarihler bu formatta olmalıdır.
