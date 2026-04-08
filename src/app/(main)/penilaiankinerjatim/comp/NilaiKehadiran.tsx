'use client'

import useToast from "@/components/global/toast";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ButtonRedBorder, ButtonGreenBorder } from "@/components/button/button";
import { useState, useEffect } from "react";
import { TbPencil, TbDeviceFloppy, TbX } from "react-icons/tb";
import { PercentInput } from "@/components/global/input";
import { FormValue } from "../type";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { apiFetch } from "@/lib/apiFetch";
import { AlertNotification } from "@/components/global/sweetalert2";
import { percentDisplay, percentPayload, formatPercent } from "@/app/hooks/kehadiranHelper";

interface Modal {
    nilai: number;
    kode_tim: string;
    Data?: any;
}

export const NilaiKehadiran: React.FC<Modal> = ({ nilai, kode_tim, Data }) => {

    const [Editing, setEditing] = useState<boolean>(false);
    const [nilaiSaatIni, setNilaiSaatIni] = useState<number>(nilai);

    useEffect(() => {
        setNilaiSaatIni(nilai);
    }, [nilai]);

    const handleUpdateNilai = (nilaiBaru: number) => {
        setNilaiSaatIni(percentPayload(nilaiBaru));
    }

    if (Editing) {
        return (
            <FormNilaiKehadiran
                nilai={nilaiSaatIni}
                onClose={() => setEditing(false)}
                kode_tim={kode_tim}
                Data={Data}
                onUpdate={handleUpdateNilai}
            />
        )
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <p>{percentDisplay(nilaiSaatIni)}%</p>

            <button
                className="p-1 rounded-full border border-emerald-500 text-emerald-500 hover:bg-emerald-300 hover:text-white cursor-pointer"
                type="button"
                onClick={() => setEditing(true)}
            >
                <TbPencil />
            </button>
        </div>
    )
}

interface FormNilaiKehadiran {
    nilai: number;
    onClose: () => void;
    kode_tim: string;
    Data?: any;
    onUpdate: (NilaiBaru: number) => void;
}

export const FormNilaiKehadiran: React.FC<FormNilaiKehadiran> = ({ nilai, onClose, kode_tim, Data, onUpdate }) => {
    const defaultNilai =
        nilai === 0
            ? "100.00"
            : percentDisplay(nilai)

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
          nilai_kinerja: defaultNilai
        }
    });
    const { toastSuccess } = useToast();
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            bulan: branding?.bulan?.value,
            id_pegawai: Data?.id_pegawai,
            jenis_nilai: "KINERJA_KEHADIRAN",
            kode_opd: branding?.opd,
            kode_tim: kode_tim,
            nilai_kinerja: percentPayload(Number(data.nilai_kinerja)),
            tahun: String(branding?.tahun?.value),
        }
        // console.log(payload);
        // toastSuccess("dalam pengembangan");
        try {
            setProses(true);
            await apiFetch(`/api-laporan/penilaian_kinerja`, {
                method: "POST",
                body: payload as any
            }).then(_ => {
                toastSuccess("data berhasil disimpan");
                onUpdate(Number(data.nilai_kinerja));
                // AlertNotification("Berhasil", "Berhasil Menambahkan Tim", "success", 3000, true);
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
        <div className="flex flex-col items-center justify-center gap-2">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="nilai_kinerja"
                    rules={{
                        required: "tidak boleh kosong",
                        max: { value: 100, message: "maksimum 100" },
                        min: { value: 0, message: "minimum 0" }
                    }}
                    control={control}
                    render={({ field }) => (
                        <>
                            <PercentInput
                                id="nilai_kinerja"
                                value={field.value}
                                onChangeAction={field.onChange}
                                onBlurAction={field.onBlur}
                            />

                            {errors.nilai_kinerja &&
                                <p className="text-xs italic text-red-500">
                                    {errors.nilai_kinerja?.message}
                                </p>
                            }
                        </>
                    )}
                />
                <div className="flex justify-center items-center gap-1 w-full">
                    <ButtonRedBorder
                        type="button"
                        onClick={handleClose}
                    >
                        <TbX />
                    </ButtonRedBorder>
                    <ButtonGreenBorder type="submit" disabled={Proses}>
                        <TbDeviceFloppy />
                    </ButtonGreenBorder>
                </div>
            </form>
        </div>
    )
}
