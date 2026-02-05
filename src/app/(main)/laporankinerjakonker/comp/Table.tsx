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

  const Dummy = [
    {
      "id": 1,
      "kode_tim": "TIM-001",
      "id_program_unggulan": 1,
      "program_unggulan": "Pembangunan / Revitalisasi Embung",
      "tahun": "2026",
      "kode_opd": "OPD-01",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 2,
      "kode_tim": "TIM-002",
      "id_program_unggulan": 2,
      "program_unggulan": "Penguatan Ketahanan Pangan",
      "tahun": "2026",
      "kode_opd": "OPD-01",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 3,
      "kode_tim": "TIM-003",
      "id_program_unggulan": 3,
      "program_unggulan": "Pengembangan & pengelolaan sistem irigasi partisipatif",
      "tahun": "2026",
      "kode_opd": "OPD-01",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 4,
      "kode_tim": "TIM-004",
      "id_program_unggulan": 4,
      "program_unggulan": "Menuju Kabupaten Organik",
      "tahun": "2026",
      "kode_opd": "OPD-01",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 5,
      "kode_tim": "TIM-005",
      "id_program_unggulan": 5,
      "program_unggulan": "Melanjutkan pembangunan Monumen Reog dan Museum Peradaban",
      "tahun": "2026",
      "kode_opd": "OPD-02",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 6,
      "kode_tim": "TIM-006",
      "id_program_unggulan": 6,
      "program_unggulan": "Ponorogo Kota Festival (menyelenggarakan event/event skala nasional enam kali dalam setahun)",
      "tahun": "2026",
      "kode_opd": "OPD-02",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 7,
      "kode_tim": "TIM-007",
      "id_program_unggulan": 7,
      "program_unggulan": "Pengembangan sarana prasarana olahraga (sirkuit, stadion, dll)",
      "tahun": "2026",
      "kode_opd": "OPD-02",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 8,
      "kode_tim": "TIM-008",
      "id_program_unggulan": 8,
      "program_unggulan": "Membangun ekosistem pariwisata",
      "tahun": "2026",
      "kode_opd": "OPD-02",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 9,
      "kode_tim": "TIM-009",
      "id_program_unggulan": 9,
      "program_unggulan": "Kemudahan dan promosi investasi",
      "tahun": "2026",
      "kode_opd": "OPD-03",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 10,
      "kode_tim": "TIM-010",
      "id_program_unggulan": 10,
      "program_unggulan": "Program Pertanian Terpadu",
      "tahun": "2026",
      "kode_opd": "OPD-01",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 11,
      "kode_tim": "TIM-011",
      "id_program_unggulan": 11,
      "program_unggulan": "Cadangan Pangan",
      "tahun": "2026",
      "kode_opd": "OPD-01",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 12,
      "kode_tim": "TIM-012",
      "id_program_unggulan": 12,
      "program_unggulan": "Penguatan Daya Saing Produk",
      "tahun": "2026",
      "kode_opd": "OPD-03",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 13,
      "kode_tim": "TIM-013",
      "id_program_unggulan": 13,
      "program_unggulan": "Pengembangan wisata Religi",
      "tahun": "2026",
      "kode_opd": "OPD-02",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 14,
      "kode_tim": "TIM-014",
      "id_program_unggulan": 14,
      "program_unggulan": "Pengembangan Destinasi Wisata Unggulan",
      "tahun": "2026",
      "kode_opd": "OPD-02",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 15,
      "kode_tim": "TIM-015",
      "id_program_unggulan": 15,
      "program_unggulan": "Menuju PAD 1 triliun",
      "tahun": "2026",
      "kode_opd": "OPD-04",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 16,
      "kode_tim": "TIM-016",
      "id_program_unggulan": 16,
      "program_unggulan": "Pemberdayaan UMKM dan Koperasi",
      "tahun": "2026",
      "kode_opd": "OPD-03",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 17,
      "kode_tim": "TIM-017",
      "id_program_unggulan": 17,
      "program_unggulan": "Irigasi Air Tanah Dalam (Sumur Dalam)",
      "tahun": "2026",
      "kode_opd": "OPD-01",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 18,
      "kode_tim": "TIM-018",
      "id_program_unggulan": 18,
      "program_unggulan": "Penguatan dan Perluasan Angkatan Kerja",
      "tahun": "2026",
      "kode_opd": "OPD-05",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 19,
      "kode_tim": "TIM-019",
      "id_program_unggulan": 19,
      "program_unggulan": "Tatakelola Keuangan Daerah",
      "tahun": "2026",
      "kode_opd": "OPD-04",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 20,
      "kode_tim": "TIM-020",
      "id_program_unggulan": 20,
      "program_unggulan": "Tatakelola Perencanaan Pembangunan",
      "tahun": "2026",
      "kode_opd": "OPD-06",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 21,
      "kode_tim": "TIM-021",
      "id_program_unggulan": 21,
      "program_unggulan": "Percepatan Pembangunan Infrastruktur Jalan dan Wilayah",
      "tahun": "2026",
      "kode_opd": "OPD-07",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 22,
      "kode_tim": "TIM-022",
      "id_program_unggulan": 22,
      "program_unggulan": "Peningkatan Kualitas Lingkungan Hidup",
      "tahun": "2026",
      "kode_opd": "OPD-08",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 23,
      "kode_tim": "TIM-023",
      "id_program_unggulan": 23,
      "program_unggulan": "Melanjutkan penataan kota untuk menciptakan pusat ekonomi baru",
      "tahun": "2026",
      "kode_opd": "OPD-07",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 24,
      "kode_tim": "TIM-024",
      "id_program_unggulan": 24,
      "program_unggulan": "Resiliensi/ketahanan terhadap bencana dan perubahan iklim",
      "tahun": "2026",
      "kode_opd": "OPD-09",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 25,
      "kode_tim": "TIM-025",
      "id_program_unggulan": 25,
      "program_unggulan": "Mewujudkan Ponorogo sebagai Smart City",
      "tahun": "2026",
      "kode_opd": "OPD-10",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 26,
      "kode_tim": "TIM-026",
      "id_program_unggulan": 26,
      "program_unggulan": "Melanjutkan program dana RT",
      "tahun": "2026",
      "kode_opd": "OPD-11",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 27,
      "kode_tim": "TIM-027",
      "id_program_unggulan": 27,
      "program_unggulan": "Mendorong Desa Ramah Perempuan, anak dan disabilitas",
      "tahun": "2026",
      "kode_opd": "OPD-11",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 28,
      "kode_tim": "TIM-028",
      "id_program_unggulan": 28,
      "program_unggulan": "Penguatan, Pemberdayaan dan Perlindungan Perempuan dan Anak",
      "tahun": "2026",
      "kode_opd": "OPD-12",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 29,
      "kode_tim": "TIM-029",
      "id_program_unggulan": 29,
      "program_unggulan": "Perpustakaan Digital",
      "tahun": "2026",
      "kode_opd": "OPD-13",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 30,
      "kode_tim": "TIM-030",
      "id_program_unggulan": 30,
      "program_unggulan": "Peningkatan mutu pendidikan berbasis agama",
      "tahun": "2026",
      "kode_opd": "OPD-14",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 31,
      "kode_tim": "TIM-031",
      "id_program_unggulan": 31,
      "program_unggulan": "Peningkatan Muatan Lokal Program Pendidikan",
      "tahun": "2026",
      "kode_opd": "OPD-14",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 32,
      "kode_tim": "TIM-032",
      "id_program_unggulan": 32,
      "program_unggulan": "Peningkatan Kualitas Sarana Prasana Pendidikan",
      "tahun": "2026",
      "kode_opd": "OPD-14",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 33,
      "kode_tim": "TIM-033",
      "id_program_unggulan": 33,
      "program_unggulan": "Pendidikan Kesetaraan",
      "tahun": "2026",
      "kode_opd": "OPD-14",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 34,
      "kode_tim": "TIM-034",
      "id_program_unggulan": 34,
      "program_unggulan": "Peningkatan Pendidik dan Tenaga Kependidikan",
      "tahun": "2026",
      "kode_opd": "OPD-14",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 35,
      "kode_tim": "TIM-035",
      "id_program_unggulan": 35,
      "program_unggulan": "Dokter Keluarga",
      "tahun": "2026",
      "kode_opd": "OPD-15",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 36,
      "kode_tim": "TIM-036",
      "id_program_unggulan": 36,
      "program_unggulan": "Dokter dan perawat kunjungan langsung ke rumah",
      "tahun": "2026",
      "kode_opd": "OPD-15",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 37,
      "kode_tim": "TIM-037",
      "id_program_unggulan": 37,
      "program_unggulan": "Peningkatan Sarana dan Prasarana Kesehatan",
      "tahun": "2026",
      "kode_opd": "OPD-15",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 38,
      "kode_tim": "TIM-038",
      "id_program_unggulan": 38,
      "program_unggulan": "Peningkatan Mutu dan Kualitas Pelayanan Kesehatan",
      "tahun": "2026",
      "kode_opd": "OPD-15",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 39,
      "kode_tim": "TIM-039",
      "id_program_unggulan": 39,
      "program_unggulan": "Peningkatan Kualitas Tenaga Kesehatan",
      "tahun": "2026",
      "kode_opd": "OPD-15",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 40,
      "kode_tim": "TIM-040",
      "id_program_unggulan": 40,
      "program_unggulan": "Keluarga Sehat Sejahtera",
      "tahun": "2026",
      "kode_opd": "OPD-15",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 41,
      "kode_tim": "TIM-041",
      "id_program_unggulan": 41,
      "program_unggulan": "Pengembangan menuju BUMDes Mandiri",
      "tahun": "2026",
      "kode_opd": "OPD-11",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 42,
      "kode_tim": "TIM-042",
      "id_program_unggulan": 42,
      "program_unggulan": "Tatakelola Pemerintahan yang akuntabel",
      "tahun": "2026",
      "kode_opd": "OPD-06",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 43,
      "kode_tim": "TIM-043",
      "id_program_unggulan": 43,
      "program_unggulan": "SIMAS Hebat",
      "tahun": "2026",
      "kode_opd": "OPD-10",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 44,
      "kode_tim": "TIM-044",
      "id_program_unggulan": 44,
      "program_unggulan": "Keamanan dan Ketertiban masyarakat terjaga",
      "tahun": "2026",
      "kode_opd": "OPD-16",
      "pohon_kinerja": [],
      "petugas_tims": []
    },
    {
      "id": 45,
      "kode_tim": "TIM-045",
      "id_program_unggulan": 45,
      "program_unggulan": "Membangun pemerintahan yang bersih dan transparan serta berorientasi pada pelayanan publik berbasis teknologi informasi",
      "tahun": "2026",
      "kode_opd": "OPD-06",
      "pohon_kinerja": [],
      "petugas_tims": []
    }
  ]

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
        {/* <div className="flex items-start gap-1 mb-1">
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
        </div> */}
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
                {Dummy?.length === 0 ?
                  <tr>
                    <td colSpan={30} className="px-6 py-4">Data Kosong, Tambahkan Program Unggulan</td>
                  </tr>
                  :
                  Dummy?.map((item: KinerjaKonkerGetResponse, index: number) => (
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
