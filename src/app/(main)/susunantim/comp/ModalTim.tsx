'use client'

import { useEffect, useState } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbUsersGroup, TbDeviceFloppy, TbX, TbCircleCheck, TbSquare } from "react-icons/tb";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput } from "@/components/global/input";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { TimGetResponse } from "@/types/tim";
import { apiFetch } from "@/lib/apiFetch";
import useToast from "@/components/global/toast";
import { AlertNotification } from "@/components/global/sweetalert2";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: "baru" | "edit";
    data?: TimGetResponse;
    tahun: number | null;
}
interface FormValue {
    id: number;
    is_active: boolean;
    is_sekretariat: boolean;
    keterangan: string;
    kode_tim: string;
    nama_tim: string;
    tahun: string;
}

export const ModalTim: React.FC<Modal> = ({ isOpen, onClose, onSuccess, jenis, data, tahun }) => {
    const [Sekretariat, setSekretariat] = useState<boolean>(false);

    const currentTahunStr = `${tahun}`

    const resolvedTahun =
        jenis === "edit"
            ? data?.tahun
            : String(tahun);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            is_active: true,
            keterangan: data?.keterangan,
            kode_tim: data?.kode_tim,
            nama_tim: data?.nama_tim,
            is_sekretariat: data?.is_sekretariat,
            tahun: currentTahunStr,
        }
    });

    useEffect(() => {
        if (!isOpen) return;

        reset({
            is_active: true,
            keterangan: data?.keterangan ?? "",
            kode_tim: data?.kode_tim ?? "",
            nama_tim: data?.nama_tim ?? "",
            is_sekretariat: data?.is_sekretariat ?? false,
            tahun: String(resolvedTahun),
        });

        setSekretariat(Boolean(data?.is_sekretariat));
    }, [isOpen, data, reset, resolvedTahun]);

    const [Proses, setProses] = useState<boolean>(false);
    const { toastError, toastSuccess } = useToast();
    const timId = data?.id
    const urlConfig = jenis === "baru" ?
        { url: "/api/v1/timkerjabkad/timkerja", method: "POST" }
        :
        { url: `/api/v1/timkerjabkad/timkerja/${timId}`, method: "PUT" }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        if (!resolvedTahun) {
            toastError("Tahun tidak valid");
            return;
        }

        const payload = {
            id: timId,
            nama_tim: data.nama_tim,
            keterangan: data.keterangan,
            is_active: true,
            is_sekretariat: Sekretariat,
            tahun: String(resolvedTahun)
        }
        // console.log(payload);

        try {
            setProses(true);
            await apiFetch(urlConfig.url, {
                method: urlConfig.method,
                body: payload as any
            }).then(_ => {
                toastSuccess("data berhasil disimpan");
                AlertNotification("Berhasil", "Berhasil Menambahkan Tim", "success", 3000, true);
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

    if (!resolvedTahun) {
        return (
            <ModalComponent isOpen={isOpen} onClose={onClose}>
                <div className="p-6 text-center text-red-600">
                    <p>Tahun tidak valid. Data tidak dapat disimpan.</p>
                    <ButtonRed className="mt-4" onClick={onClose}>
                        Tutup
                    </ButtonRed>
                </div>
            </ModalComponent>
        );
    }

    return (
        <ModalComponent isOpen={isOpen} onClose={handleClose}>
            <div className="w-max-[500px] mb-2 border-b border-blue-500 text-blue-500">
                <h1 className="flex items-center justify-center gap-1 text-xl uppercase font-semibold pb-1">
                    <TbUsersGroup />
                    {jenis === "baru" ? "Tambah" : "Edit"} Tim
                </h1>
            </div>
            <form className="flex flex-col mx-5 py-5 gap-2" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="nama_tim"
                    control={control}
                    rules={{ required: "nama tim wajib terisi" }}
                    render={({ field }) => (
                        <>
                            <FloatingLabelInput
                                {...field}
                                id="nama_tim"
                                label="nama tim"
                            />
                            {errors.nama_tim &&
                                <p className="text-red-400 italic">{errors.nama_tim.message}</p>
                            }
                        </>
                    )}
                />
                <Controller
                    name="keterangan"
                    control={control}
                    render={({ field }) => (
                        <FloatingLabelInput
                            {...field}
                            id="keterangan"
                            label="keterangan"
                        />
                    )}
                />
                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        className={`flex items-center gap-2 py-1 px-2 border rounded-lg cursor-pointer ${Sekretariat ? "bg-green-700 text-white" : "border-green-700 text-green-700"}`}
                        onClick={() => setSekretariat((prev) => !prev)}
                    >
                        {Sekretariat ?
                            <TbCircleCheck />
                            :
                            <TbSquare />
                        }
                        Tim Sekretariat
                    </button>
                </div>
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
