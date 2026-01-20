'use client'

import { useEffect, useState } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbUsersGroup, TbDeviceFloppy, TbX } from "react-icons/tb";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput, FloatingLabelSelect } from "@/components/global/input";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { OptionTypeString, OptionType } from "@/types";
import { apiFetch } from "@/lib/apiFetch";
import { AnggotaGetResponse } from "@/types/tim";
import { AlertNotification } from "@/components/global/sweetalert2";
import { useBrandingContext } from "@/provider/BrandingProvider";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: "baru" | "edit" | "";
    kode_tim: string;
    data?: AnggotaGetResponse | null;
}
interface FormValue {
    kode_tim: string;
    nip: OptionTypeString | null;
    nama_pegawai: string;
    kode_opd: OptionTypeString | null;
    is_active: boolean;
    keterangan: string;
    nama_jabatan_tim: OptionTypeString | null;
    bulan: OptionType,
    tahun: OptionType
}

export const ModalAnggota: React.FC<Modal> = ({ isOpen, onClose, onSuccess, jenis, kode_tim, data }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            is_active: data?.is_active || true,
            keterangan: data?.keterangan || "",
            kode_tim: kode_tim || "",
            nama_pegawai: data?.nama_pegawai || "",
            bulan: {
                value: branding?.bulan?.value,
                label: branding?.bulan?.label,
            },
            tahun: {
                value: branding?.tahun?.value,
                label: branding?.tahun?.label,
            },
            nip: data?.nip ? {
                value: data.nip,
                label: data.nama_pegawai || '',
            } : null,
        }
    })

    const [Proses, setProses] = useState<boolean>(false);

    const [OptionPegawai, setOptionPegawai] = useState<OptionTypeString[]>([]);
    const [OptionJabatan, setOptionJabatan] = useState<OptionTypeString[]>([]);

    const handleClose = () => {
        onClose();
        reset();
    }

    const OptionTahun = [
        { label: "2019", value: 2019 },
        { label: "2020", value: 2020 },
        { label: "2021", value: 2021 },
        { label: "2022", value: 2022 },
        { label: "2023", value: 2023 },
        { label: "2024", value: 2024 },
        { label: "2025", value: 2025 },
        { label: "2026", value: 2026 },
        { label: "2027", value: 2027 },
        { label: "2028", value: 2028 },
        { label: "2029", value: 2029 },
        { label: "2030", value: 2030 },
    ];
    const OptionBulan = [
        { label: "Januari", value: 1 },
        { label: "Februari", value: 2 },
        { label: "Maret", value: 3 },
        { label: "April", value: 4 },
        { label: "Mei", value: 5 },
        { label: "Juni", value: 6 },
        { label: "Juli", value: 7 },
        { label: "Agustus", value: 8 },
        { label: "September", value: 9 },
        { label: "Oktober", value: 10 },
        { label: "November", value: 11 },
        { label: "Desember", value: 12 },
    ]

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        // backend tidak terima formdata
        setProses(true);
        const payload = {
            is_active: true,
            keterangan: data.keterangan,
            kode_tim: kode_tim,
            id_jabatan_tim: data.nama_jabatan_tim?.value,
            nama_jabatan_tim: data.nama_jabatan_tim?.label,
            nama_pegawai: data?.nip?.label,
            nip: data?.nip?.value,
            bulan: data.bulan.value,
            tahun: data.tahun.value,
        }
        // console.log(payload);

        try {
            setProses(true);
            await apiFetch("/api/v1/timkerjabkad/susunantim", {
                method: "POST",
                body: payload as any
            }).then((resp: any) => {
                if (resp.code === 200 || resp.code === 201) {
                    // toastSuccess("data anggota berhasil disimpan");
                    AlertNotification("Berhasil", "anggota berhasil ditambahkan", "success", 2000, true);
                    handleClose();
                    onSuccess();
                    setProses(false);
                } else {
                    AlertNotification("GAGAL", `${resp}`, "error", 3000, true);
                    console.log(resp);
                    setProses(false);
                }
            }).catch(err => {
                AlertNotification("GAGAL", `${err}`, "error", 3000, true);
                setProses(false);
            })
        } catch (err) {
            console.log(err);
            AlertNotification("GAGAL", `${err}`, "error", 3000, true);
        } finally {
            setProses(false);
        }
    }

    useEffect(() => {
        if (OptionPegawai.length === 0) {
            const kode_opd = process.env.NEXT_PUBLIC_KODE_OPD;
            apiFetch(`/api/v1/perencanaan/pegawai/findall?kode_opd=${kode_opd}`)
                .then((resp: any) => {
                    if (resp.code === 200) {
                        const DataPegawai = resp.data.map((p: any) => ({
                            value: p.nip,
                            label: p.nama_pegawai,
                        }))
                        setOptionPegawai(DataPegawai);
                    } else {
                        AlertNotification("GAGAL", `pegawai : ${resp.data}`, "error", 3000, true);
                    }
                })
                .catch(err => {
                    AlertNotification("GAGAL", `gagal mendapatkan data pegawai`, "error", 3000, true);
                    console.log(err);
                })
        }
        if (OptionJabatan.length === 0) {
            apiFetch(`/api/v1/timkerjabkad/jabatantim`)
                .then((resp: any) => {
                    if (resp.code === 200) {
                        const J = resp.data.map((p: any) => ({
                            value: p.id,
                            label: p.nama_jabatan,
                        }))
                        setOptionJabatan(J);
                    } else {
                        AlertNotification("GAGAL", `jabatan : ${resp.data}`, "error", 3000, true);
                    }
                })
                .catch(err => {
                    AlertNotification("GAGAL", `gagal mendapatkan data jabatan`, "error", 3000, true);
                    console.log(err);
                })

        }
    }, [OptionPegawai, OptionJabatan]);


    return (
        <ModalComponent isOpen={isOpen} onClose={handleClose}>
            <div className="w-max-[500px] mb-2 border-b border-blue-500 text-blue-500">
                <h1 className="flex items-center justify-center gap-1 text-xl uppercase font-semibold pb-1">
                    <TbUsersGroup />
                    {jenis === "baru" ? "Tambah" : "Edit"} Anggota Tim
                </h1>
            </div>
            <form className="flex flex-col mx-5 py-5 gap-2" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="nip"
                    control={control}
                    rules={{ required: "Nama Pegawai wajib terisi" }}
                    render={({ field }) => (
                        <>
                            <FloatingLabelSelect
                                {...field}
                                id="nip"
                                options={OptionPegawai}
                                label="Nama Pegawai"
                            />
                            {errors.nip &&
                                <p className="text-red-400 italic">{errors.nip.message}</p>
                            }
                        </>
                    )}
                />
                <Controller
                    name="nama_jabatan_tim"
                    control={control}
                    rules={{ required: "jabatan dalam tim wajib terisi" }}
                    render={({ field }) => (
                        <>
                            <FloatingLabelSelect
                                {...field}
                                id="nama_jabatan_tim"
                                options={OptionJabatan}
                                label="Jabatan Dalam Tim"
                            />
                            {errors.nama_jabatan_tim &&
                                <p className="text-red-400 italic">{errors.nama_jabatan_tim.message}</p>
                            }
                        </>
                    )}
                />
                <Controller
                    name="bulan"
                    control={control}
                    rules={{ required: "wajib terisi" }}
                    render={({ field }) => (
                        <>
                            <FloatingLabelSelect
                                {...field}
                                id="bulan"
                                options={OptionBulan}
                                label="Bulan"
                            />
                            {errors.bulan &&
                                <p className="text-red-400 italic">{errors.bulan.message}</p>
                            }
                        </>
                    )}
                />
                <Controller
                    name="tahun"
                    control={control}
                    rules={{ required: "wajib terisi" }}
                    render={({ field }) => (
                        <>
                            <FloatingLabelSelect
                                {...field}
                                id="tahun"
                                options={OptionTahun}
                                label="Tahun"
                            />
                            {errors.tahun &&
                                <p className="text-red-400 italic">{errors.tahun.message}</p>
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
