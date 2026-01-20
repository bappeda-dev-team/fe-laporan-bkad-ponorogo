'use client'

import { useEffect, useState } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbUsersGroup, TbDeviceFloppy, TbX, TbCircleCheck, TbSquare } from "react-icons/tb";
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

export const ModalKinerjaSekretariat: React.FC<Modal> = ({ isOpen, onClose, onSuccess, Data, kode_tim, id_program }) => {

    const { branding } = useBrandingContext();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            bukti_dukung: "",
            bulan: branding?.bulan?.value,
            faktor_pendorong: Data?.faktor_pendorong || "",
            faktor_penghambat: Data?.faktor_penghambat || "",
            id_rencana_kinerja: Data?.id_rencana_kinerja || "",
            id_rencana_kinerja_sekretatiat: Data?.id || 0,
            id_pohon: Data?.id_pohon,
            id_program_unggulan: 0,
            kode_opd: branding?.opd,
            kode_subkegiatan: "",
            kode_tim: kode_tim,
            realisasi_anggaran: Number(Data?.realisasi_anggaran || 0),
            rekomendasi_tl: Data?.rekomendasi_tl || "",
            risiko_hukum: Data?.risiko_hukum,
            tahun: String(branding?.tahun?.value)
        }
    });

    const [Proses, setProses] = useState<boolean>(false);
    const { toastError, toastSuccess } = useToast();
    const url = `/api/v1/timkerjabkad/realisasianggaran` 
        const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            bukti_dukung: "",
            bulan: branding?.bulan?.value,
            faktor_pendorong: data.faktor_pendorong || "",
            faktor_penghambat: data.faktor_penghambat || "",
            id_program_unggulan: 0,
            id_pohon: Data?.id_pohon,
            id_rencana_kinerja: Data?.id_rencana_kinerja || "",
            id_rencana_kinerja_sekretariat: Data?.id || "",
            kode_opd: branding?.opd,
            kode_subkegiatan: "",
            kode_tim: kode_tim,
            realisasi_anggaran: Number(data.realisasi_anggaran),
            rekomendasi_tl: data.rekomendasi_tl || "",
            risiko_hukum: data.risiko_hukum,
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

    const handleClose = () => {
        onClose();
        reset();
    }

    return (
        <ModalComponent isOpen={isOpen} onClose={handleClose}>
            <div className="w-max-[500px] mb-2 border-b border-blue-500 text-blue-500">
                <h1 className="flex items-center justify-center gap-1 text-xl uppercase font-semibold pb-1">
                    <TbUsersGroup />
                    Edit Kinerja Pendukung
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
                            />
                        </>
                    )}
                />
                <Controller
                    name="faktor_pendorong"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="faktor_pendorong"
                            label="faktor pendorong"
                        />
                    )}
                />
                <Controller
                    name="faktor_penghambat"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="faktor_penghambat"
                            label="faktor penghambat"
                        />
                    )}
                />
                <Controller
                    name="risiko_hukum"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="risiko_hukum"
                            label="Risiko Hukum"
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
