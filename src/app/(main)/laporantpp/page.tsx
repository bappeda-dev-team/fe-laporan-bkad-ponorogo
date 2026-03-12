'use client'

import { useState, useMemo, useEffect } from "react";
import { Table } from "./comp/table";
import { ButtonBlackBorder } from "@/components/button/button";
import { useGet } from "@/app/hooks/useGet";
import { PenilaianTimResponse } from "@/types/penilaian_tpp";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { LoadingButtonClip } from "@/components/global/Loading";
import { TbPrinter } from "react-icons/tb";
import { GetResponseFindAllTppAllTim } from "./type";
import { ModalCetakTpp } from "./comp/ModalCetak";
import { PenanggungJawabProps } from "@/types/penilaian_tpp";

const LaporanTpp = () => {
    const [FetchTrigger, setFetchTrigger] = useState<number>(0);
    const { branding } = useBrandingContext();

    const bulan = branding?.bulan?.value ?? null;
    const tahun = branding?.tahun?.value ?? null;

    const isReady = Number.isInteger(bulan) && Number.isInteger(tahun);

    const [url, urlLaporanAll] = useMemo(() => {
        if (!isReady) {
            return [null, null];
        }
        return [`/api/v1/timkerjabkad/laporan_tpp?tahun=${branding?.tahun?.value}&bulan=${branding?.bulan?.value}&kodeOpd=${branding?.opd}`,
        `/api/v1/timkerjabkad/laporan_tpp_all?tahun=${branding?.tahun?.value}&bulan=${branding?.bulan?.value}&kodeOpd=${branding?.opd}`
        ];
    }, [isReady, tahun, bulan]);

    const { data, loading, error, message } = useGet<PenilaianTimResponse[]>(
        url ?? "",
        FetchTrigger
    );
    const { data: AllTim, loading: LoadingAllTim,
        error: ErrorAllTim, message: _MessageAllTim } =
        useGet<GetResponseFindAllTppAllTim[]>(
            urlLaporanAll ?? "",
            FetchTrigger);


    const [ModalCetak, setModalCetak] = useState<boolean>(false);
    const handleModalCetak = () => {
        if (ModalCetak) {
            setModalCetak(false);
        } else {
            setModalCetak(true);
        }
    }

    const penanggungJawab = useMemo(
        () => getPenanggungJawab(data ?? []),
        [data]
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
            <div className="flex flex-col gap-2">
                {data && data?.length > 0 ?
                    <>
                        <ButtonBlackBorder
                            className="flex items-center gap-1"
                            disabled={LoadingAllTim || ErrorAllTim}
                            onClick={() => handleModalCetak()}
                        >
                            {LoadingAllTim ?
                                <>
                                    <LoadingButtonClip />
                                    Loading...
                                </>
                                :
                                <>
                                    <TbPrinter />
                                    Cetak Semua Tim
                                </>
                            }
                        </ButtonBlackBorder>
                        {data?.map((item: PenilaianTimResponse, index: number) => (
                            <div key={index} className="flex flex-col gap-2">
                                <Table data={item}
                                    penanggungJawab={penanggungJawab}
                                />
                            </div>
                        ))}
                        {ModalCetak &&
                            <ModalCetakTpp
                                isOpen={ModalCetak}
                                onClose={() => handleModalCetak()}
                                DataAllTim={AllTim ?? []}
                                jenis="all"
                                penanggungJawab={penanggungJawab}
                            />
                        }
                    </>
                    :
                    <p>Laporan Bulan {branding?.bulan?.label || ""} {branding?.tahun?.label || ""} masih kosong</p>
                }
            </div>
        )
    }
}

export default LaporanTpp;

function getPenanggungJawab(tims: PenilaianTimResponse[]): PenanggungJawabProps {
    const pj = tims.find(t => t.is_penanggung_jawab)?.penilaian_kinerjas?.[0];

    if (!pj) {
        return {
            nama_pegawai: "-",
            nip: "-",
            pangkat: "-",
            golongan: "-",
            jabatan: "-",
        };
    }

    return {
        nama_pegawai: pj.nama_pegawai,
        nip: pj.id_pegawai,
        pangkat: pj.pangkat,
        golongan: pj.golongan,
        jabatan: pj.jabatan,
    };
}
