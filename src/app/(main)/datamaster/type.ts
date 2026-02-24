import { OptionType } from "@/types";

export interface GetResponseFindallPegawai {
    id: number;
    nip: string;
    namaPegawai: string;
    namaJabatan: string;
    kodeOpd: string;
    statusJabatan: string;
    jenisJabatan: string;
    eselon: string;
    pangkat: string;
    golongan: string;
    basicTpp: number;
    pajak: number;
    tanggalMulai: string;
    tanggalAkhir: string | null;
    createdDate: string;
    lastModifiedDate: string;
    bulanMulai: OptionType | null;
    tahunMulai: OptionType | null;
    bulanBerakhir: OptionType | null;
    tahunBerakhir: OptionType | null;
}
