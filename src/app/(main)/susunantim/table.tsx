'use client'

import { useState, useEffect, useMemo } from "react";
import { TableAnggota } from "./comp/TableAnggota";
import { ButtonSky } from "@/components/button/button";
import { TbUsersGroup } from "react-icons/tb";
import { TimGetResponse } from "@/types/tim";
import { useGet } from "@/app/hooks/useGet";
import { ModalTim } from "./comp/ModalTim";
import { useBrandingContext } from "@/provider/BrandingProvider";

export const Table = () => {

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    // const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<number>(0);
    const { branding } = useBrandingContext();

    const bulan = branding?.bulan?.value ?? null;
    const tahun = branding?.tahun?.value ?? null;

    const isReady = Number.isInteger(bulan) && Number.isInteger(tahun);

    const url = useMemo(() => {
        if (!isReady) {
            return null;
        }
        return `/api/v1/timkerjabkad/timkerja?tahun=${tahun}&bulan=${bulan}`;
    }, [isReady, tahun, bulan]);

    const { data, loading, error, message } = useGet<TimGetResponse[]>(
        url ?? "",
        FetchTrigger
    );

    // Fetch pertama kali saat sudah ready
    useEffect(() => {
        if (isReady) {
            setFetchTrigger(1);
        }
    }, [isReady]);

    if (!isReady) {
        return <h1>Menyiapkan periode...</h1>;
    }

    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    } else if (error) {
        return (
            <h1>{message || "-"}</h1>
        )
    } else {
        return (
            <>
                <div className="flex flex-col gap-2">
                    <ButtonSky className="flex items-center gap-1" onClick={() => setModalOpen(true)}>
                        <TbUsersGroup />
                        Tambah Tim
                    </ButtonSky>
                    {data?.map((item: TimGetResponse, index: number) => (
                        <div key={index} className="flex flex-col gap-2">
                            <TableAnggota data={item} onSuccess={() => setFetchTrigger((prev) => prev + 1)} />
                        </div>
                    ))}
                </div>
                <ModalTim
                    isOpen={ModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => setFetchTrigger((prev) => prev + 1)}
                    tahun={tahun}
                    jenis="baru"
                />
            </>
        )
    }

}
