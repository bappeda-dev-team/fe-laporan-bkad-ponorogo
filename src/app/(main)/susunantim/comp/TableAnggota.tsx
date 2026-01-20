'use client'

import { useState } from "react";
import TableComponent from "@/components/page/TableComponent";
import { AnggotaGetResponse, TimGetResponse } from "@/types/tim";
import {
    ButtonSkyBorder,
    ButtonRedBorder,
    ButtonGreenBorder,
    ButtonBlackBorder
} from "@/components/button/button";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { ModalAnggota } from "./ModalAnggota";
import { ModalTim } from "./ModalTim";
import { ModalCloneSusunanTim } from "./ModalCloneSusunanTim";
import { AlertNotification, AlertQuestion } from "@/components/global/sweetalert2";
import { apiFetch } from "@/lib/apiFetch";

interface Props {
    data: TimGetResponse;
    onSuccess: () => void;
}

export const TableAnggota: React.FC<Props> = ({ data, onSuccess }) => {
    // --- modal state ---
    const [anggotaOpen, setAnggotaOpen] = useState(false);
    const [timOpen, setTimOpen] = useState(false);
    const [cloneOpen, setCloneOpen] = useState(false);

    // --- modal data ---
    const [anggotaData, setAnggotaData] = useState<any>(null);
    const [jenisAnggota, setJenisAnggota] = useState<"baru" | "edit">("baru");

    // --- handlers ---
    const openAnggotaBaru = () => {
        setJenisAnggota("baru");
        setAnggotaData(null);
        setAnggotaOpen(true);
    };

    const openEditTim = () => {
        setTimOpen(true);
    };

    const hapusTim = async (id: number) => {
        try {
            await apiFetch(`/api/v1/timkerjabkad/timkerja/${id}`, { method: "DELETE" });
            AlertNotification("Berhasil", "Tim berhasil dihapus", "success", 3000, true);
            onSuccess();
        } catch (err) {
            AlertNotification("Gagal", String(err), "error", 3000, true);
        }
    };

    const hapusAnggota = async (id: number) => {
        try {
            await apiFetch(`/api/v1/timkerjabkad/susunantim/${id}`, { method: "DELETE" });
            AlertNotification("Berhasil", "Anggota berhasil dihapus", "success", 3000, true);
            onSuccess();
        } catch (err) {
            AlertNotification("Gagal", String(err), "error", 3000, true);
        }
    };


    const handleHapusTim = async (id: number, namaTim: string) => {
        const result = await AlertQuestion(
            "Hapus Anggota",
            `Tim ${namaTim} akan terhapus bersama seluruh anggota`,
            "warning",
            "Hapus",
            "Batal"
        );

        if (!result.isConfirmed) return;

        try {
            await hapusTim(id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleHapusAnggota = async (id: number, nama: string) => {
        const result = await AlertQuestion(
            "Hapus Anggota",
            `Hapus ${nama}?`,
            "warning",
            "Hapus",
            "Batal"
        );

        if (!result.isConfirmed) return;

        try {
            await hapusAnggota(id);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={`flex flex-col p-2 border-2 rounded-lg ${data.is_sekretariat ? "border-emerald-500" : "border-blue-500"}`}>
            {/* ===== HEADER ===== */}
            <div className="flex flex-wrap items-center justify-between mb-2">
                <div>
                    <h1 className="uppercase font-bold text-2xl">
                        Susunan Tim: {data.nama_tim || "-"}
                    </h1>
                    <p className="font-medium">
                        {data.is_sekretariat ? "Tim Sekretariat - " : ""}
                        {data.keterangan || ""}
                    </p>

                    {data.susunan_tims?.length > 0 &&
                        <ButtonBlackBorder
                            className="mt-2 flex items-center gap-1"
                            onClick={() => setCloneOpen(true)}
                        >
                            Clone Susunan Tim
                        </ButtonBlackBorder>
                    }
                </div>

                <div className="flex flex-wrap gap-2">
                    <ButtonGreenBorder onClick={openAnggotaBaru}>
                        <TbCirclePlus /> Tambah Anggota
                    </ButtonGreenBorder>

                    <ButtonSkyBorder onClick={openEditTim}>
                        <TbPencil /> Edit Tim
                    </ButtonSkyBorder>

                    <ButtonRedBorder
                        onClick={() => handleHapusTim(data.id, data.nama_tim)}
                    >
                        <TbTrash /> Hapus Tim
                    </ButtonRedBorder>
                </div>
            </div>

            {/* ===== TABLE ===== */}
            <TableComponent className={`${data.is_sekretariat ? "border-emerald-500" : "border-blue-500"}`}>
                <table className="w-full">
                    <thead>
                        <tr className={`text-white ${data.is_sekretariat ? "bg-emerald-500" : "bg-blue-500"}`}>
                            <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Nama</th>
                            <th className="border-r border-b py-2 px-3 border-gray-300 min-w-[200px] text-center">NIP</th>
                            <th className="border-r border-b py-2 px-3 border-gray-300 min-w-[200px] text-center">Jabatan Dalam Tim</th>
                            <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Keterangan</th>
                            <th className="border-b py-3 px-4 border-gray-300 min-w-[100px] text-center">Aksi</th>
                        </tr>

                        {/* ===== NOMOR KOLOM ===== */}
                        <tr className={`text-white ${data.is_sekretariat ? "bg-emerald-600" : "bg-blue-600"} `}>
                            <th className="border-r border-b py-1 border-gray-300 text-center">1</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">2</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">3</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">4</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">5</th>
                            <th className="border-b py-1 border-gray-300 text-center">6</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.susunan_tims?.length ? (
                            data.susunan_tims
                                .slice()
                                .sort((a, b) => a.level_jabatan - b.level_jabatan)
                                .map((item: AnggotaGetResponse, i: number) => (
                                    <tr key={item.id}>
                                        <td className={`border-b ${data.is_sekretariat ? "border-emerald-500" : "border-blue-500"} px-6 py-4 text-center`}>{i + 1}</td>
                                        <td className={`border ${data.is_sekretariat ? "border-emerald-500" : "border-blue-500"} px-6 py-4`}>{item.nama_pegawai}</td>
                                        <td className={`border ${data.is_sekretariat ? "border-emerald-500" : "border-blue-500"} px-6 py-4 text-center`}>{item.nip}</td>
                                        <td className={`border ${data.is_sekretariat ? "border-emerald-500" : "border-blue-500"} px-6 py-4 text-center`}>{item.nama_jabatan}</td>
                                        <td className={`border ${data.is_sekretariat ? "border-emerald-500" : "border-blue-500"} px-6 py-4`}>{item.keterangan || "-"}</td>
                                        <td className={`border ${data.is_sekretariat ? "border-emerald-500" : "border-blue-500"} px-6 py-4`}>
                                            <ButtonRedBorder
                                                className="flex items-center gap-1 w-full"
                                                onClick={() => handleHapusAnggota(item.id, item.nama_pegawai)}
                                            >
                                                <TbTrash /> Hapus
                                            </ButtonRedBorder>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="border border-emerald-500 px-6 py-4">Data Anggota Kosong</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </TableComponent>

            {/* ===== MODALS ===== */}
            {anggotaOpen && (
                <ModalAnggota
                    isOpen
                    onClose={() => setAnggotaOpen(false)}
                    jenis={jenisAnggota}
                    kode_tim={data.kode_tim}
                    onSuccess={onSuccess}
                    data={anggotaData}
                />
            )}

            {timOpen && (
                <ModalTim
                    isOpen
                    jenis="edit"
                    data={data}
                    tahun={data.tahun}
                    onClose={() => setTimOpen(false)}
                    onSuccess={onSuccess}
                />
            )}

            {cloneOpen && (
                <ModalCloneSusunanTim
                    isOpen
                    kodeTim={data.kode_tim}
                    bulan={data.bulan}
                    tahun={data.tahun}
                    onClose={() => setCloneOpen(false)}
                    onSuccess={onSuccess}
                />
            )}
        </div>
    );
};
