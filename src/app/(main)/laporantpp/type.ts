export interface GetResponseFindAllTppAllTim {
    id_pegawai: string;
    nama_tim: string;
    nama_pegawai: string;
    level_jabatan_tim: number;
    nama_jabatan_tim: string;
    pangkat: string;
    golongan: string;
    nomorRekening: string;
    npwp: string;
    jenis_jabatan: string;
    kode_tim: string;
    tahun: string;
    bulan: number;
    kinerja_bappeda: number;
    kinerja_tim: number;
    kinerja_person: number;
    kinerja_kehadiran: number;
    nilai_akhir: number;
    tpp_pegawai: TppPegawaiResponse;
}

export interface TppPegawaiResponse {
    tpp_basic: number;
    persentase_penerimaan: string;
    jumlah_kotor: number;
    pajak: number;
    jumlah_pajak: number;
    potongan_bpjs_1: number;
    potongan_bpjs_4: number;
    bpjs_1: number;
    bpjs_4: number;
    jumlah_bersih: number;
}
