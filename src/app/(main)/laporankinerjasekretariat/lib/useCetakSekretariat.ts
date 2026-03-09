"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { formatRupiah } from "@/app/hooks/formatRupiah";
import { RencanaKinerjaSekretariatResponse, IndikatorRencanaKinerja, SubKegiatanResponse, RencanaAksis, Target } from "@/types";

export function useCetakSekretariat(
    data: RencanaKinerjaSekretariatResponse[],
    nama_tim: string,
    keterangan_tim: string,
) {
    const { branding } = useBrandingContext();
    // console.log("tanggal :", tanggal);
    const cetakPdf = () => {
        if (!data) return;

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a3",
        });

        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);

        doc.text(
            "Laporan Kinerja Pendukung",
            pageWidth / 2,
            12,
            { align: "center" }
        );

        doc.setFontSize(12);
        doc.text(
            `${nama_tim}`,
            pageWidth / 2,
            20,
            { align: "center" }
        );

        doc.setFontSize(12);
        doc.text(
            `BULAN ${(branding?.bulan?.label)?.toUpperCase() || ""}`,
            pageWidth / 2,
            28,
            { align: "center" }
        );


        const body: any[] = [];

        data.map((item: RencanaKinerjaSekretariatResponse, index: number) => {

            const indikatorText =
                item.indikators
                    ? item.indikators
                        .map((i: IndikatorRencanaKinerja, idx: number) =>
                            `${idx + 1}. ${i.nama_indikator || "-"}`
                        )
                        .join(",\n \n")
                    : "-";

            const TargetText =
                item.indikators
                    ? item.indikators
                        .map((i: IndikatorRencanaKinerja, idx: number) =>
                            i.targets ?
                                i.targets.map((t: Target, t_index: number) => (
                                    `${idx + 1}. ${t.target || "-"} / ${t.satuan || "-"}`
                                ))
                                    .join(",\n \n")
                                : "-"
                        )
                        .join(",\n \n")
                    : "-";

            const SubKegiatanText =
                item.subkegiatan
                    ? item.subkegiatan
                        .map((i: SubKegiatanResponse, idx: number) =>
                            `${idx + 1}. (${i.kode_subkegiatan || "X"}) ${i.nama_sub_kegiatan || "-"}`
                        )
                        .join(",\n \n")
                    : "-";

            const RenaksiText =
                item.rencana_aksis
                    ? item.rencana_aksis
                        .map((i: RencanaAksis, idx: number) =>
                            `${idx + 1}. ${i.nama_rencana_aksi || "-"}`
                        )
                        .join(",\n \n")
                    : "-";

            body.push([
                // Nomer
                index + 1,

                // Rencana Kinerja
                item.rencana_kinerja || "-",

                // Indikator
                indikatorText,

                // Target
                TargetText,

                // Pemilik Rencana Kinerja
                item.nama_pegawai || "-",

                // SubKegiatan
                SubKegiatanText || "-",

                // Pagu Anggaran
                `Rp.${formatRupiah(item.pagu_anggaran || 0)}`,

                // Realisasi Anggaran
                `Rp.${formatRupiah(item.realisasi_anggaran || 0)}`,

                // Rencana Aksi
                RenaksiText || 0,

                // Faktor Pendorong
                item.faktor_pendorong || "-",

                // Faktor Penghambat
                item.faktor_penghambat || "-",

                // Risiko Hukum
                item.risiko_hukum || "-",

                // Rekomendasi Tindak Lanjut
                item.rekomendasi_tl || "-",
            ]);
        });

        const Head1 = [
            "No",
            "Rencana Kinerja",
            "Indikator Rencana Kinerja",
            "Target Tahun",
            "Pemikik Rencana Kinerja",
            "Sub Kegiatan",
            "Pagu Anggaran",
            "Realisasi Anggaran",
            "Rencana Aksi",
            "Faktor Pendorong",
            "Faktor Penghambat",
            "Risiko Hukum",
            "Rekomendasi Tindak Lanjut",
        ]
        const Head2 = Head1.map((_, idx) => `${idx + 1}`);

        autoTable(doc, {
            startY: 32,
            theme: "grid",
            head: [Head1, Head2],
            body,
            styles: {
                fontSize: 9,
                valign: "middle",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: "#33A477",
                textColor: [255, 255, 255], // putih
                fontStyle: "bold",
                overflow: "linebreak",
                halign: "center",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
        });

        doc.save(`Kinerja-Pendukung-${nama_tim}-${branding?.bulan?.label}-${branding?.tahun?.value || 0}-${keterangan_tim}.pdf`);
    };

    return { cetakPdf };
}
