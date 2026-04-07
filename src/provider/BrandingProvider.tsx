'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { getCookies } from "@/lib/cookies";
import { OptionType } from "../types";

interface BrandingContextType {
    loadingBranding: boolean;
    branding: {
        nama_app: string;
        nama_pemda: string;
        logo: string;
        api_url: string;
        tahun: OptionType | null;
        bulan: OptionType | null;
        opd: string;
        namaOpd: string;
        namaOpdSingkatan: string;
        user: UserInfo | null;
    };
}

interface UserInfo {
    username: string;
    firstName: string;
    kode_opd: string;
    nip: string;
    roles: string[];
    namaTim: string;
    kodeTim: string;
    namaJabatanTim: string;
}

const appName = process.env.NEXT_PUBLIC_NAMA_APLIKASI || "";
const clientName = process.env.NEXT_PUBLIC_NAMA_PEMDA || "";
const logo = process.env.NEXT_PUBLIC_LOGO_URL || "";
const api_url = process.env.NEXT_PUBLIC_API_URL || "";
const opd = process.env.NEXT_PUBLIC_KODE_OPD || "";
const namaOpd = process.env.NEXT_PUBLIC_NAMA_OPD || "";
const namaOpdSingkatan = process.env.NEXT_PUBLIC_NAMA_OPD_SINGKATAN || "";

const USER_CACHE_KEY = "branding-user";

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
    const [Tahun, setTahun] = useState<OptionType | null>(null);
    const [Bulan, setBulan] = useState<OptionType | null>(null);
    const [User, setUser] = useState<UserInfo | null>(null);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        // === 1. load tahun & bulan dari cookie ===
        const tahunCookie = getCookies("tahun");
        const bulanCookie = getCookies("bulan");

        if (tahunCookie) {
            try {
                setTahun(JSON.parse(tahunCookie));
            } catch {
                setTahun(null);
            }
        }

        if (bulanCookie) {
            try {
                setBulan(JSON.parse(bulanCookie));
            } catch {
                setBulan(null);
            }
        }

        // === 2. load user dari cache ===
        const cachedUser = localStorage.getItem(USER_CACHE_KEY);
        if (cachedUser) {
            try {
                setUser(JSON.parse(cachedUser));
                setLoading(false);
                return; // ⛔ STOP DI SINI
            } catch {
                localStorage.removeItem(USER_CACHE_KEY);
            }
        }

        // === 3. fetch user HANYA jika belum ada ===
        const sessionId = localStorage.getItem("timkerja-sessionId");
        if (!sessionId) {
            setLoading(false);
            return;
        }

        fetch(`/user-info`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Session-Id": sessionId,
            },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Unauthorized");
                const result = await res.json();
                setUser(result);
                localStorage.setItem(USER_CACHE_KEY, JSON.stringify(result));
            })
            .catch(() => {
                // ❗ jangan spam alert
                setUser(null);
                localStorage.removeItem(USER_CACHE_KEY);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <BrandingContext.Provider
            value={{
                loadingBranding: Loading,
                branding: {
                    nama_app: appName,
                    nama_pemda: clientName,
                    logo,
                    api_url,
                    tahun: Tahun,
                    bulan: Bulan,
                    opd,
                    namaOpd,
                    namaOpdSingkatan,
                    user: User,
                },
            }}
        >
            {children}
        </BrandingContext.Provider>
    );
}

export function useBrandingContext() {
    const context = useContext(BrandingContext);
    if (!context) {
        throw new Error("useBrandingContext must be used within BrandingProvider");
    }
    return context;
}
