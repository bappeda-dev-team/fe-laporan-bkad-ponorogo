'use client'

import { useEffect, useState } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbUsersGroup, TbDeviceFloppy, TbX } from "react-icons/tb";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput } from "@/components/global/input";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { apiFetch } from "@/lib/apiFetch";
import useToast from "@/components/global/toast";
import { AlertNotification } from "@/components/global/sweetalert2";
import { FormValue } from "../type";
import { useBrandingContext } from "@/provider/BrandingProvider";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data?: any;
    kode_tim: string;
    id_program?: number;
}

export const ModalKinerjaKonker: React.FC<Modal> = ({ isOpen, onClose, onSuccess, Data, kode_tim, id_program }) => {

    const { branding } = useBrandingContext();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            bukti_dukung: "",
            bulan: branding?.bulan?.value,
            id_program_unggulan: id_program || 0,
            id_pohon: Data?.id_pohon,
            id_rencana_kinerja: String(Data?.id_pohon || ""),
            kode_opd: branding?.opd,
            kode_subkegiatan: "",
            kode_tim: kode_tim,
            rencana_aksi: Data?.rencana_aksi,
            realisasi_anggaran: Number(Data?.realisasi_anggaran),
            rekomendasi_tl: Data?.rekomendasi_tl || "",
            tahun: String(branding?.tahun?.value),
            analisa_pendapatan_sumber_dana_pendapatan: Data?.analisa_pendapatan_sumber_dana_pendapatan,
            catatan_realisasi_anggaran: Data?.catatan_realisasi_anggaran,
            catatan_penataan_usaha_keuangan: Data?.catatan_penataan_usaha_keuangan,
            catatan_pelaporan_keuangan: Data?.catatan_pelaporan_keuangan,
            catatan_pelaporan_aset: Data?.catatan_pelaporan_aset,
        }
    });

    const [Proses, setProses] = useState<boolean>(false);
    const { toastError, toastSuccess } = useToast();
    const url = `/api/v1/timkerjabkad/realisasianggaran`
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            bukti_dukung: "",
            bulan: branding?.bulan?.value,
            id_program_unggulan: id_program || 0,
            id_pohon: Data?.id_pohon,
            id_rencana_kinerja: String(Data?.id_pohon || ""),
            kode_opd: branding?.opd,
            kode_subkegiatan: "",
            kode_tim: kode_tim,
            rencana_aksi: data.rencana_aksi,
            realisasi_anggaran: Number(data.realisasi_anggaran),
            rekomendasi_tl: data.rekomendasi_tl,
            analisa_pendapatan_sumber_dana_pendapatan: data?.analisa_pendapatan_sumber_dana_pendapatan,
            catatan_realisasi_anggaran: data?.catatan_realisasi_anggaran,
            catatan_penataan_usaha_keuangan: data?.catatan_penataan_usaha_keuangan,
            catatan_pelaporan_keuangan: data?.catatan_pelaporan_keuangan,
            catatan_pelaporan_aset: data?.catatan_pelaporan_aset,
            tahun: String(branding?.tahun?.value)
        }
        // console.log(payload);

        try {
            setProses(true);
            await apiFetch(url, {
                method: "POST",
                body: payload as any
            }).then(_ => {
                toastSuccess("data berhasil disimpan");
                // AlertNotification("Berhasil", "Berhasil Menyimpan Data", "success", 3000, true);
                onSuccess();
                handleClose();
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            })
        } catch (err) {
            console.log(err);
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        } finally {
            setProses(false);
        }
    }

    useEffect(() => {
        console.log("data dari konker: ", Data?.realisasi_anggaran);
    }, [Data]);

    const handleClose = () => {
        onClose();
        reset();
    }

    return (
        <ModalComponent isOpen={isOpen} onClose={handleClose}>
            <div className="w-max-[500px] mb-2 border-b border-blue-500 text-blue-500">
                <h1 className="flex items-center justify-center gap-1 text-xl uppercase font-semibold pb-1">
                    <TbUsersGroup />
                    Edit Kinerja Konker
                </h1>
            </div>
            <form className="flex flex-col mx-5 py-5 gap-2" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="realisasi_anggaran"
                    control={control}
                    render={({ field }) => (
                        <>
                            <FloatingLabelInput
                                {...field}
                                id="realisasi_anggaran"
                                label="Realisasi Anggaran"
                                type="number"
                            />
                        </>
                    )}
                />
                <Controller
                    name="rencana_aksi"
                    control={control}
                    render={({ field }) => (
                        <>
                            <FloatingLabelInput
                                {...field}
                                id="rencana_aksi"
                                label="Rencana Aksi"
                            />
                        </>
                    )}
                />
                <Controller
                    name="analisa_pendapatan_sumber_dana_pendapatan"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="analisa_pendapatan_sumber_dana_pendapatan"
                            label="Analisa Pendapatan Sumber Dana Pendapatan"
                        />
                    )}
                />
                <Controller
                    name="catatan_realisasi_anggaran"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="catatan_realisasi_anggaran"
                            label="Catatan Realisasi Anggaran"
                        />
                    )}
                />
                <Controller
                    name="catatan_penataan_usaha_keuangan"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="catatan_penataan_usaha_keuangan"
                            label="Catatan Penataan Usaha Keuangan"
                        />
                    )}
                />
                <Controller
                    name="catatan_pelaporan_keuangan"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="catatan_pelaporan_keuangan"
                            label="Catatan Pelaporan Keuangan"
                        />
                    )}
                />
                <Controller
                    name="catatan_pelaporan_aset"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="catatan_pelaporan_aset"
                            label="Catatan Pelaporan Aset"
                        />
                    )}
                />
                <Controller
                    name="rekomendasi_tl"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="rekomendasi_tl"
                            label="Rekomendasi Tindak Lanjut"
                        />
                    )}
                />
                <div className="flex flex-col gap-2 mt-3">
                    <ButtonSky
                        className="w-full"
                        type="submit"
                        disabled={Proses}
                    >
                        {Proses ?
                            <span className="flex">
                                Menyimpan...
                            </span>
                            :
                            <span className="flex items-center gap-1">
                                <TbDeviceFloppy />
                                Simpan
                            </span>
                        }
                    </ButtonSky>
                    <ButtonRed className="w-full flex items-center gap-1" type="button" onClick={handleClose}>
                        <TbX />
                        Batal
                    </ButtonRed>
                </div>
            </form>
        </ModalComponent>
    )
}
