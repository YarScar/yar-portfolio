export const metadata = {
  title: "Portfolio API",
  description: "Showcase Express - Portfolio API with Next.js Routes + Database",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}
