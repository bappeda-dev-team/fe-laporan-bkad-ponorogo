export interface OptionTypeString {
  value: string;
  label: string;
}
export interface OptionType {
  value: number;
  label: string;
}
export interface SusunanTim {
  id: number;
  is_active: boolean;
  keterangan: string;
  level_jabatan: number;
  nama_jabatan: string;
  nip: string;
}

export interface PegawaiGetResponse {
  id: string;
  nama_pegawai: string;
  nip: string;
  kode_opd: string;
  nama_opd: string;
}

export interface TimKerja {
  id: number;
  kode_tim: string;
  nama_tim: string;
  susunan_tims: SusunanTim[];
  status: string;
}

export interface ApiResp<T> {
  code: number;
  data: T[];
}
export interface OpdGetResponse {
  id: string;
  kode_opd: string;
  nama_opd: string;
  singkatan: string;
  alamat: string;
  telepon: string;
  fax: string;
  email: string;
  website: string;
  nama_kepala_opd: string;
  nip_kepala_opd: string;
  pangkat_kepala: string;
  id_lembaga: {
    id: string;
    kode_lembaga: string;
    nama_lembaga: string;
    is_active: boolean;
  }
}
export interface ProgramUnggulanGetResponse {
  id: number;
  kode_program_unggulan: string;
  nama_program_unggulan: string;
  rencana_implementasi: string;
  keterangan: string;
  tahun_awal: string;
  tahun_akhir: string;
  is_active: boolean;
}
export interface KinerjaKonkerGetResponse {
  id: number;
  kode_tim: string;
  nama_tim: string;
  id_program_unggulan: number;
  program_unggulan: string;
  tahun: string;
  kode_opd: string;
  pohon_kinerja: PohonKinerjaKonker[];
  petugas_tims: PetugasTims[];
}

export interface PohonKinerjaKonker {
  kode_program_unggulan: string;
  nama_program_unggulan: string;
  rencana_implementasi: string;
  id_tagging: number;
  id_pohon: number;
  tahun: number;
  nama_pohon: string;
  kode_opd: string;
  nama_opd: string;
  jenis_pohon: string;
  keterangan_tagging: string;
  status: string;
  pelaksanas: any | null; // Use a specific type if structure is known, otherwise 'any' or 'null'
  keterangan: string;
  indikator: IndikatorRencanaKinerja[];
  realisasi_anggaran: number;
  catatan_realisasi_anggaran: string;
  catatan_penata_usaha_keuangan: string;
  catatan_pelaporan_keuangan: string;
  catatan_pelaporan_aset: string;
  rencana_aksi: string;
  faktor_pendorong: string;
  faktor_penghambat: string;
  risiko_hukum: string;
  rekomendasi_tl: string;
}

export interface Pelaksanas {
  nama_pelaksana: string,
  nip_pelaksana: number,
  rencana_kinerjas: RencanaKinerjaPelaksanas[];
}
export interface PetugasTims {
  id: number;
  pegawai_id: string;
  nama_pegawai: string;
  nama_tim: string;
  kode_tim: string;
}

export interface RencanaKinerjaPelaksanas {
  id_rekin: string,
  rencana_kinerja: string,
  nama_pelaksana: string,
  nip_pelaksana: string,
  kode_subkegiatan: string,
  nama_subkegiatan: string,
  pagu: number,
  keterangan: string,
  tahapan_pelaksanaan: {
    tw_1: number,
    tw_2: number,
    tw_3: number,
    tw_4: number
  }
}

export interface RencanaKinerjaGetResponse {
  id_rencana_kinerja: string;
  id_pohon: number;
  nama_rencana_kinerja: string;
  tahun: string;
  status_rencana_kinerja: string;
  catatan: string;
  operasional_daerah: OperasionalDaerah;
  pegawai_id: string;
  nama_pegawai: string;
  indikator: IndikatorRencanaKinerja[];
}
interface OperasionalDaerah {
  kode_opd: string;
  nama_opd: string;
}
export interface Target {
  id_target: string;
  indikator_id: string;
  target: string;
  satuan: string;
}
export interface SubKegiatanResponse {
  subkegiatanterpilih_id: string;
  id: string;
  rekin_id: string;
  kode_subkegiatan: string;
  nama_sub_kegiatan: string;
}
export interface IndikatorRencanaKinerja {
  id_indikator: string;
  rencana_kinerja_id: string;
  nama_indikator: string;
  targets: Target[];
  manual_ik_exist: boolean;
}

export interface RencanaKinerjaSekretariatResponse {
  id: number;
  kode_tim: string;
  id_rencana_kinerja: string;
  id_rencana_kinerja_sekretariat: number;
  id_pegawai: string;
  pagu_anggaran: number;
  nama_pegawai: string;
  rencana_kinerja: string;
  tahun: string;
  kode_opd: string;
  rencana_aksis: RencanaAksis[];
  indikators: IndikatorRencanaKinerja[];
  subkegiatan: SubKegiatanResponse[];
  realisasi_anggaran: number;
  faktor_pendorong: string;
  faktor_penghambat: string;
  risiko_hukum: string;
  rekomendasi_tl: string;
}

export interface RencanaAksis {
  id: string;
  rekin_id: string;
  kode_opd: string;
  urutan: number;
  nama_rencana_aksi: string;
  pelaksanaan: PelaksanaanRencanaAksi[];
  jumlah_bobot: number;
  total_bobot_rencana_aksi: number;
}

export interface PelaksanaanRencanaAksi {
  id: string;
  rencana_aksi_id: string;
  bulan: number;
  bobot: number;
}
