'use client'

import { useEffect, useState } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbUsersGroup, TbDeviceFloppy, TbX } from "react-icons/tb";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput } from "@/components/global/input";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { JabatanGetResponse } from "@/types/tim";
import { apiFetch } from "@/lib/apiFetch";
import useToast from "@/components/global/toast";
import { AlertNotification } from "@/components/global/sweetalert2";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: "baru" | "edit" | "";
    data?: JabatanGetResponse | null;
}
interface FormValue {
    nama_jabatan: string;
    level_jabatan: number;
}

export const ModalJabatanTim: React.FC<Modal> = ({ isOpen, onClose, onSuccess, jenis, data }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nama_jabatan: data?.nama_jabatan,
            level_jabatan: data?.level_jabatan
        }
    })

    const [Proses, setProses] = useState<boolean>(false);
    const { toastError, toastSuccess } = useToast();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        // backend tidak terima formdata
        const payload = {
            nama_jabatan: data.nama_jabatan,
            level_jabatan: Number(data.level_jabatan)
        }
        console.log(payload);
        try{
            setProses(true);
          // kenapa misah misah hooknya
          // pakai satu aja, useGet
            await apiFetch("/api/v1/timkerjabkad/jabatantim", {
                method: jenis === "baru" ? "POST" : "PUT",
                body: payload as any
            }).then(_ => {
                toastSuccess("data berhasil disimpan");
                AlertNotification("Berhasil", "Berhasil Menambahkan Data Jabatan", "success", 3000, true);
                onSuccess();
                handleClose();
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            })
        } catch(err){
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
            console.log(err)
        } finally{
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
                    {jenis === "baru" ? "Tambah" : "Edit"} Jabatan
                </h1>
            </div>
            <form className="flex flex-col mx-5 py-5 gap-2" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="nama_jabatan"
                    control={control}
                    rules={{ required: "nama tim wajib terisi" }}
                    render={({ field }) => (
                        <>
                            <FloatingLabelInput
                                {...field}
                                id="nama_jabatan"
                                label="nama Jabatan"
                            />
                            {errors.nama_jabatan &&
                                <p className="text-red-400 italic">{errors.nama_jabatan.message}</p>
                            }
                        </>
                    )}
                />
                <Controller
                    name="level_jabatan"
                    control={control}
                    render={({ field }) => (
                        <>
                            <FloatingLabelInput
                                {...field}
                                id="level_jabatan"
                                label="level jabatan"
                                type="number"
                            />
                            {errors.level_jabatan &&
                                <p className="text-red-400 italic">{errors.level_jabatan.message}</p>
                            }
                        </>
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
