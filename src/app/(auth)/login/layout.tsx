'use client'

import Image from 'next/image';
import { useBrandingContext } from "@/provider/BrandingProvider";

export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { branding } = useBrandingContext();
    const logo = branding.logo || "";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                {/* Header */}
                <div className="mb-6 flex flex-col items-center gap-2">
                    <Image
                        src={logo || "https://cdnkk.zeabur.app/api/cdn/download/images/universal.png"}
                        alt="logo"
                        width={96}
                        height={96}
                        className="mb-2"
                    />

                    <h1 className="text-2xl font-extrabold text-center uppercase tracking-wide">
                        {branding.nama_app}
                    </h1>
                </div>

                {/* Form / children */}
                <div className="space-y-4">
                    {children}
                </div>

            </div>
        </div>
    );
}
