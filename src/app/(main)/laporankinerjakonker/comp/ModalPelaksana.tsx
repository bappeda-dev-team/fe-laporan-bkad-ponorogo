'use client'

import React, { useEffect, useState, useMemo } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbFileDescription, TbDeviceFloppy, TbX } from "react-icons/tb";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { FloatingLabelSelect } from "@/components/global/input";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { apiFetch } from "@/lib/apiFetch";
import useToast from "@/components/global/toast";
import { AlertNotification } from "@/components/global/sweetalert2";
import { useGet } from "@/app/hooks/useGet";
import { PohonKinerjaKonker, IndikatorRencanaKinerja, Target } from "@/types";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { AnggotaGetResponse, TimGetResponse } from "@/types/tim";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: PohonKinerjaKonker | null;
    id_program: number;
}
interface OptionTimType extends TimGetResponse {
    value: string;
    label: string;
}
interface OptionPelaksanaType extends AnggotaGetResponse {
    value: string;
    label: string;
}
interface FormValue {
    bulan: number,
    id_program_unggulan: number,
    kode_tim: OptionTimType | null,
    pegawai_id: OptionPelaksanaType | null,
    tahun: number
}

export const ModalPelaksana: React.FC<Modal> = ({ isOpen, onClose, onSuccess, id_program, Data }) => {

    const { branding } = useBrandingContext();
    const tahun = branding?.tahun?.value;
    const bulan = branding?.bulan?.value;

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            bulan: branding?.bulan?.value,
            id_program_unggulan: 0,
            kode_tim: null,
            pegawai_id: null,
            tahun: branding?.tahun?.value
        }
    });

    const [OptionTim, setOptionTim] = useState<TimGetResponse[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const { toastSuccess, toastInfo, toastError } = useToast();

    const { data: DataTim, error, loading } = useGet<TimGetResponse[]>(`/api/v1/timkerja/timkerja?tahun=${tahun}&bulan=${bulan}`)

    useEffect(() => {
        if (DataTim) {
            const tim = DataTim.map((p: TimGetResponse) => ({
                ...p,
                value: p.kode_tim,
                label: p.nama_tim,
            }));
            setOptionTim(tim);
        }
    }, [DataTim]);

    const TimValue = useWatch({
        control,
        name: "kode_tim",
    })

    useEffect(() => {
        setValue("pegawai_id", null);
    }, [TimValue, setValue]);

    const optionPelaksana = useMemo(() => {
        if (!TimValue) {
            return [];
        } else if (TimValue?.susunan_tims === null) {
            return [];
        } else {
            return TimValue?.susunan_tims
                .map(item => ({
                    value: item.nip,
                    label: `${item.nama_pegawai} - ${item.nama_jabatan}`,
                    ...item, // kalau mau data lengkap tetap kebawa
                }));
        }
    }, [TimValue]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        // backend tidak terima formdata
        const payload = {
            bulan: branding?.bulan?.value,
            id_program_unggulan: id_program,
            kode_tim: data.kode_tim?.value,
            pegawai_id: data.pegawai_id?.nip,
            tahun: branding?.tahun?.value
        }
        if(data.pegawai_id?.value === undefined || data.pegawai_id?.value === null){
            AlertNotification("Wajib Diisi Semua", "", "warning", 2000, true);
        } else {
            // console.log(payload);
            try {
                setProses(true);
                await apiFetch(`/api/v1/timkerja/petugas_tim`, {
                    method: "POST",
                    body: payload as any
                }).then(_ => {
                    toastSuccess("pelaksana berhasil disimpan");
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
    }

    const handleClose = () => {
        onClose();
        reset();
    }

    return (
        <ModalComponent isOpen={isOpen} onClose={handleClose}>
            <div className="w-max-[500px] mb-2 border-b border-blue-500 text-blue-500">
                <h1 className="flex items-center justify-center gap-1 text-xl uppercase font-semibold pb-1">
                    <TbFileDescription />
                    Pilih Pelaksana Program Unggulan
                </h1>
            </div>
            {error &&
                <h1 className="text-red-500">Error saat mengambil data dropwdown Pelaksana</h1>
            }
            <div className="min-h-[420px] flex flex-col">
                <form className="flex flex-col mx-5 py-5 gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="kode_tim"
                        control={control}
                        render={({ field }) => (
                            <>
                                <FloatingLabelSelect
                                    {...field}
                                    id="kode_tim"
                                    label="Pilih Tim"
                                    options={OptionTim}
                                    isLoading={loading}
                                    isClearable
                                    isSearchable
                                />
                            </>
                        )}
                    />
                    <Controller
                        name="pegawai_id"
                        control={control}
                        // rules={{ required: "wajib di pilih" }}
                        render={({ field }) => (
                            <>
                                <FloatingLabelSelect
                                    {...field}
                                    id="pegawai_id"
                                    label="Pilih Pelaksana"
                                    options={optionPelaksana}
                                    isClearable
                                    isSearchable
                                    disable={!TimValue}
                                />
                                {/* {errors.pegawai_id &&
                                    <p className="text-red-400 italic">{errors.pegawai_id.message}</p>
                                } */}
                            </>
                        )}
                    />
                    <table className="w-full">
                        <tbody>
                            <tr className="border bg-blue-100">
                                <td className="p-2">Program Unggulan</td>
                                <td className="p-2">:</td>
                                <td className="p-2">{Data?.nama_program_unggulan || "-"}</td>
                            </tr>
                            <tr className="border">
                                <td className="p-2">Pohon Kinerja</td>
                                <td className="p-2">:</td>
                                <td className="p-2">{Data?.nama_pohon || "-"}</td>
                            </tr>
                            <tr className="border">
                                <td className="p-2">Perangkat Daerah</td>
                                <td className="p-2">:</td>
                                <td className="p-2">{Data?.nama_opd || "-"}</td>
                            </tr>
                            {Data?.indikator?.map((i: IndikatorRencanaKinerja, index: number) => (
                                <React.Fragment key={index}>
                                    <tr className="border bg-blue-100">
                                        <td className="p-2">Indikator {Data?.indikator.length > 1 && index + 1}</td>
                                        <td className="p-2">:</td>
                                        <td className="p-2">{i.nama_indikator || "-"}</td>
                                    </tr>
                                    {i.targets?.map((t: Target, sub_index: number) => (
                                        <tr className="border" key={sub_index}>
                                            <td className="p-2">Target / Satuan</td>
                                            <td className="p-2">:</td>
                                            <td className="p-2">{t.target || "-"} / {t.satuan || "-"}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
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
            </div>
        </ModalComponent>
    )
}
