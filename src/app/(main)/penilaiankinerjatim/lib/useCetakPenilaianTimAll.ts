"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { GetResponseFindAllTppAllTim } from "../../laporantpp/type";
import { PenilaianKinerjas } from "../type";
import { formatRupiah } from "@/app/hooks/formatRupiah";

export function useCetakPenilaianTimAll(
    data: PenilaianKinerjas[],
    tanggal: string,
) {
    const { branding } = useBrandingContext();
    // console.log("tanggal :", tanggal);
    const cetakPdfAllTim = () => {
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
            "LAPORAN PENILAIAN KINERJA TIM",
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

        data.map((item: PenilaianKinerjas, index: number) => {
            const pajak = Number(item.tpp_pegawai?.pajak);
            const nomer = index + 1;
            const penomeran = nomer % 2 === 0 ? "right" : "left"
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
                item.nama_tim,

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
                fillColor: [41, 128, 185], // biru
                textColor: [255, 255, 255], // putih
                fontStyle: "bold",
                overflow: "linebreak",
                halign: "center",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
        });

        // Ambil posisi akhir tabel
        const finalY = (doc as any).lastAutoTable.finalY;

        // Ukuran kotak tanda tangan
        const boxWidth = 60;
        const boxX = pageWidth - boxWidth - 40; // kanan kertas
        const centerX = boxX + boxWidth / 2;

        const startY = finalY + 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Ponorogo, ${tanggal} ${branding?.bulan?.label} ${branding.tahun?.value}`, centerX, startY);

        // Semua teks pakai centerX
        doc.text(`Plt. KEPALA BADAN PENDAPATAN,`, centerX, startY + 5);
        doc.text("PENGELOLAAN KEUANGAN DAN ", centerX, startY + 9);
        doc.text("ASET DAERAH ", centerX, startY + 13);

        // Spasi tanda tangan
        doc.text(`${data[0].nama_pegawai ?? "Penanggung Jawab"}`, centerX, startY + 33);
        doc.text(`NIP ${data[0].id_pegawai ?? "-"}`, centerX, startY + 37);
        doc.text(`${data[0].pangkat ?? "N/A"} ${data[0].golongan ?? "N/A"}`, centerX, startY + 41);

        // Spasi tanda tangan
        // doc.text(`"Penanggung Jawab"}`, centerX, startY + 33);
        // doc.text(`NIP ...........`, centerX, startY + 37);
        // doc.text(`${data.penilaian_kinerjas[0].pangkat ?? "N/A"} ${data.penilaian_kinerjas[0].golongan ?? "N/A"}`, centerX, startY + 41);


        doc.save(`TPP-Konker-${branding?.bulan?.label}-${branding?.tahun?.value || 0}.pdf`);
    };

    return { cetakPdfAllTim };
}
