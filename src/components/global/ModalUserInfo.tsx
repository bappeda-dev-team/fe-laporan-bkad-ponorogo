'use client'

import { ModalComponent } from "@/components/page/ModalComponent";
import { TbUsersGroup, TbUser, TbIdBadge2 } from "react-icons/tb";
import { useBrandingContext } from "@/provider/BrandingProvider";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
}

export const ModalUserInfo: React.FC<Modal> = ({ isOpen, onClose }) => {
    const { branding } = useBrandingContext();
    const user = branding?.user;

    const getInitials = (name: string) => {
        return name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "??";
    };

    return (
        <ModalComponent isOpen={isOpen} onClose={onClose}>
            <div className="flex justify-center w-full px-10">
                <div className="w-full p-2">
                    {/* Header Modal */}
                    <div className="flex items-center justify-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-emerald-600">
                            <TbUsersGroup size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Profil Pengguna</h1>
                            <p className="text-sm text-slate-500">Detail akun yang sedang login</p>
                        </div>
                    </div>

                    {/* Profil Section (Avatar & Nama Utama) */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-green-600 to-emerald-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
                            {getInitials(user?.username || "Guest")}
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800 uppercase tracking-wide">
                            {user?.username ?? "Username Kosong"}
                        </h2>
                    </div>

                    {/* Detail Data (Pengganti Tabel) */}
                    <div className="space-y-4">
                        <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 mr-4">
                                <TbUser size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nama</p>
                                <p className="text-sm font-medium text-slate-700">{user?.firstName ?? "-"}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 mr-4">
                                <TbIdBadge2 size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">NIP / Identitas</p>
                                <p className="text-sm font-medium text-slate-700">{user?.nip ?? "-"}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400 mr-4">
                                <TbIdBadge2 size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Roles</p>
                                <p className="text-sm font-medium text-slate-700">
                                    {user?.roles.length === 0 ? 
                                        "tidak mempunyai role"
                                    :
                                        user?.roles.map((r: string, index: number) => (
                                            <span>{r || ""}, </span>
                                        ))
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Tombol Tutup */}
                    <div className="mt-8">
                        <button 
                            onClick={onClose}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </ModalComponent>
    );
}