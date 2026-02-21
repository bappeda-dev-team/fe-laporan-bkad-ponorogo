"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { KinerjaKonkerGetResponse, PohonKinerjaKonker, IndikatorRencanaKinerja, Pelaksanas, PetugasTims, RencanaKinerjaPelaksanas, Target } from "@/types";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { formatRupiah } from "@/app/hooks/formatRupiah";

export function useCetakKonker(data: KinerjaKonkerGetResponse[]) {
    const { branding } = useBrandingContext();
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
            "Laporan Kinerja Kondisi Kerja",
            pageWidth / 2,
            12,
            { align: "center" }
        );

        doc.setFontSize(12);
        doc.text(
            `BULAN ${(branding?.bulan?.label)?.toUpperCase() || ""}`,
            pageWidth / 2,
            24,
            { align: "center" }
        );
        const body: any[] = [];

        data.map((item: KinerjaKonkerGetResponse, index: number) => {
            item.pohon_kinerja.map((pohon: PohonKinerjaKonker, pohonIndex: number) => {

                const indikatorText =
                    pohon.indikator && pohon.indikator.length > 0
                        ? pohon.indikator
                            .map((i: IndikatorRencanaKinerja, idx: number) =>
                                `${idx + 1}. ${i.nama_indikator}`
                            )
                            .join(",\n \n")
                        : "-";

                const TargetText =
                    pohon.indikator
                        ? pohon.indikator
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

                const PelaksanaText =
                    pohon.pelaksanas && pohon.pelaksanas.length > 0
                        ? pohon.pelaksanas
                            .map((p: Pelaksanas, idx: number) =>
                                `${idx + 1}. ${p.nama_pelaksana} (${p.nip_pelaksana})`
                            )
                            .join(",\n \n")
                        : "-";

                const PetugasText =
                    item.petugas_tims && item.petugas_tims.length > 0
                        ? item.petugas_tims
                            .map((p: PetugasTims, idx: number) =>
                                `${idx + 1}. ${p.nama_pegawai} (${p.pegawai_id})`
                            )
                            .join(",\n \n")
                        : "-";


                const RekinText =
                    pohon.pelaksanas && pohon.pelaksanas.length > 0
                        ? pohon.pelaksanas
                            .map((p: Pelaksanas, idx: number) =>
                                p.rencana_kinerjas && p.rencana_kinerjas.length > 0 ?
                                    p.rencana_kinerjas.map((r: RencanaKinerjaPelaksanas, p_index) =>
                                        `${idx + 1}. ${r.rencana_kinerja}`
                                    )
                                        .join(",\n \n")
                                    : "-"
                            )
                        : "-";

                body.push([
                    // Nomer
                    pohonIndex === 0
                        ? { content: index + 1, rowSpan: item.pohon_kinerja.length }
                        : { content: pohon.nama_opd, rowSpan: 0 },

                    // Program Unggulan
                    pohonIndex === 0
                        ? { content: item.program_unggulan, rowSpan: item.pohon_kinerja.length }
                        : { content: pohon.nama_pohon, rowSpan: 0 },

                    // OPD
                    pohonIndex === 0
                        ? { content: pohon.nama_opd, rowSpan: 0 }
                        : { content: indikatorText, rowSpan: 0 },

                    // Nama Pohon
                    pohonIndex === 0
                        ? { content: pohon.nama_pohon, rowSpan: 0 }
                        : { content: PelaksanaText, rowSpan: 0 },

                    // Indikator
                    pohonIndex === 0
                        ? { content: indikatorText, rowSpan: 0 }
                        : { content: TargetText, rowSpan: 0 },

                    // Target Tahun
                    pohonIndex === 0
                        ? { content: TargetText, rowSpan: 0 }
                        : { content: PetugasText, rowSpan: 0 },

                    // Pelaksana
                    pohonIndex === 0
                        ? { content: PelaksanaText, rowSpan: 0 }
                        : { content: RekinText, rowSpan: 0 },

                    // Petugas Tim
                    pohonIndex === 0
                        ? { content: PetugasText, rowSpan: 0 }
                        : { content: `Rp.${formatRupiah(pohon.realisasi_anggaran || 0)}`, rowSpan: 0 },

                    // Rencana Kinerja
                    pohonIndex === 0
                        ? { content: RekinText, rowSpan: 0 }
                        : { content: pohon.rencana_aksi ?? "-", rowSpan: 0 },

                    // Realisasi Anggaran
                    pohonIndex === 0
                        ? { content: `Rp.${formatRupiah(pohon.realisasi_anggaran || 0)}`, rowSpan: 0 }
                        : { content: pohon.faktor_pendorong, rowSpan: 0 },

                    // Rencana Aksi
                    pohonIndex === 0
                        ? { content: pohon.rencana_aksi ?? "-", rowSpan: 0 }
                        : { content: pohon.faktor_penghambat, rowSpan: 0 },

                    // Faktor Pendorong
                    pohonIndex === 0
                        ? { content: pohon.faktor_pendorong, rowSpan: 0 }
                        : { content: pohon.risiko_hukum, rowSpan: 0 },

                    // Faktor Penghambat
                    pohonIndex === 0
                        ? { content: pohon.faktor_penghambat, rowSpan: 0 }
                        : { content: pohon.rekomendasi_tl, rowSpan: 0 },

                    // Risiko Hukum
                    pohonIndex === 0
                        ? { content: pohon.risiko_hukum, rowSpan: 0 }
                        : { content: "", rowSpan: 0 },

                    // Rekomendasi Tindak Lanjut
                    pohonIndex === 0
                        ? { content: pohon.rekomendasi_tl, rowSpan: 0 }
                        : { content: "", rowSpan: 0 },
                ]);
            });
        });

        autoTable(doc, {
            startY: 32,
            theme: "grid",
            head: [[
                "No",
                "Program Unggulan",
                "OPD",
                "Nama Pohon",
                "Indikator",
                "Target Tahun",
                "Pelaksana",
                "Petugas Tim",
                "Rencana Kinerja",
                "Realisasi Anggaran",
                "Rencana Aksi",
                "Faktor Pendorong",
                "Faktor Penghambat",
                "Risiko Hukum",
                "Rekomendasi Tindak Lanjut",
                // "Target",
                // "Satuan",
            ]],
            body,
            styles: {
                fontSize: 9,
                valign: "middle",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255], // putih
                fontStyle: "bold",
                halign: "center",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
        });

        doc.save(`Kinerja-Konker-${branding?.tahun?.value || 0}.pdf`);
    };

    return { cetakPdf };
}
