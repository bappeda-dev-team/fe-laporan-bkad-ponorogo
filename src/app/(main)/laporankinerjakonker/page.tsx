'use client'

import { Table } from "./comp/Table";
import { useGet } from "@/app/hooks/useGet";
import { TimGetResponse } from "@/types/tim";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { useState, useEffect, useMemo } from "react";

const LaporanKinerjaKonker = () => {

  const [FetchTrigger, setFetchTrigger] = useState<number>(0);
  const { branding } = useBrandingContext();

  const bulan = branding?.bulan?.value ?? null;
  const tahun = branding?.tahun?.value ?? null;

  const isReady = Number.isInteger(bulan) && Number.isInteger(tahun);

  const url = useMemo(() => {
    if (!isReady) {
      return null;
    }
    return `/api/v1/timkerjabkad/timkerja-non-sekretariat?tahun=${tahun}&bulan=${bulan}`;
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
        {(data?.length === 0 || data === null) ?
          <h1>Tidak ada Tim yang dibentuk / Belum Ditambahkan</h1>
          :
          data.map((item: TimGetResponse, index: number) => (
            <div key={index} className="flex flex-col p-2 mb-2 border-2 border-blue-500 rounded-lg">
              <Table data={item} />
            </div>
          ))
        }
      </>
    )
  }
}

export default LaporanKinerjaKonker;
