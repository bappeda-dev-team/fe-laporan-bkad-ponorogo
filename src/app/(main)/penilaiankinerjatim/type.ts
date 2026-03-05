export interface FormValue {
    bulan: number,
    id_pegawai: string,
    jenis_nilai: string,
    kode_opd: string,
    kode_tim: string,
    nilai_kinerja: number,
    tahun: string
}

export interface GetResponsePenilaianKinerja {
    nama_tim: string;
    kode_tim: string;
    is_sekretariat: boolean;
    keterangan: string;
    penilaian_kinerjas: PenilaianKinerjas[];
}

export interface PenilaianKinerjas {
    id_pegawai: string;
    nama_pegawai: string;
    level_jabatan_tim: number;
    nama_jabatan_tim: string;
    pangkat: string;
    golongan: string;
    jenis_jabatan: string;
    kode_tim: string;
    nama_tim: string;
    tahun: string;
    bulan: number;
    kinerja_bappeda: number;
    kinerja_tim: number;
    kinerja_person: number;
    kinerja_kehadiran: number;
    nilai_akhir: number;
    tpp_pegawai?: TppPegawaiResponse;
}

export interface TppPegawaiResponse {
    tpp_basic: number;
    persentase_penerimaan: string;
    jumlah_kotor: number;
    pajak: number;
    jumlah_pajak: number;
    potongan_bpjs: number;
    jumlah_bersih: number;
    bpjs_1 : number;
    bpjs_4 : number;
}