'use client'

import React, { useEffect, useState } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbFileDescription, TbDeviceFloppy, TbX } from "react-icons/tb";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FloatingLabelSelect } from "@/components/global/input";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { apiFetch } from "@/lib/apiFetch";
import useToast from "@/components/global/toast";
import { AlertNotification } from "@/components/global/sweetalert2";
import { useGet } from "@/app/hooks/useGet";
import { ProgramUnggulanGetResponse, PohonKinerjaKonker, PegawaiGetResponse, IndikatorRencanaKinerja, Target } from "@/types";
import { GetResponseAnggotaTimDropdown } from "../type";
import { useBrandingContext } from "@/provider/BrandingProvider";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    kode_tim: string;
    Data: PohonKinerjaKonker | null;
    id_program: number;
}
interface FormValue {
    bulan: number,
    id_program_unggulan: number,
    kode_tim: string,
    pegawai_id: GetResponseAnggotaTimDropdown | null,
    tahun: number
}

export const ModalPelaksana: React.FC<Modal> = ({ isOpen, onClose, onSuccess, kode_tim, id_program, Data }) => {

    const kode_opd = process.env.NEXT_PUBLIC_KODE_OPD;
    const { branding } = useBrandingContext();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            bulan: branding?.bulan?.value,
            id_program_unggulan: 0,
            kode_tim: kode_tim,
            pegawai_id: null,
            tahun: branding?.tahun?.value
        }
    });

    const [OptionPegawai, setOptionPegawai] = useState<GetResponseAnggotaTimDropdown[]>([]);
    const [Proses, setProses] = useState<boolean>(false);
    const { toastSuccess, toastInfo } = useToast();

    const { data, error, loading } = useGet<GetResponseAnggotaTimDropdown[]>(`/api/v1/timkerjabkad/susunantim/${kode_tim}/pelaksana`)

    useEffect(() => {
        if (data) {
            const pegawai = data.map((p: GetResponseAnggotaTimDropdown) => ({
                value: p.id,
                label: p.nama_pegawai,
                id: p.id,
                id_jabatan_tim: p.id_jabatan_tim,
                is_active: p.is_active,
                keterangan: p.keterangan,
                kode_tim: p.kode_tim,
                nama_jabatan_tim: p.nama_jabatan_tim,
                nama_pegawai: p.nama_pegawai,
                nip: p.nip,
            }));
            setOptionPegawai(pegawai);
        }
    }, [data]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        // backend tidak terima formdata
        const payload = {
            bulan: branding?.bulan?.value,
            id_program_unggulan: id_program,
            kode_tim: kode_tim,
            pegawai_id: data.pegawai_id?.nip,
            tahun: branding?.tahun?.value
        }

        // console.log(payload);
        try {
            setProses(true);
            await apiFetch(`/api/v1/timkerjabkad/petugas_tim`, {
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
                        name="pegawai_id"
                        control={control}
                        rules={{ required: "wajib di pilih" }}
                        render={({ field }) => (
                            <>
                                <FloatingLabelSelect
                                    {...field}
                                    id="pegawai_id"
                                    label="Pilih Pelaksana"
                                    options={OptionPegawai}
                                    isLoading={loading}
                                    isClearable
                                />
                                {errors.pegawai_id &&
                                    <p className="text-red-400 italic">{errors.pegawai_id.message}</p>
                                }
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
