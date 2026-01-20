'use client'

import { useState, useMemo, useEffect } from "react";
import Table from "./comp/table";
import { useGet } from "@/app/hooks/useGet";
import { PenilaianKinerjas } from "./type";
import { useBrandingContext } from "@/provider/BrandingProvider";

const PenilaianKinerjaTim = () => {
    const [FetchTrigger, setFetchTrigger] = useState<number>(0);
    const { branding } = useBrandingContext();

    const bulan = branding?.bulan?.value ?? null;
    const tahun = branding?.tahun?.value ?? null;


    const isReady = Number.isInteger(bulan) && Number.isInteger(tahun);


    const url = useMemo(() => {
        if (!isReady) {
            return null;
        }
        return `/api/v1/timkerjabkad/laporan_tpp_all?tahun=${tahun}&bulan=${bulan}`;
    }, [isReady, tahun, bulan]);

    const { data, loading, error, message } = useGet<PenilaianKinerjas[]>(
        url ?? "",
        FetchTrigger
    );

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
            <div className="flex flex-col gap-2">
                    <Table data={data ?? []} />
            </div>
        )
    }
}

export default PenilaianKinerjaTim;
