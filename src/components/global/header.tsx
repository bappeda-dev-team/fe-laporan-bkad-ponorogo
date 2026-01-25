'use client'

import { useState, useEffect } from "react";
import { ButtonBlackBorder } from "../button/button";
import { usePathname } from "next/navigation";
import Select from 'react-select';
import { TbUser } from "react-icons/tb";
import { setCookies } from "@/lib/cookies";
import { AlertNotification } from "./sweetalert2";
import useToast from "./toast";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { ModalUserInfo } from "./ModalUserInfo";

interface OptionType {
  label: string;
  value: number;
}
interface OptionTypeString {
  label: string;
  value: string;
}

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);
  const [ModalUser, setModalUser] = useState<boolean>(false);

  const [showManriskKinerjaDropdown, setShowManriskKinerjaDropdown] = useState<boolean>(false);
  const [Tahun, setTahun] = useState<OptionType | null>(null);
  const [Bulan, setBulan] = useState<OptionType | null>(null);

  const [SelectedOpd, setSelectedOpd] = useState<OptionTypeString | null>(null);

  const url = usePathname();
  const { loadingBranding, branding } = useBrandingContext();
  const { toastInfo } = useToast();

  //handle header scroll animation 
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible = prevScrollPos > currentScrollPos;

      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
      setShowManriskKinerjaDropdown(false);
    };
    window.addEventListener('scroll', handleScroll);

    // Close mobile menu when URL changes
    setIsMobileMenuOpen(false);

    // Clean up the event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, url]);

  // handle close menu kinerja w/ esc button
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowManriskKinerjaDropdown(false);
        setIsMobileMenuOpen(false);
      }
    };

    // Tambahkan event listener saat komponen di-mount
    document.addEventListener('keydown', handleEscapeKey);

    // Hapus event listener saat komponen di-unmount (cleanup)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (branding?.tahun) {
      setTahun(branding?.tahun);
    }
    if (branding?.bulan) {
      if (branding?.bulan.value === null || branding?.bulan.value === undefined) {
        setBulan(null);
      } else {
        setBulan(branding?.bulan);
      }
    }
  }, [branding])

  const OptionTahun = [
    { label: "2019", value: 2019 },
    { label: "2020", value: 2020 },
    { label: "2021", value: 2021 },
    { label: "2022", value: 2022 },
    { label: "2023", value: 2023 },
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 },
    { label: "2027", value: 2027 },
    { label: "2028", value: 2028 },
    { label: "2029", value: 2029 },
    { label: "2030", value: 2030 },
  ];
  const OptionBulan = [
    { label: "Januari", value: 1 },
    { label: "Februari", value: 2 },
    { label: "Maret", value: 3 },
    { label: "April", value: 4 },
    { label: "Mei", value: 5 },
    { label: "Juni", value: 6 },
    { label: "Juli", value: 7 },
    { label: "Agustus", value: 8 },
    { label: "September", value: 9 },
    { label: "Oktober", value: 10 },
    { label: "November", value: 11 },
    { label: "Desember", value: 12 },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowManriskKinerjaDropdown(false);
  };

  return (
    <>
      <nav className={`inset-x-1 m-1 ml-2 bg-white border border-emerald-200 shadow-lg shadow-slate-400 rounded-xl fixed left-0 top-0 z-50 transition duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="mx-auto flex justify-between gap-5 items-center px-4 py-3">
          <div className="flex flex-wrap justify-start gap-5">
            <ButtonBlackBorder
              disabled={loadingBranding}
              className="flex items-center gap-1"
              onClick={() => {
                setModalUser(true);
              }}
            >
              {loadingBranding ? 
                <>
                  Loading...
                </>
                :
                <>
                  <TbUser />
                  Info User
                </>
              }
            </ButtonBlackBorder>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Select
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '10px',
                  minWidth: '157.562px',
                  maxWidth: '160px',
                  minHeight: '20px'
                })
              }}
              onChange={(option) => setBulan(option)}
              placeholder="Pilih Bulan"
              options={OptionBulan}
              value={Bulan}
              isSearchable
            />
            <Select
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '10px',
                  minWidth: '157.562px',
                  maxWidth: '160px',
                  minHeight: '20px'
                })
              }}
              onChange={(option) => setTahun(option)}
              placeholder="Pilih Tahun"
              options={OptionTahun}
              value={Tahun}
              isSearchable
            />
            <button
              className="border py-1 px-3 rounded-lg border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white cursor-pointer"
              onClick={() => {
                setCookies("tahun", Tahun);
                setCookies("bulan", Bulan);
                AlertNotification("Tahun & Bulan", "Berhasil mengubah Tahun & Bulan", "success", 2000, true);
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              Aktifkan
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`focus:outline-none cursor-pointer rounded-lg p-1 border border-emerald-500 text-emerald-500 hover:text-emerald-500 hover:bg-white`}
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <div className={`lg:hidden rounded-lg border border-gray-300 bg-white py-2 mt-1 absolute top-full left-0 w-full shadow-md transition ease-in-out duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Select
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '10px',
                  minWidth: '157.562px',
                  maxWidth: '160px',
                  minHeight: '20px'
                })
              }}
              onChange={(option) => setBulan(option)}
              placeholder="Pilih Bulan"
              options={OptionBulan}
              value={Bulan}
              isSearchable
            />
            <Select
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '10px',
                  minWidth: '157.562px',
                  maxWidth: '160px',
                  minHeight: '20px'
                })
              }}
              onChange={(option) => setTahun(option)}
              placeholder="Pilih Tahun"
              options={OptionTahun}
              value={Tahun}
              isSearchable
            />
            <button
              className="border py-1 px-3 rounded-lg border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white cursor-pointer"
              onClick={() => {
                setCookies("tahun", Tahun);
                setCookies("bulan", Bulan);
                AlertNotification("Tahun & Bulan", "Berhasil mengubah Tahun & Bulan", "success", 2000, true);
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              Aktifkan
            </button>
          </div>
        </div>
      </nav>
      {ModalUser &&
        <ModalUserInfo
          isOpen={ModalUser}
          onClose={() => setModalUser(false)}
        />
      }
    </>
  );
};
