'use client'

import TableComponent from "@/components/page/TableComponent";
import { ButtonRedBorder, ButtonSkyBorder, ButtonGreenBorder, ButtonBlackBorder } from "@/components/button/button";
import { TbX, TbTrash, TbUpload, TbCircleFilled, TbCirclePlus, TbPencil, TbPrinter } from "react-icons/tb";
import { AlertNotification, AlertQuestion } from "@/components/global/sweetalert2";
import { formatRupiah } from "@/app/hooks/formatRupiah";
import useToast from "@/components/global/toast";
import { TimGetResponse } from "@/types/tim";
import React, { useState, useEffect, useMemo } from "react";
import { ModalProgramUnggulan } from "./ModalProgramUnggulan";
import { useGet } from "@/app/hooks/useGet";
import { IndikatorRencanaKinerja, KinerjaKonkerGetResponse, Pelaksanas, PetugasTims, PohonKinerjaKonker, RencanaKinerjaPelaksanas, Target } from "@/types";
import { LoadingButtonClip2 } from "@/components/global/Loading";
import { ModalUpload } from "./ModalUpload";
import { ModalPelaksana } from "./ModalPelaksana";
import { apiFetch } from "@/lib/apiFetch";
import { ModalKinerjaKonker } from "./ModalKinerjaKonker";
import { useCetakKonker } from "../lib/useCetakKonker";
import { useBrandingContext } from "@/provider/BrandingProvider";

interface Table {
  data: TimGetResponse;
}

