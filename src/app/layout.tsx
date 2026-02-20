import { Poppins } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { BrandingProvider } from "@/provider/BrandingProvider";
import ToastProvider from "@/components/global/toastProvider";

const font = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
});

const logo = process.env.NEXT_PUBLIC_LOGO_URL;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <title>Laporan Kinerja</title>
                <meta name="description" content="Laporan" />
                <link
                    rel="icon"
                    href={logo}
                />
            </head>
            <body
                className={`${font.className} antialiased bg-white`}
            >
                <div>
                    <NextTopLoader color="orange" />
                    <BrandingProvider>
                        {children}
                    </BrandingProvider>
                    <ToastProvider />
                </div>
            </body>
        </html>
    );
}
