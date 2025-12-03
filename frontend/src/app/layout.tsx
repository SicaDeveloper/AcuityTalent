import Provider from "./provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
