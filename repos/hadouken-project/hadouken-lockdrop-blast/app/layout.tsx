import { ThemeRegistry } from "@/styles/theme";
import "@/public/favicon.ico";
import { WagmiProvider } from "@/connection";

export const metadata = {
  title: "Hadouken - Blast",
  description: "Hadouken - Lockdrop Blast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider>
          <ThemeRegistry options={{ key: "mui" }}>{children}</ThemeRegistry>
        </WagmiProvider>
      </body>
    </html>
  );
}
