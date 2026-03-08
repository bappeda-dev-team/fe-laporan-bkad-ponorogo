"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { formatRupiah } from "@/app/hooks/formatRupiah";
import { GetResponsePenilaianKinerja, PenilaianKinerjas } from "../type";

export function useCetakPenilaianTim(
    data: GetResponsePenilaianKinerja | null,
    nama_tim: string,
    keterangan_tim: string,
    sekretariat: boolean,
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
            "LAPORAN Penilaian Kinerja Tim",
            pageWidth / 2,
            12,
            { align: "center" }
        );

        doc.setFontSize(12);
        doc.text(
            "BADAN PENDAPATAN, PENGELOLAAN KEUANGAN DAN ASET DAERAH",
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

        data.penilaian_kinerjas.map((item: PenilaianKinerjas, index: number) => {
            body.push([
                // Nomer
                index + 1,

                // Nama NIP
                { content: `${item.nama_pegawai} (${item.id_pegawai})` },

                // Pangkat Golongan Jabatan
                { content: `${item.pangkat || "N/A"} -  ${item.golongan || "N/A"} - ${item.nama_jabatan_tim || "N/A"}` },

                // Jabatan Dalam Tim
                item.nama_jabatan_tim,

                // Jabatan Dalam Tim
                data.nama_tim,

                // Basic TPP Konker
                { content: `Rp.${formatRupiah(item.tpp_pegawai?.tpp_basic) || 0}` },

                // Nilai Kinerja Bappeda
                {
                    content: `${item.kinerja_bappeda || 0}`,
                    styles: { halign: "center" }
                },

                // Nilai Kinerja Tim
                {
                    content: `${item.kinerja_tim || 0}`,
                    styles: { halign: "center" }
                },

                // Nilai Kinerja Person
                {
                    content: `${item.kinerja_person || 0}`,
                    styles: { halign: "center" }
                },

                // Nilai Akhir
                {
                    content: `${item.nilai_akhir || 0}`,
                    styles: { halign: "center" }
                },
            ]);
        });

        const Head1 = [
            "No",
            "Nama/NIP",
            "Pangkat/Golongan/Jabatan",
            "Jabatan Dalam Tim",
            "Nama Tim",
            "Basic TPP Konker",
            "Nilai Kinerja BPPKAD",
            "Nilai Kinerja Tim",
            "Nilai Kinerja Person",
            "Nilai Akhir",
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
                fillColor: sekretariat ? "#33A477" : [41, 128, 185], // biru
                textColor: [255, 255, 255], // putih
                fontStyle: "bold",
                halign: "center",
                overflow: "linebreak",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
        });

        doc.save(`Penilaian-Kinerja-Tim-${nama_tim}-${branding?.bulan?.label}-${branding?.tahun?.value || 0}-${keterangan_tim}.pdf`);
    };

    return { cetakPdf };
}
