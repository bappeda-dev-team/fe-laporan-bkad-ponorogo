"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { formatRupiah } from "@/app/hooks/formatRupiah";
import { GetResponsePenilaianKinerja, PenilaianKinerjas } from "../type";

export function useCetakPerson() {
    const { branding } = useBrandingContext();
    const cetakPersonPdf = (
        data: PenilaianKinerjas | null,
        nama: string,
        nip: string,
        jabatan_dinas: string,
        jabatan_tim: string,
        is_sekretariat: boolean,
        nama_tim: string,
    ) => {
        if (!data) return;

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a3",
        });

        const pageWidth = doc.internal.pageSize.getWidth();

        // FUNCTION KALIMAT PEMBUKA DI BAWAH HEADER
        let kalimat = ""
        if (jabatan_tim === "Penanggung Jawab") {
            kalimat = "bertanggung jawab dalam pelaksanaan program"
        } else if (jabatan_tim === "Koordinator" && !is_sekretariat) {
            kalimat = "memberikan rekomendasi tindak lanjut atas permasalahan"
        } else if ((jabatan_tim === "Ketua Tim 1" || jabatan_tim === "Ketua Tim 2") && !is_sekretariat) {
            kalimat = "melaksanakan analisa faktor pendorong dan penghambat terhadap kinerja operasional"
        } else if (jabatan_tim === "Anggota" && !is_sekretariat) {
            kalimat = "melaksanakan pemantauan terhadap kinerja operasional"
        } else if (jabatan_tim === "Koordinasi" && is_sekretariat) {
            kalimat = "memberikan rekomendasi tindak lanjut atas permasalahan dukungan operasional dalam pelaksanaan"
        } else if ((jabatan_tim === "Ketua Tim 1" || jabatan_tim === "Ketua Tim 2") && is_sekretariat) {
            kalimat = "melakukan analisa faktor pendorong dan penghambat atas pelaksanaan"
        } else if (jabatan_tim === "Anggota" && is_sekretariat) {
            kalimat = "memberikan dukungan operasional"
        } else {
            kalimat = "memberikan dukungan"
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);

        doc.text(
            "LAPORAN KINERJA TPP KONDISI KERJA",
            pageWidth / 2,
            12,
            { align: "center" }
        );

        doc.setFontSize(12);
        doc.text(
            `BULAN ${(branding?.bulan?.label)?.toUpperCase() || ""}`,
            pageWidth / 2,
            20,
            { align: "center" }
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        autoTable(doc, {
            startY: 28,
            theme: "plain",
            styles: {
                fontSize: 11,
                cellPadding: 1,
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 5, halign: "center" },
                2: { cellWidth: 200 }
            },
            body: [
                ["Nama", ":", nama],
                ["NIP", ":", nip],
                ["Jabatan Dalam Dinas", ":", jabatan_dinas],
                ["Jabatan Dalam Tim", ":", `${jabatan_tim}, ${nama_tim}`],
            ],
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        doc.text(
            `Telah ${kalimat} program prioritas daerah sebagai berikut :`,
            pageWidth / 30,
            finalY + 8,
        );

        const Head1 =
            (jabatan_tim === "Penanggung Jawab" && !is_sekretariat) ?
                [
                    "No",
                    "Program Prioritas Daerah",
                    "Rencana Kinerja Operational",
                    "Indikator",
                    "Target",
                    "Satuan",
                    "Sub Kegiatan",
                    "Pagu Anggaran",
                    "Realisasi Anggaran",
                    "Rencana Aksi",
                    "Faktor Pendorong",
                    "Faktor Penghambat",
                    "Risiko Hukum",
                    "Rekomendasi Rencana Tindak Lanjut",
                ]
                : (jabatan_tim === "Koordinator" && !is_sekretariat) ?
                    [
                        "No",
                        "Program Prioritas Daerah",
                        "Rencana Kinerja Operational",
                        "Indikator",
                        "Target",
                        "Satuan",
                        "Sub Kegiatan",
                        "Pagu Anggaran",
                        "Realisasi Anggaran",
                        "Rencana Aksi",
                        "Faktor Pendorong",
                        "Faktor Penghambat",
                        "Risiko Hukum",
                        "Rekomendasi Rencana Tindak Lanjut",
                    ]
                    : ((jabatan_tim === "Ketua Tim 1" || jabatan_tim === "Ketua Tim 2") && !is_sekretariat) ?
                        [
                            "No",
                            "Program Prioritas Daerah",
                            "Rencana Kinerja Operational",
                            "Indikator",
                            "Target",
                            "Satuan",
                            "Sub Kegiatan",
                            "Pagu Anggaran",
                            "Realisasi Anggaran",
                            "Rencana Aksi",
                            "Faktor Pendorong",
                            "Faktor Penghambat",
                        ]
                        : (jabatan_tim === "Anggota" && !is_sekretariat) ?
                            [
                                "No",
                                "Program Prioritas Daerah",
                                "Rencana Kinerja Operational",
                                "Indikator",
                                "Target",
                                "Satuan",
                                "Sub Kegiatan",
                                "Pagu Anggaran",
                                "Realisasi Anggaran",
                                "Rencana Aksi",
                            ]
                            : (is_sekretariat) ?
                                [
                                    "No",
                                    "Rencana Kinerja",
                                    "Indikator Kinerja",
                                    "Target",
                                    "Pemilik Rencana Kinerja",
                                    "Sub Kegiatan",
                                    "Pagu Anggaran",
                                    "Realisasi Anggaran",
                                    "Rencana Aksi/Kegiatan yang Dilaksanakan",
                                    "Faktor Pendorong",
                                    "Faktor Penghambat",
                                    "Risiko Hukum",
                                    "Rekomendasi Tindak Lanjut",
                                ]
                                :
                                [
                                    "No",
                                    "Rencana Kinerja",
                                    "Indikator Kinerja",
                                    "Target",
                                    "Pemilik Rencana Kinerja",
                                    "Sub Kegiatan",
                                    "Pagu Anggaran",
                                    "Realisasi Anggaran",
                                    "Rencana Aksi/Kegiatan yang Dilaksanakan",
                                    "Faktor Pendorong",
                                    "Faktor Penghambat",
                                    "Risiko Hukum",
                                    "Rekomendasi Tindak Lanjut",
                                ]

        const Head2 = Head1.map((_, idx) => `${idx + 1}`);

        autoTable(doc, {
            startY: finalY + 15,
            theme: "grid",
            head: [Head1, Head2],
            styles: {
                fontSize: 9,
                valign: "middle",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: "white",
                textColor: "black",
                fontStyle: "bold",
                halign: "center",
                overflow: "linebreak",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
        });

        doc.save(`Laporan Kinerja TPP Kondisi Kerja-${nama}-${branding?.bulan?.label}-${branding?.tahun?.value || 0}.pdf`);
    };

    return { cetakPersonPdf };
}
