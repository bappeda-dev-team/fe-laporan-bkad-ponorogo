'use client'

import TableComponent from "@/components/page/TableComponent";
import { useState } from "react";
import { useGet } from "@/app/hooks/useGet";
import { JabatanGetResponse } from "@/types/tim";
import { ButtonSky, ButtonRedBorder, ButtonSkyBorder } from "@/components/button/button";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";
import { ModalJabatanTim } from "./ModalJabatanTim";
import { AlertQuestion, AlertNotification } from "@/components/global/sweetalert2";
import { apiFetch } from "@/lib/apiFetch";

const TableJabatan = () => {

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"baru" | "edit" | "">("");
    const [DataModal, setDataModal] = useState<JabatanGetResponse | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<number>(0);

    const { data, loading, error, message } = useGet<JabatanGetResponse[]>('/api/v1/timkerjabkad/jabatantim', FetchTrigger);

    const handleModal = (jenis: "baru" | "edit" | "", data: JabatanGetResponse | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal("");
            setDataModal(null);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataModal(data);
        }
    }

    const HapusJabatan = async (id: number) => {
        await apiFetch(`/api/v1/timkerjabkad/jabatantim/${id}`, {
            method: "DELETE",
        }).then(_resp => {
            // toastSuccess("anggota berhasil dihapus");
            AlertNotification("Berhasil", "Anggota Berhasil Dihapus", "success", 3000, true);
            setFetchTrigger((prev) => prev + 1);
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        })
    }

    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    } else if (error) {
        return (
            <h1>{message || "-"}</h1>
        )
    }

    return (
        <>
            <ButtonSky className="my-2 flex items-center gap-1" onClick={() => handleModal("baru", null)}>
                <TbCirclePlus />
                Tambah Jabatan
            </ButtonSky>
            <TableComponent className="border-yellow-500">
                <table className="w-full">
                    <thead>
                        <tr className="text-white bg-yellow-500">
                            <th className="border-r border-b py-3 px-4 border-gray-300 w-[50px] text-center">No</th>
                            <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Nama Jabatan</th>
                            <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[100px] text-center">Level Jabatan</th>
                            <th className="border-r border-b py-3 px-4 border-gray-300 w-[150px] text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data != null ?
                            data
                                .slice()
                                .sort((a, b) => a.level_jabatan - b.level_jabatan)
                                .map((item: JabatanGetResponse, index: number) => (
                                    <tr key={index}>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{index + 1}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{item.nama_jabatan || "-"}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{item.level_jabatan || "-"}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">
                                            <div className="flex flex-col gap-2 justify-center items-center">
                                                <ButtonSkyBorder
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => handleModal("edit", item)}
                                                >
                                                    <TbPencil />
                                                    Edit
                                                </ButtonSkyBorder>
                                                <ButtonRedBorder
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => AlertQuestion("Hapus", `Hapus Jenis Jabatan ?`, "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            HapusJabatan(item.id);
                                                        }
                                                    })
                                                    }
                                                >
                                                    <TbTrash />
                                                    Hapus
                                                </ButtonRedBorder>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            :
                            <tr>
                                <td colSpan={3} className="border border-yellow-500 px-6 py-4">Data Jabatan Kosong / Belum di Tambahkan</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </TableComponent>
            {ModalOpen &&
                <ModalJabatanTim
                    isOpen={ModalOpen}
                    onClose={() => handleModal("", null)}
                    onSuccess={() => setFetchTrigger((prev) => prev + 1)}
                    data={DataModal}
                    jenis={JenisModal}
                />
            }
        </>
    )
}

export default TableJabatan;
