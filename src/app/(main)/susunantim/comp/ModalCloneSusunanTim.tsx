'use client'

import { useState } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbCopy, TbDeviceFloppy, TbX } from "react-icons/tb";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { apiFetch } from "@/lib/apiFetch";
import { AlertNotification } from "@/components/global/sweetalert2";
import Select from 'react-select';

interface ModalCloneProps {
    isOpen: boolean;
    kodeTim: string;
    bulan: number;   // asal (readonly)
    tahun: number;   // asal (readonly)
    onClose: () => void;
    onSuccess: () => void;
}

interface CloneFormValue {
    bulanTarget: number;
    tahunTarget: number;
}

type Option = {
    label: string;
    value: number;
};

export const ModalCloneSusunanTim: React.FC<ModalCloneProps> = ({
    isOpen,
    kodeTim,
    bulan,
    tahun,
    onClose,
    onSuccess,
}) => {

    const [proses, setProses] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } =
        useForm<CloneFormValue>({
            defaultValues: {
                bulanTarget: bulan, // default: sama dengan asal
                tahunTarget: tahun,
            }
        });

    const handleClose = () => {
        reset();
        onClose();
    };


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

    const onSubmit: SubmitHandler<CloneFormValue> = async (form) => {
        const payload = {
            kodeTim,
            bulan,                // asal (fixed)
            tahun,                // asal (fixed)
            bulanTarget: Number(form.bulanTarget),
            tahunTarget: Number(form.tahunTarget),
        };

        try {
            setProses(true);

            await apiFetch("/api/v1/timkerjabkad/susunantim/clone", {
                method: "POST",
                body: payload as any,
            });

            AlertNotification(
                "Berhasil",
                "Clone susunan tim berhasil",
                "success",
                3000,
                true
            );

            onSuccess();
            handleClose();
        } catch (err) {
            AlertNotification("Gagal", String(err), "error", 3000, true);
        } finally {
            setProses(false);
        }
    };

    return (
        <ModalComponent isOpen={isOpen} onClose={handleClose}>
            <div className="mb-2 border-b border-blue-500 text-blue-500">
                <h1 className="flex items-center justify-center gap-1 text-xl uppercase font-semibold pb-1">
                    <TbCopy />
                    Clone Susunan Tim
                </h1>
            </div>

            <form
                className="flex flex-col mx-5 py-5 gap-3"
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* === INFO ASAL (READONLY) === */}
                <div className="p-3 rounded-lg bg-gray-100 text-sm">
                    <p className="font-semibold">Periode Asal</p>
                    <p>Bulan: <b>{bulan}</b></p>
                    <p>Tahun: <b>{tahun}</b></p>
                </div>

                {/* === TARGET INPUT === */}
                <Controller
                    name="bulanTarget"
                    control={control}
                    rules={{ required: "bulan target wajib dipilih" }}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Bulan Target
                            </label>

                            <Select
                                options={OptionBulan}
                                placeholder="Pilih Bulan"
                                value={OptionBulan.find(o => o.value === field.value) || null}
                                onChange={(opt) => field.onChange(opt?.value)}
                                isClearable
                            />

                            {errors.bulanTarget && (
                                <p className="text-red-400 italic">
                                    {errors.bulanTarget.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="tahunTarget"
                    control={control}
                    rules={{ required: "tahun target wajib dipilih" }}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Tahun Target
                            </label>

                            <Select
                                options={OptionTahun}
                                placeholder="Pilih Tahun"
                                value={OptionTahun.find(o => o.value === field.value) || null}
                                onChange={(opt) => field.onChange(opt?.value)}
                                isClearable
                            />

                            {errors.tahunTarget && (
                                <p className="text-red-400 italic">
                                    {errors.tahunTarget.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                {/* === ACTION === */}
                <div className="flex flex-col gap-2 mt-4">
                    <ButtonSky
                        className="w-full"
                        type="submit"
                        disabled={proses}
                    >
                        {proses ? (
                            <span>Menyimpan...</span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <TbDeviceFloppy />
                                Clone
                            </span>
                        )}
                    </ButtonSky>

                    <ButtonRed
                        className="w-full flex items-center gap-1"
                        type="button"
                        onClick={handleClose}
                    >
                        <TbX />
                        Batal
                    </ButtonRed>
                </div>
            </form>
        </ModalComponent>
    );
};
