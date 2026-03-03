'use client'

import TableComponent from "@/components/page/TableComponent";
import { formatRupiah } from "@/app/hooks/formatRupiah";
import { TbCirclePlus, TbPencil } from "react-icons/tb";
import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import { ButtonSky, ButtonRed, ButtonSkyBorder } from "@/components/button/button";
import { ModalJabatanPegawai } from "./ModalJabatanPegawai";
import { AlertNotification, AlertQuestion } from "@/components/global/sweetalert2";
import useToast from "@/components/global/toast";
import { GetResponseFindallPegawai } from "../type";
import { useBrandingContext } from "@/provider/BrandingProvider";

const TablePegawai = () => {

    const [Data, setData] = useState<any>(null);
    const [Loading, setLoading] = useState<boolean>(true);
    const [HasError, setHasError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [ModalJabatan, setModalJabatan] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"baru" | "edit" | "">("");
    const [DataJabatan, setDataJabatan] = useState<GetResponseFindallPegawai | null>(null);

    const { branding } = useBrandingContext();
    const { toastSuccess } = useToast();

    const handleModalJabatan = (data: GetResponseFindallPegawai | null, jenis: "baru" | "edit" | "") => {
        if (ModalJabatan) {
            setDataJabatan(null);
            setModalJabatan(false);
            setJenisModal(jenis);
        } else {
            setDataJabatan(data);
            setModalJabatan(true);
            setJenisModal(jenis);
        }
    }

    useEffect(() => {
        const fetchPegawai = async () => {
            try {
                setLoading(true);
                apiFetch(`/api/v1/tpp/jabatan/detail/findall?kode_opd=${branding?.opd}&tahun=${branding?.tahun?.value}&bulan=${branding?.bulan?.value}`)
                    .then(resp => {
                        setData(resp);
                    }).catch(err => {
                        console.log(err);
                        setHasError(true);
                    })
            } catch (err) {
                console.log(err);
                setHasError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchPegawai();
    }, [FetchTrigger]);

    const HapusPegawai = async (id: number) => {
        try {
            await apiFetch(`/api/v1/tpp/jabatan/delete/${id}`, {
                method: "DELETE",
            });
            toastSuccess("anggota berhasil dihapus");
            setFetchTrigger((prev) => !prev);
        } catch (err) {
            const message = err instanceof globalThis.Error ? err.message : `${err}`;
            AlertNotification("Gagal", message, "error", 3000, true);
        }
    }

    if (Loading) {
        return (
            <h1>Loading...</h1>
        )
    } else if (HasError) {
        return (
            <h1 className="text-red-400">error saat mengambil data master pegawai</h1>
        )
    } else if (!Loading && !HasError && Data != null) {
        return (
            <>
                <ButtonSkyBorder
                    className="my-3 flex items-center gap-1"
                    onClick={() => handleModalJabatan(null, "baru")}
                >
                    <TbCirclePlus />
                    Tambah Pegawai
                </ButtonSkyBorder>
                <TableComponent className="border-yellow-500">
                    <table className="w-full">
                        <thead>
                            <tr className="text-white bg-yellow-500">
                                <th className="border-r border-b py-3 px-4 border-gray-300 w-[50px] text-center">No</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[300px] text-center">Nama Pegawai</th>
                                <th colSpan={2} className="border-r border-b py-3 px-4 border-gray-300 min-w-[100px] text-center">NIP</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Basic TPP</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[160px] text-center">No Rekeing</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[160px] text-center">No NPWP</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[160px] text-center">Pajak</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[160px] text-center">Potongan PBJS 1%</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[160px] text-center">Potongan PBJS 4%</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Jabatan</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Status Jabatan</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Eselon</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Pangkat / Golongan</th>
                                <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[100px] text-center">Kode OPD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Data != null ?
                                Data.map((item: GetResponseFindallPegawai, index: number) => (
                                    <tr key={index}>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{index + 1}</td>
                                        <td className="border py-3 px-4 border-yellow-500">{item.namaPegawai || "-"}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{item.nip || "-"}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">
                                            <div className="flex flex-col items-center justify-between gap-1">
                                                <ButtonSky
                                                    className="flex items-center gap-1"
                                                    onClick={() => handleModalJabatan(item, item?.namaJabatan ? "edit" : "baru")}
                                                >
                                                    <TbPencil />
                                                    Edit
                                                </ButtonSky>
                                                <ButtonRed
                                                    className="flex items-center gap-1"
                                                    onClick={() => AlertQuestion("HAPUS", "Hapus data pegawai yang dipilih?", "question", "Hapus", "Batal").then((resp) => {
                                                        if (resp.isConfirmed) {
                                                            HapusPegawai(item.id);
                                                        }
                                                    })}
                                                >
                                                    Hapus
                                                </ButtonRed>
                                            </div>
                                        </td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">Rp.{formatRupiah(item.basicTpp ?? 0)}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">-</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">-</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">
                                            {(() => {
                                                const pajak = Number(item.pajak);
                                                return Number.isFinite(pajak) ? `${pajak * 100}%` : "-";
                                            })()}
                                        </td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">0</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">0</td>
                                        <td className="border py-3 px-4 border-yellow-500">{item.namaJabatan || "-"}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{item.statusJabatan || "-"}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{item.eselon || "-"}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{item.pangkat || "-"} / {item.golongan || "-"}</td>
                                        <td className="border py-3 px-4 border-yellow-500 text-center">{item.kodeOpd || "-"}</td>
                                    </tr>
                                ))
                                :
                                <tr>
                                    <td colSpan={10} className="border border-yellow-500 px-6 py-4">Data Pegawai Kosong</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    {ModalJabatan &&
                        <ModalJabatanPegawai
                            isOpen={ModalJabatan}
                            onClose={() => handleModalJabatan(null, "")}
                            onSuccess={() => setFetchTrigger((prev) => !prev)}
                            Data={DataJabatan}
                            jenis={JenisModal}
                        />
                    }
                </TableComponent>
            </>
        )
    }
}

export default TablePegawai;
