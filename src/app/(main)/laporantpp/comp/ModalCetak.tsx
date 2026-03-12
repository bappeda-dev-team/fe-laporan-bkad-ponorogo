'use client'

import { ModalComponent } from "@/components/page/ModalComponent";
import { TbUsersGroup, TbX, TbPrinter } from "react-icons/tb";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { PenilaianTimResponse, PenanggungJawabProps } from "@/types/penilaian_tpp";
import { useCetakTpp } from "../lib/useCetakTpp";
import { useCetakTppAllTim } from "../lib/useCetakTppAllTim";
import { AlertNotification } from "@/components/global/sweetalert2";
import { GetResponseFindAllTppAllTim } from "../type";
import Select from "react-select";
import { useState } from "react";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    jenis: "tim" | "all";
    DataPerTim?: PenilaianTimResponse | null;
    DataAllTim?: GetResponseFindAllTppAllTim[];
    penanggungJawab: PenanggungJawabProps;
}

type OptionBulanCetakType = {
    label: string;
    value: string;
};

interface FormValue {
    tanggal: string;
    bulanCetak: OptionBulanCetakType | null;
}

const OptionBulan: OptionBulanCetakType[] = [
    { label: "Januari", value: "Januari" },
    { label: "Februari", value: "Februari" },
    { label: "Maret", value: "Maret" },
    { label: "April", value: "April" },
    { label: "Mei", value: "Mei" },
    { label: "Juni", value: "Juni" },
    { label: "Juli", value: "Juli" },
    { label: "Agustus", value: "Agustus" },
    { label: "September", value: "September" },
    { label: "Oktober", value: "Oktober" },
    { label: "November", value: "November" },
    { label: "Desember", value: "Desember" },
    { label: "Bulan ke-13", value: "Bulan ke-13" },
    { label: "Bulan ke-14", value: "Bulan ke-14" }
];

export const ModalCetakTpp: React.FC<Modal> = ({
    isOpen,
    onClose,
    jenis,
    DataPerTim,
    DataAllTim,
    penanggungJawab
}) => {
    const [tanggal, setTanggal] = useState("");
    const [bulan, setBulan] = useState("");
    const { control, handleSubmit, reset, formState: { errors } } =
        useForm<FormValue>({
            defaultValues: {
                tanggal: "",
                bulanCetak: null
            }
        });

    const { cetakPdf } = useCetakTpp(
        DataPerTim ?? null,
        DataPerTim?.nama_tim ?? "",
        DataPerTim?.keterangan ?? "",
        DataPerTim?.is_sekretariat ?? false,
        tanggal,
        bulan,
        penanggungJawab
    );

    const { cetakPdfAllTim } = useCetakTppAllTim(
        DataAllTim ?? [],
        tanggal,
        bulan,
        penanggungJawab
    );

    const onSubmit: SubmitHandler<FormValue> = (data) => {

        const tanggalForm = data.tanggal;
        const bulanForm = data.bulanCetak?.value ?? "";

        if (!tanggalForm || !bulanForm) {
            AlertNotification("Tanggal atau Bulan Masih Kosong", "", "warning", 2000, true);
            return;
        }

        setTanggal(tanggalForm);
        setBulan(bulanForm);

        if (jenis === "tim") {
            cetakPdf();
        } else if (jenis === "all") {
            cetakPdfAllTim();
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <ModalComponent isOpen={isOpen} onClose={handleClose}>

            <div className="w-max-[500px] mb-2 border-b border-blue-500 text-blue-500">
                <h1 className="flex items-center justify-center gap-1 text-xl uppercase font-semibold pb-1">
                    <TbUsersGroup />
                    Cetak TPP {jenis}
                </h1>
            </div>

            <form className="flex flex-col mx-5 py-5 gap-3" onSubmit={handleSubmit(onSubmit)}>

                {/* TANGGAL */}
                <Controller
                    name="tanggal"
                    control={control}
                    rules={{ required: "Tanggal wajib terisi" }}
                    render={({ field }) => (
                        <>
                            <input
                                {...field}
                                className="border py-2 px-3 rounded-lg"
                                placeholder="Masukkan tanggal tertanda"
                                type="number"
                            />
                            {errors.tanggal && (
                                <p className="text-red-400 italic">{errors.tanggal.message}</p>
                            )}
                        </>
                    )}
                />

                {/* BULAN */}
                <Controller
                    name="bulanCetak"
                    control={control}
                    rules={{ required: "Bulan wajib terisi" }}
                    render={({ field }) => (
                        <>
                            <Select<OptionBulanCetakType>
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: "10px",
                                        minHeight: "36px"
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999
                                    })
                                }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                placeholder="Pilih Bulan"
                                options={OptionBulan}
                                value={field.value}
                                isSearchable
                                onChange={field.onChange}
                            />

                            {errors.bulanCetak && (
                                <p className="text-red-400 italic">{errors.bulanCetak.message}</p>
                            )}
                        </>
                    )}
                />

                <div className="flex flex-col gap-2 mt-3">
                    <ButtonSky className="w-full flex items-center gap-1" type="submit">
                        <TbPrinter />
                        Cetak
                    </ButtonSky>

                    <ButtonRed className="w-full flex items-center gap-1" type="button" onClick={handleClose}>
                        <TbX />
                        Batal
                    </ButtonRed>
                </div>

            </form>
        </ModalComponent>
    );
};
