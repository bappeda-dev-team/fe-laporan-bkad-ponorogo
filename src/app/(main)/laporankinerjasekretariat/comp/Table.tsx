'use client'

import TableComponent from "@/components/page/TableComponent";
import { ButtonBlackBorder, ButtonSkyBorder, ButtonRedBorder } from "@/components/button/button";
import { TbPrinter, TbCirclePlus, TbX, TbTrash, TbPencil } from "react-icons/tb";
import React, { useState, useMemo, useEffect } from "react";
import { useGet } from "@/app/hooks/useGet";
import { TimGetResponse } from "@/types/tim";
import { Target, RencanaKinerjaSekretariatResponse, IndikatorRencanaKinerja, SubKegiatanResponse, RencanaAksis } from "@/types";
import { ModalRekin } from "./ModalRekin";
import { LoadingButtonClip2 } from "@/components/global/Loading";
import { AlertQuestion, AlertNotification } from "@/components/global/sweetalert2";
import useToast from "@/components/global/toast";
import { apiFetch } from "@/lib/apiFetch";
import { formatRupiah } from "@/app/hooks/formatRupiah";
import { ModalKinerjaSekretariat } from "./ModalKinerjaSekretariat";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { useCetakSekretariat } from "../lib/useCetakSekretariat";

interface Table {
  data: TimGetResponse;
}

