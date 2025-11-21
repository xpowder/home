// app/layout.tsx

import HeaderClientWrapper from "./components/HeaderClientWrapper";
import { Providers } from "./components/oAuthProviders";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <HeaderClientWrapper />
      <Providers>{children}</Providers>
    </div>
  );
}
