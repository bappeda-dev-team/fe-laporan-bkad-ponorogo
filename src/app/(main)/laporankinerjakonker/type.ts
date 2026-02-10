export interface FormValue {
    bukti_dukung: string,
    bulan: number,
    id_pohon: string;
    id_rencana_kinerja: string,
    id_program_unggulan: number;
    kode_opd: string,
    kode_subkegiatan: string,
    kode_tim: string,
    realisasi_anggaran: number,
    rekomendasi_tl: string,
    rencana_aksi: string,
    analisa_pendapatan_sumber_dana_pendapatan: string;
    catatan_realisasi_anggaran: string;
    catatan_penata_usaha_keuangan: string;
    catatan_pelaporan_keuangan: string;
    catatan_pelaporan_aset: string;
    tahun: string
}

export interface GetResponseAnggotaTimDropdown {
    id: number,
    id_jabatan_tim: number,
    is_active: true,
    keterangan: string,
    kode_tim: string,
    nama_jabatan_tim: string,
    nama_pegawai: string,
    nip: string,
}