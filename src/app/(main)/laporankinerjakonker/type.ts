export interface FormValue {
    bukti_dukung: string,
    bulan: number,
    faktor_pendorong: string,
    faktor_penghambat: string,
    id_pohon: string;
    id_rencana_kinerja: string,
    id_program_unggulan: number;
    kode_opd: string,
    kode_subkegiatan: string,
    kode_tim: string,
    realisasi_anggaran: number,
    rekomendasi_tl: string,
    risiko_hukum: string;
    rencana_aksi: string,
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
