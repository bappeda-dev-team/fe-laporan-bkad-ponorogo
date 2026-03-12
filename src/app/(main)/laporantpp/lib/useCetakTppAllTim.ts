"use client";

import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { GetResponseFindAllTppAllTim } from "../type";
import { formatRupiah } from "@/app/hooks/formatRupiah";
import { percentDisplay } from "@/app/hooks/kehadiranHelper"
import { namaBulan } from "@/app/hooks/formatCetakBulan"
import { PenanggungJawabProps } from "@/types/penilaian_tpp";

export function useCetakTppAllTim(
    data: GetResponseFindAllTppAllTim[],
    tanggal: string,
    bulanCetak: string,
    penanggungJawab: PenanggungJawabProps
) {
    const { branding } = useBrandingContext();
    // console.log("tanggal :", tanggal);
    const cetakPdfAllTim = () => {
        if (!data) return;

        // F4 size: 210mm x 330mm
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            // format: "a3",
            format: [330, 210],
        });

        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);

        doc.text(
            "LAPORAN PENERIMAAN TPP KONDISI KERJA",
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
            namaBulan(branding.bulan),
            pageWidth / 2,
            28,
            { align: "center" }
        );


        const body: any[] = [];

        data.map((item: GetResponseFindAllTppAllTim, index: number) => {
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

                // Nomor Rekening NPWP
                { content: `${item.nomorRekening || "N/A"} / ${item.npwp || "N/A"}` },

                // Jabatan Dalam Tim
                item.nama_jabatan_tim,

                // Jabatan Dalam Tim
                item.nama_tim,

                // Basic TPP Konker
                // { content: `Rp.${formatRupiah(item.tpp_pegawai?.tpp_basic) || 0}` },

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

                // Nilai Kinerja kehadiran
                {
                    content: `${`${percentDisplay(item.kinerja_kehadiran)}%` || 0}`,
                    styles: { halign: "center" }
                },

                // Nilai Akhir
                // {
                //     content: `${item.nilai_akhir || 0}`,
                //     styles: { halign: "center" }
                // },

                // Persentase Penerimaan
                {
                    content: `${item.tpp_pegawai?.persentase_penerimaan || "-"}`,
                    styles: {
                        halign: "center"
                    }
                },

                // Jumlah Kotor
                { content: `Rp.${formatRupiah(item.tpp_pegawai?.jumlah_kotor) || 0}` },

                // Pajak
                {
                    content: `${Number.isFinite(pajak) ? `${pajak * 100}%` : "-"}`,
                    styles: { halign: "center" }
                },

                // Jumlah Pajak
                { content: `Rp.${formatRupiah(item.tpp_pegawai?.jumlah_pajak) || 0}` },

                // POT BPJS 1
                { content: `Rp.${formatRupiah(item.tpp_pegawai?.bpjs_1) || 0}` },

                // POT BPJS 4
                { content: `Rp.${formatRupiah(item.tpp_pegawai?.bpjs_4) || 0}` },

                // Jumlah Bersih
                { content: `Rp.${formatRupiah(item.tpp_pegawai?.jumlah_bersih) || 0}` },

                // TTD
                {
                    content: `${nomer}. .........`, styles: {
                        halign: penomeran,
                        minCellWidth: 20,
                    }
                },
            ]);
        });

        const Head1 = [
            "No",
            "Nama/NIP",
            "Pangkat/Golongan/Jabatan",
            "Nomor Rekening/NPWP",
            "Jabatan Dalam Tim",
            "Nama Tim",
            // "Basic TPP Konker",
            "Nilai Kinerja BPPKAD",
            "Nilai Kinerja Tim",
            "Nilai Kinerja Person",
            "Persentase Kehadiran",
            // "Nilai Akhir",
            "Persentase Penerimaan",
            "Jumlah Kotor",
            "Pajak",
            "Jumlah Pajak",
            "POT BPJS 1",
            "POT BPJS 4",
            "Jumlah Bersih",
            "Tanda Tangan",
        ]
        const Head2 = Head1.map((_, idx) => `${idx + 1}`);

        // footer total
        const totals = data.reduce(
            (acc, item) => {
                acc.kotor += item.tpp_pegawai?.jumlah_kotor ?? 0;
                acc.pajak += item.tpp_pegawai?.jumlah_pajak ?? 0;
                acc.bpjs1 += item.tpp_pegawai?.bpjs_1 ?? 0;
                acc.bpjs4 += item.tpp_pegawai?.bpjs_4 ?? 0;
                acc.bersih += item.tpp_pegawai?.jumlah_bersih ?? 0;
                return acc;
            },
            {
                kotor: 0,
                pajak: 0,
                bpjs1: 0,
                bpjs4: 0,
                bersih: 0,
            }
        );
        const footRow: RowInput = [
            { content: "Total", colSpan: 11, styles: { halign: "left", fontStyle: "bold" } },
            { content: `Rp.${formatRupiah(totals.kotor)}`, styles: { fontStyle: "bold" } },
            { content: "", styles: { halign: "right", fontStyle: "bold" } },
            { content: `Rp.${formatRupiah(totals.pajak)}`, styles: { fontStyle: "bold" } },
            { content: `Rp.${formatRupiah(totals.bpjs1)}`, styles: { fontStyle: "bold" } },
            { content: `Rp.${formatRupiah(totals.bpjs4)}`, styles: { fontStyle: "bold" } },
            { content: `Rp.${formatRupiah(totals.bersih)}`, styles: { fontStyle: "bold" } },
            { content: "" }
        ];

        const widthBPJS = 14;

        autoTable(doc, {
            startY: 32,
            theme: "grid",
            head: [Head1, Head2],
            body,
            foot: [footRow],
            showFoot: "lastPage",
            styles: {
                fontSize: 6,
                valign: "middle",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: [41, 128, 185], // biru
                textColor: [255, 255, 255], // putih
                fontStyle: "bold",
                halign: "center",
                valign: "middle",
                overflow: "linebreak",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
            },
            columnStyles: {
                14: { cellWidth: widthBPJS },
                15: { cellWidth: widthBPJS },
                16: { cellWidth: 18 }
            }
        });

        // Ambil posisi akhir tabel
        const finalY = (doc as any).lastAutoTable.finalY;

        // Ukuran kotak tanda tangan
        const boxWidth = 60;
        const boxX = pageWidth - boxWidth - 20;
        const centerX = boxX + boxWidth / 2;

        const startY = finalY + 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        doc.text(
            `Ponorogo, ${tanggal} ${bulanCetak} ${branding.tahun?.value}`,
            centerX,
            startY,
            { align: "center" }
        );

        // cetak jabatan
        const lineCount = printJabatan(
            doc,
            penanggungJawab.jabatan,
            centerX,
            startY + 5,
            boxWidth
        );

        // offset berdasarkan jumlah baris jabatan
        const offset = lineCount * 4;

        // Spasi tanda tangan
        // set bold
        doc.setFont("helvetica", "bold");

        doc.text(
            `${penanggungJawab.nama_pegawai ?? "Penanggung Jawab"}`,
            centerX,
            startY + 33 + offset,
            { align: "center" }
        );

        // hitung lebar text
        const text = `${penanggungJawab.nama_pegawai ?? "Penanggung Jawab"}`;
        const textWidth = doc.getTextWidth(text);

        // gambar underline
        doc.line(
            centerX - textWidth / 2,
            startY + 34 + offset,
            centerX + textWidth / 2,
            startY + 34 + offset
        );

        // kembalikan font normal
        doc.setFont("helvetica", "normal");


        doc.text(
            `NIP ${penanggungJawab.nip ?? "-"}`,
            centerX,
            startY + 37 + offset,
            { align: "center" }
        );

        doc.text(
            `${penanggungJawab.pangkat ?? "N/A"} ${penanggungJawab.golongan ?? "N/A"}`,
            centerX,
            startY + 41 + offset,
            { align: "center" }
        );

        // Semua teks pakai centerX
        // doc.text(penanggungJawab.jabatan, centerX, startY + 5);
        // doc.text(`Plt. KEPALA BADAN PENDAPATAN,`, centerX, startY + 5);
        // doc.text("PENGELOLA KEUANGAN DAN ", centerX, startY + 9);
        // doc.text("ASET DAERAH ", centerX, startY + 13);

        // Spasi tanda tangan
        // doc.text(`${penanggungJawab.nama_pegawai ?? "Penanggung Jawab"}`, centerX, startY + 33);
        // doc.text(`NIP ${penanggungJawab.nip ?? "-"}`, centerX, startY + 37);
        // doc.text(`${penanggungJawab.pangkat ?? "N/A"} ${penanggungJawab.golongan ?? "N/A"}`, centerX, startY + 41);

        // Spasi tanda tangan
        // doc.text(`"Penanggung Jawab"}`, centerX, startY + 33);
        // doc.text(`NIP ...........`, centerX, startY + 37);
        // doc.text(`${data.penilaian_kinerjas[0].pangkat ?? "N/A"} ${data.penilaian_kinerjas[0].golongan ?? "N/A"}`, centerX, startY + 41);


        doc.save(`TPP-Konker-${branding?.bulan?.label}-${branding?.tahun?.value || 0}.pdf`);
    };

    return { cetakPdfAllTim };
}

function printJabatan(
    doc: jsPDF,
    jabatan: string,
    centerX: number,
    startY: number,
    boxWidth: number
) {
    const lines = doc.splitTextToSize(jabatan.toUpperCase(), boxWidth);

    lines.forEach((line: string, i: number) => {
        doc.text(line, centerX, startY + i * 4, { align: "center" });
    });

    return lines.length;
}