export const Table: React.FC<Table> = ({ data }) => {

  const [ModalProgram, setModalProgram] = useState<boolean>(false);
  const [ModalBuktiOpen, setModalBuktiOpen] = useState<boolean>(false);
  const [ModalPelaksanaOpen, setModalPelaksanaOpen] = useState<boolean>(false);
  const [DataTim, setDataTim] = useState<TimGetResponse | null>(null);
  const [DataPohon, setDataPohon] = useState<PohonKinerjaKonker | null>(null);

  const [ModalKonkerOpen, setModalKonkerOpen] = useState<boolean>(false);
  const [DataModal, setDataModal] = useState<any>(null);
  const [KodeTim, setKodeTim] = useState<string>("");
  const [IdProgram, setIdProgram] = useState<number>(0);

  const [FetchTrigger, setFetchTrigger] = useState<number>(0);
  const [_LoadingHapus, setLoadingHapus] = useState<boolean>(false);
  const { toastSuccess } = useToast();

  const { branding } = useBrandingContext();


  const bulan = branding?.bulan?.value ?? null;
  const tahun = branding?.tahun?.value ?? null;

  const isReady = Number.isInteger(bulan) && Number.isInteger(tahun);

  const url = useMemo(() => {
    if (!isReady) {
      return null;
    }
    return `/api/v1/timkerjabkad/timkerja/${data.kode_tim}/program_unggulan?tahun=${tahun}&bulan=${bulan}`;
  }, [isReady, tahun, bulan]);

  const { data: DataTable, error: ErrorProgram,
    loading: LoadingProgram } =
    useGet<KinerjaKonkerGetResponse[]>(url ?? "", FetchTrigger)

  // Fetch pertama kali saat sudah ready
  useEffect(() => {
    if (isReady) {
      setFetchTrigger(1);
    }
  }, [isReady]);

  const { cetakPdf } = useCetakKonker(DataTable ?? [], data.nama_tim, data.keterangan);

  const handleModalProgram = (data: TimGetResponse | null) => {
    if (ModalProgram) {
      setModalProgram(false);
      setDataTim(null);
    } else {
      setModalProgram(true);
      setDataTim(data);
    }
  }
  const handleModalPelaksana = (data: PohonKinerjaKonker | null, id_program: number) => {
    if (ModalPelaksanaOpen) {
      setModalPelaksanaOpen(false);
      setDataPohon(null);
      setIdProgram(0);
    } else {
      setModalPelaksanaOpen(true);
      setDataPohon(data);
      setIdProgram(id_program);
    }
  }
  const handleModalKonker = (data: any, kode_tim: string, id_program: number) => {
    if (ModalKonkerOpen) {
      setModalKonkerOpen(false);
      setDataModal(null);
      setKodeTim(kode_tim);
      setIdProgram(id_program);
    } else {
      setModalKonkerOpen(true);
      setDataModal(data);
      setKodeTim(kode_tim);
      setIdProgram(id_program);
    }
  }

  const hapusProgram = async (id: number) => {
    await apiFetch(`/api/v1/timkerjabkad/timkerja/${data.kode_tim}/program_unggulan/${id}`, {
      method: "DELETE",
    }).then(resp => {
      toastSuccess("Program dihapus");
      setFetchTrigger((prev) => prev + 1);
    }).catch(err => {
      AlertNotification("Gagal", `${err}`, "error", 3000, true);
    })
  }
  const hapusPetugasTim = async (id: number) => {
    try {
      setLoadingHapus(true);
      await apiFetch(`/api/v1/timkerjabkad/petugas_tim/${id}`, {
        method: "DELETE",
      }).then(resp => {
        toastSuccess("petugas dihapus");
        setFetchTrigger((prev) => prev + 1);
      }).catch(err => {
        AlertNotification("Gagal", `${err}`, "error", 3000, true);
      })
    } catch (err) {
      console.log(err);
      AlertNotification("GAGAL", `${err}`, "error", 3000, true);
    } finally {
      setLoadingHapus(false);
    }
  }

  if (!isReady) {
    return <h1>Menyiapkan periode...</h1>;
  }


  return (
    <>
      <div className="flex flex-wrap items-center justify-between mb-1">
        <div className="flex items-start gap-1 mb-1">
          <TbCircleFilled className="mt-2 text-blue-500" />
          <div className="flex flex-col">
            <h1 className="uppercase font-bold text-2xl">Susunan Tim: {data.nama_tim || "-"}</h1>
            <h1 className="font-medium">{data.keterangan || "-"}</h1>
          </div>
        </div>
        <div className="flex flex-wrap flex-col justify-center gap-1">
          <ButtonGreenBorder
            className="flex items-center gap-1"
            onClick={() => handleModalProgram(data)}
          >
            <TbCirclePlus />
            Tambah Program Unggulan
          </ButtonGreenBorder>
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
      <TableComponent className="border-blue-500">
        <table className="w-full">
          <thead>
            <tr className="text-white bg-blue-500">
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[50px] text-center">No</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[300px] text-center">Nama Program Unggulan</th>
              <th className="border-r border-b py-2 px-3 border-gray-300 min-w-[300px] text-center">Pohon Kinerja</th>
              <th className="border-r border-b py-2 px-3 border-gray-300 min-w-[300px] text-center">Indikator Kinerja</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Target Tahun</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Perangkat Daerah</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Pelaksana</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[300px] text-center">Petugas Tim</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[300px] text-center">Rencana Kinerja</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[300px] text-center">Sub Kegiatan</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Pagu Anggaran</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Realisasi Anggaran</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Rencana Aksi</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[250px] text-center">Analisa Pendapatan Sumber Dana Pendapatan</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[250px] text-center">Catatan Realisasi Anggaran</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[250px] text-center">Catatan Penataan Usaha Keuangan</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[250px] text-center">Catatan Pelaporan Keuangan</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[250px] text-center">Catatan Pelaporan Aset</th>
              <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[250px] text-center">Rekomendasi Tindak Lanjut</th>
              <th className="border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Bukti Pendukung</th>
            </tr>
            <tr className="text-white bg-blue-600">
              <th className="border-r border-b py-1 border-gray-300 text-center">1</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">2</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">3</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">4</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">5</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">6</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">7</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">8</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">9 </th>
              <th className="border-r border-b py-1 border-gray-300 text-center">10</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">11</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">12</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">13</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">14</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">15</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">16</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">17</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">18</th>
              <th className="border-r border-b py-1 border-gray-300 text-center">19</th>
              <th className="border-b py-1 border-gray-300 text-center">20</th>
            </tr>
          </thead>
          {LoadingProgram ?
            <tbody>
              <tr>
                <td colSpan={30} className="flex gap-1 px-6 py-4 text-blue-500">
                  <LoadingButtonClip2 />
                  Loading...
                </td>
              </tr>
            </tbody>
            :
            ErrorProgram ?
              <tbody>
                <tr>
                  <td colSpan={30} className="flex gap-1 px-6 py-4 text-red-500">
                    <TbX />
                    Error saat mendapatkan data program unggulan, jika terus berlanjut hubungi tim developer
                  </td>
                </tr>
              </tbody>
              :
              <tbody>
                {DataTable?.length === 0 ?
                  <tr>
                    <td colSpan={30} className="px-6 py-4">Data Kosong, Tambahkan Program Unggulan</td>
                  </tr>
                  :
                  DataTable?.map((item: KinerjaKonkerGetResponse, index: number) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td rowSpan={item.pohon_kinerja?.length > 0 ? item.pohon_kinerja.length + 1 : 2} className="border-b border-blue-500 px-6 py-4 text-center">{index + 1}</td>
                        <td rowSpan={item.pohon_kinerja?.length > 0 ? item.pohon_kinerja.length + 1 : 2} className="border border-blue-500 px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <p className="border-b py-1 mb-1 border-blue-500">{item.program_unggulan || "-"}</p>
                            <ButtonRedBorder
                              className="flex items-center gap-1"
                              onClick={() => {
                                AlertQuestion("Hapus Program", "data dari kolom 9 sampai 14 akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                  if (result.isConfirmed) {
                                    hapusProgram(item.id);
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
                      {item.pohon_kinerja.length > 0 ?
                        item.pohon_kinerja.map((p: PohonKinerjaKonker, p_index: number) => (
                          <tr key={p_index}>
                            <td className="border border-blue-500 px-6 py-4">
                              <p key={p_index}>{p.nama_pohon || "-"}</p>
                            </td>
                            {p.indikator ?
                              <>
                                {/* INDIKATOR */}
                                <td className="border border-blue-500 px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                    {p.indikator.map((i: IndikatorRencanaKinerja, i_index: number) => (
                                      <p className="p-1" key={i_index}>
                                        {i_index + 1}. {i.nama_indikator || "-"}
                                      </p>
                                    ))}
                                  </div>
                                </td>
                                {/* TARGET SATUAN */}
                                <td className="border border-blue-500 px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                    {p.indikator.map((i: IndikatorRencanaKinerja, i_index: number) => (
                                      i.targets.map((t: Target, t_index: number) => (
                                        <p className="p-1" key={t_index}>
                                          {i_index + 1}. {t.target || "-"} / {t.satuan || "-"}
                                        </p>
                                      ))
                                    ))}
                                  </div>
                                </td>
                              </>
                              :
                              <>
                                <td className="border border-blue-500 px-6 py-4">-</td>
                                <td className="border border-blue-500 px-6 py-4">-</td>
                              </>
                            }
                            <td className="border border-blue-500 px-6 py-4">{p.nama_opd || "-"}</td>
                            <td className="border border-blue-500 px-6 py-4">
                              {p.pelaksanas.length > 0 ?
                                p.pelaksanas.map((pl: Pelaksanas, pelaksanas_index: number) => (
                                  <p key={pelaksanas_index} className="my-2 border p-1 rounded-lg">{pl.nama_pelaksana || "-"} ({pl.nip_pelaksana || "-"})</p>
                                ))
                                :
                                "-"
                              }
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              {/* PELAKSANA */}
                              <div className="flex flex-col justify-center gap-2">
                                {item.petugas_tims ?
                                  item.petugas_tims.map((pt: PetugasTims, pt_index) => (
                                    <div key={pt_index} className="px-1 flex items-center gap-1 border rounded-lg">
                                      <p>{pt.nama_pegawai || "-"}</p>
                                      <ButtonRedBorder
                                        className="p-1"
                                        onClick={() => AlertQuestion("Hapus Petugas", `hapus ${pt.nama_pegawai || "petugas"} dari program unggulan`, "question", "Hapus", "Batal").then((resp) => {
                                          if (resp.isConfirmed) {
                                            hapusPetugasTim(pt.id);
                                          }
                                        })}
                                      >
                                        <TbTrash />
                                      </ButtonRedBorder>
                                    </div>
                                  ))
                                  :
                                  <p>-</p>
                                }
                                <ButtonSkyBorder
                                  className="flex items-center gap-2"
                                  onClick={() => handleModalPelaksana(p, item.id_program_unggulan)}
                                >
                                  <TbPencil />
                                  Petugas Tim
                                </ButtonSkyBorder>
                              </div>
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              {p.pelaksanas.length > 0 ?
                                p.pelaksanas.map((pl: Pelaksanas, pl_index: number) => (
                                  <React.Fragment key={pl_index}>
                                    {pl.rencana_kinerjas.length > 0 ?
                                      pl.rencana_kinerjas?.map((rk: RencanaKinerjaPelaksanas, rk_index: number) => (
                                        <p key={rk_index} className="my-2 border p-1 rounded-lg">{rk.rencana_kinerja || "-"}</p>
                                      ))
                                      :
                                      <p className="italic text-red-400">Rencana Kinerja belum di buat</p>
                                    }
                                  </React.Fragment>
                                ))
                                :
                                "-"
                              }
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              {p.pelaksanas.length > 0 ?
                                p.pelaksanas.map((pl: Pelaksanas, pl_index: number) => (
                                  <React.Fragment key={pl_index}>
                                    {pl.rencana_kinerjas.length > 0 ?
                                      pl.rencana_kinerjas?.map((rk: RencanaKinerjaPelaksanas, rk_index: number) => (
                                        <p key={rk_index} className="my-2 border p-1 rounded-lg">({rk.kode_subkegiatan || "-"}) - {rk.nama_subkegiatan || "-"}</p>
                                      ))
                                      :
                                      <p className="italic text-red-400">Sub Kegiatan belum di pilih</p>
                                    }
                                  </React.Fragment>
                                ))
                                :
                                "-"
                              }
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              {p.pelaksanas.length > 0 ?
                                p.pelaksanas.map((pl: Pelaksanas, pl_index: number) => (
                                  <React.Fragment key={pl_index}>
                                    {pl.rencana_kinerjas.length > 0 ?
                                      pl.rencana_kinerjas?.map((rk: RencanaKinerjaPelaksanas, rk_index: number) => (
                                        <p key={rk_index} className="my-2 border p-1 rounded-lg">Rp.{formatRupiah(rk.pagu || 0)}</p>
                                      ))
                                      :
                                      "Rp.0"
                                    }
                                  </React.Fragment>
                                ))
                                :
                                "-"
                              }
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              <div className="flex flex-col items-center justify-center gap-1">
                                Rp.{formatRupiah(p.realisasi_anggaran || 0)}
                                <EditButton onClick={() => handleModalKonker(p, item.kode_tim, item.id_program_unggulan)} />
                              </div>
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              <div className="flex flex-col items-center justify-center gap-1">
                                {p.rencana_aksi || ""}
                                <EditButton onClick={() => handleModalKonker(p, item.kode_tim, item.id_program_unggulan)} />
                              </div>
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              <div className="flex flex-col items-center justify-center gap-1">
                                analisa pendapatan sumber dana pendapatan
                                <EditButton onClick={() => handleModalKonker(p, item.kode_tim, item.id_program_unggulan)} />
                              </div>
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              <div className="flex flex-col items-center justify-center gap-1">
                                catatan realisasi anggaran
                                <EditButton onClick={() => handleModalKonker(p, item.kode_tim, item.id_program_unggulan)} />
                              </div>
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              <div className="flex flex-col items-center justify-center gap-1">
                                catatan penataan usaha keuangan
                                <EditButton onClick={() => handleModalKonker(p, item.kode_tim, item.id_program_unggulan)} />
                              </div>
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              <div className="flex flex-col items-center justify-center gap-1">
                                 catatan pelaporan keuangan
                                <EditButton onClick={() => handleModalKonker(p, item.kode_tim, item.id_program_unggulan)} />
                              </div>
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              <div className="flex flex-col items-center justify-center gap-1">
                                catatan pelaporan aset
                                <EditButton onClick={() => handleModalKonker(p, item.kode_tim, item.id_program_unggulan)} />
                              </div>
                            </td>
                            <td className="border border-blue-500 px-6 py-4">
                              <div className="flex flex-col items-center justify-center gap-1">
                                {p.rekomendasi_tl || ""}
                                <EditButton onClick={() => handleModalKonker(p, item.kode_tim, item.id_program_unggulan)} />
                              </div>
                            </td>
                            <td className="border-b border-blue-500 px-6 py-4">
                              <div className="flex justify-center">
                                <ButtonSkyBorder
                                  className="flex items-center gap-2"
                                  onClick={() => setModalBuktiOpen(true)}
                                >
                                  <TbUpload />
                                  Upload
                                </ButtonSkyBorder>
                              </div>
                            </td>
                          </tr>
                        ))
                        :
                        <tr>
                          {Array.from({ length: 15 }, (_, index) => (
                            <td key={index}
                              className={`border ${index === 11 ? 'border-b' : 'border'} border-blue-500 px-6 py-4`}
                            >
                              -
                            </td>
                          ))}
                        </tr>
                      }
                    </React.Fragment>
                  ))
                }
              </tbody>
          }
        </table>
      </TableComponent>
      {ModalProgram &&
        <ModalProgramUnggulan
          isOpen={ModalProgram}
          onClose={() => handleModalProgram(null)}
          onSuccess={() => setFetchTrigger((prev) => prev + 1)}
          Data={DataTim}
          tahun={String(tahun)}
        />
      }
      {ModalBuktiOpen &&
        <ModalUpload
          isOpen={ModalBuktiOpen}
          onClose={() => setModalBuktiOpen(false)}
          onSuccess={() => setFetchTrigger((prev) => prev + 1)}
        />
      }
      {ModalPelaksanaOpen &&
        <ModalPelaksana
          isOpen={ModalPelaksanaOpen}
          onClose={() => handleModalPelaksana(null, 0)}
          onSuccess={() => setFetchTrigger((prev) => prev + 1)}
          kode_tim={data.kode_tim}
          id_program={IdProgram}
          Data={DataPohon}
        />
      }
      {ModalKonkerOpen &&
        <ModalKinerjaKonker
          isOpen={ModalKonkerOpen}
          onClose={() => handleModalKonker(null, "", 0)}
          onSuccess={() => setFetchTrigger((prev) => prev + 1)}
          kode_tim={KodeTim}
          Data={DataModal}
          id_program={IdProgram}
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