export const Table: React.FC<Table> = ({ data }) => {

  const [ModalRekinOpen, setModalRekinOpen] = useState<boolean>(false);
  const [ModalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [FetchTrigger, setFetchTrigger] = useState<number>(0);
  const [DataModalEdit, setDataModalEdit] = useState<any>(null);
  const [KodeTim, setKodeTim] = useState<string>("");
  const [IdProgram, setIdProgram] = useState<number>(0);

  const { toastSuccess } = useToast();

  const { branding } = useBrandingContext();

  const bulan = branding?.bulan?.value;
  const tahun = branding?.tahun?.value;

  const isReady = Number.isInteger(bulan) && Number.isInteger(tahun);

  const url = useMemo(() => {
    if (!isReady) {
      return null;
    }
    return `/api/v1/timkerjabkad/timkerja_sekretariat/${data.kode_tim}/rencana_kinerja?tahun=${tahun}&bulan=${bulan}`;
  }, [isReady, tahun, bulan]);

  const { data: DataTable, error: ErrorRekin, loading: LoadingRekin } = useGet<RencanaKinerjaSekretariatResponse[]>(
    url ?? "",
    FetchTrigger
  );
  const { cetakPdf } = useCetakSekretariat(DataTable ?? [], data.nama_tim, data.keterangan);

  // Fetch pertama kali saat sudah ready
  useEffect(() => {
    if (isReady) {
      setFetchTrigger(1);
    }
  }, [isReady]);


  const handleModalEdit = (kode_tim: string, id_program: number, data: any) => {
    if (ModalEditOpen) {
      setModalEditOpen(false);
      setKodeTim("");
      setIdProgram(0);
      setDataModalEdit(data);
    } else {
      setModalEditOpen(true);
      setKodeTim(kode_tim);
      setIdProgram(id_program);
      setDataModalEdit(data);
    }
  }

  const hapusRekin = async (id: number) => {
    await apiFetch(`/api/v1/timkerjabkad/timkerja_sekretariat/${data.kode_tim}/rencana_kinerja/${id}`, {
      method: "DELETE",
    }).then(_resp => {
      toastSuccess("Rencana Kinerja dihapus");
      setFetchTrigger((prev) => prev + 1);
    }).catch(err => {
      AlertNotification("Gagal", `${err}`, "error", 3000, true);
    })
  }

  if (!isReady) {
    return <h1>Menyiapkan periode...</h1>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between mb-2">
        <div className="flex flex-col">
          <h1 className="uppercase font-bold text-2xl">Susunan Tim: {data.nama_tim || "-"}</h1>
          <h1 className="font-medium">{data.keterangan || ""}</h1>
        </div>
        <div className="flex flex-wrap flex-col justify-center gap-1">
          <ButtonSkyBorder
            className="flex items-center gap-1"
            onClick={() => setModalRekinOpen(true)}
          >
            <TbCirclePlus />
            Tambah Rencana Kinerja
          </ButtonSkyBorder>
          <ButtonBlackBorder
            className="flex items-center gap-1"
            onClick={() =>
              cetakPdf()
            }
          >
            <TbPrinter />
            Cetak
          </ButtonBlackBorder>
        </div>
      </div>
      <TableComponent className="border-emerald-500">
        <table className="w-full">
          <thead>
            <tr className="text-white bg-emerald-500">
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[50px] text-center">No</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[300px] text-center">Rencana Kinerja</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Indikator Kinerja</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Target Tahun</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Pemilik Rencana Kinerja</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[250px] text-center">Sub Kegiatan</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Pagu Anggaran</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Realisasi Anggaran</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[300px] text-center">Rencana Aksi/Kegiatan yang Dilaksanakan</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Faktor Pendorong</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Faktor Penghambat</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Risiko Hukum</th>
              <th className="border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Rekomendasi Tindak Lanjut</th>
            </tr>
            <tr className="text-white bg-emerald-600">
              <th className="border-r border-b py-1 border-gray-300 text-center italic">1</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">2</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">3</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">4</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">5</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">6</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">7</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">8</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">9 </th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">10</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">11</th>
              <th className="border-r border-b py-1 border-gray-300 text-center italic">12</th>
              <th className="border-b py-1 border-gray-300 text-center italic">13</th>
            </tr>
          </thead>
          {LoadingRekin ?
            <tbody>
              <tr>
                <td colSpan={30} className="flex gap-1 px-6 py-4 text-blue-500">
                  <LoadingButtonClip2 />
                  Loading...
                </td>
              </tr>
            </tbody>
            :
            ErrorRekin ?
              <tbody>
                <tr>
                  <td colSpan={30} className="flex gap-1 px-6 py-4 text-red-500">
                    <TbX />
                    Error saat mendapatkan data Rencana Kinerja di tim sekretariat, jika terus berlanjut hubungi tim developer
                  </td>
                </tr>
              </tbody>
              :
              <tbody>
                {DataTable?.length === 0 ?
                  <tr>
                    <td colSpan={30} className="px-6 py-4">Data Kosong, Tambahkan Rencana Kinerja</td>
                  </tr>
                  :
                  DataTable?.map((item: RencanaKinerjaSekretariatResponse, index: number) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td rowSpan={2} className="border-b border-emerald-500 px-6 py-4 text-center">{index + 1}</td>
                        <td rowSpan={2} className="border border-emerald-500 px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {item.rencana_kinerja || "-"}
                            <ButtonRedBorder
                              className="flex items-center gap-1"
                              onClick={() => {
                                AlertQuestion("Hapus Program", "data dari kolom 9 sampai 14 akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                  if (result.isConfirmed) {
                                    hapusRekin(item.id);
                                  }
                                })
                              }}
                            >
                              <TbTrash />
                              Hapus
                            </ButtonRedBorder>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        {item.indikators ?
                          <>
                            {/* INDIKATOR */}
                            <td className="border border-emerald-500 px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {item.indikators.map((i: IndikatorRencanaKinerja, i_index: number) => (
                                  <p className="p-1" key={i_index}>
                                    {i_index + 1}. {i.nama_indikator || "-"}
                                  </p>
                                ))}
                              </div>
                            </td>
                            {/* TARGET SATUAN */}
                            <td className="border border-emerald-500 px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {item.indikators.map((i: IndikatorRencanaKinerja, i_index: number) => (
                                  i.targets.map((t: Target, t_index: number) => (
                                    <p className="p-1" key={t_index}>
                                      {i_index + 1}. {t.target || "-"} / {t.satuan || "-"}
                                    </p>
                                  ))
                                ))}
                              </div>
                            </td>
                            <td className="border border-emerald-500 px-6 py-4">{item.nama_pegawai || '-'} ({item.id_pegawai || "-"})</td>
                          </>
                          :
                          <>
                            <td className="border border-emerald-500 px-6 py-4">-</td>
                            <td className="border border-emerald-500 px-6 py-4">-</td>
                            <td className="border border-emerald-500 px-6 py-4">-</td>
                          </>
                        }
                        {item.subkegiatan ?
                          <td className="border border-emerald-500 px-6 py-4">
                            {item.subkegiatan.map((sk: SubKegiatanResponse, sk_index: number) => (
                              <p className="p-1" key={sk_index}>
                                {sk_index + 1}. ({sk.kode_subkegiatan || "-"}) {sk.nama_sub_kegiatan || "-"}
                              </p>
                            ))}
                          </td>
                          :
                          <td className="border border-emerald-500 px-6 py-4">-</td>
                        }
                        <td className="border border-emerald-500 px-6 py-4">Rp.{formatRupiah(item.pagu_anggaran || 0)}</td>
                        <td className="border border-emerald-500 px-6 py-4">Rp.{formatRupiah(item.realisasi_anggaran || 0)} <EditButton onClick={() => handleModalEdit(item.kode_tim, item.id, item)} /></td>
                        {item.rencana_aksis ?
                          <td className="border border-emerald-500 px-6 py-4">
                            <div className="flex flex-col items-center gap-1">
                              {item.rencana_aksis.map((ra: RencanaAksis, ra_index: number) => (
                                <p key={ra_index} className="p-1 border border-emerald-500 rounded-lg w-full">{ra_index + 1}. {ra.nama_rencana_aksi || "-"}</p>
                              ))}
                            </div>
                          </td>
                          :
                          <td className="border border-emerald-500 px-6 py-4">-</td>
                        }
                        <td className="border border-emerald-500 px-6 py-4">
                          <div className="flex flex-col items-center justify-center gap-2">
                            {item.faktor_pendorong || ""}
                            <EditButton onClick={() => handleModalEdit(item.kode_tim, item.id, item)} />
                          </div>
                        </td>
                        <td className="border border-emerald-500 px-6 py-4">
                          <div className="flex flex-col items-center justify-center gap-2">
                            {item.faktor_penghambat || ""}
                            <EditButton onClick={() => handleModalEdit(item.kode_tim, item.id, item)} />
                          </div>
                        </td>
                        <td className="border border-emerald-500 px-6 py-4">
                          <div className="flex flex-col items-center justify-center gap-2">
                            {item.risiko_hukum || ""}
                            <EditButton onClick={() => handleModalEdit(item.kode_tim, item.id, item)} />
                          </div>
                        </td>
                        <td className="border border-emerald-500 px-6 py-4">
                          <div className="flex flex-col items-center justify-center gap-2">
                            {item.rekomendasi_tl || ""}
                            <EditButton onClick={() => handleModalEdit(item.kode_tim, item.id, item)} />
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                }
              </tbody>
          }
        </table>
      </TableComponent>
      {ModalRekinOpen &&
        <ModalRekin
          isOpen={ModalRekinOpen}
          onClose={() => setModalRekinOpen(false)}
          onSuccess={() => setFetchTrigger((prev) => prev + 1)}
          kode_tim={data.kode_tim}
          tahun={String(tahun)}
        />
      }
      {ModalEditOpen &&
        <ModalKinerjaSekretariat
          isOpen={ModalEditOpen}
          onClose={() => setModalEditOpen((prev) => !prev)}
          onSuccess={() => setFetchTrigger((prev) => prev + 1)}
          kode_tim={KodeTim}
          id_program={IdProgram}
          Data={DataModalEdit}

        />
      }
    </>
  )
}

interface EditButton {
  onClick: () => void;
}
export const EditButton: React.FC<EditButton> = ({ onClick }) => {
  return (
    <button
      className="p-1 rounded-full border border-emerald-500 text-emerald-500 hover:bg-emerald-300 hover:text-white cursor-pointer"
      type="button"
      onClick={onClick}
    >
      <TbPencil />
    </button>
  )
}
