import TableComponent from "@/components/page/TableComponent";
import { NilaiTim } from "../../comp/NilaiTim";
import { PenilaianKinerjas } from "../../type";
import { useBrandingContext } from "@/provider/BrandingProvider";
import { ButtonBlackBorder } from "@/components/button/button";
import { TbPrinter } from "react-icons/tb";
import useToast from "@/components/global/toast";

interface Table {
    data: PenilaianKinerjas[];
}

const Table: React.FC<Table> = ({ data }) => {

    const { branding } = useBrandingContext();
    const { toastInfo } = useToast();

    const roleAccessMap: Record<string, string[]> = {
        // yang dinilai : penilai
        "Penanggung Jawab": ["super_admin"],
        "Sekretaris Tim Monev Pembangunan": ["penanggung_jawab", "super_admin"],
        "Koordinator": ["penanggung_jawab", "super_admin"],
        "Ketua Tim": ["koordinator", "super_admin"],
        "Ketua Tim 1": ["koordinator", "super_admin"],
        "Ketua Tim 2": ["koordinator", "super_admin"],
        "Ketua Tim 3": ["koordinator", "super_admin"],
        "Anggota": ["ketua_tim", "super_admin"],
    };

    const userRoles: string[] = branding?.user?.roles || [];

    const isAllowed = (jabatan: string) =>
        roleAccessMap[jabatan]?.some(role => userRoles.includes(role));

    const tdClass = `border border-blue-500 px-6 py-4 text-center`;

    return (
        <div className={`flex flex-col p-2 border-2 rounded-lg border-blue-500`}>
            <div className="flex flex-wrap items-center justify-between mb-1">
                <div className="flex flex-wrap items-center justify-between mb-2">
                    <div className="flex flex-col">
                        <h1 className="uppercase font-bold text-2xl">Penilaian Kinerja Tim {branding?.tahun?.label || "-"}</h1>
                    </div>
                </div>
            </div>
            <TableComponent className={`border-blue-500`}>
                <table className="w-full">
                    <thead>
                        <tr className={`text-white bg-blue-500`}>
                            <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Nama/NIP</th>
                            <th className="border-r border-b py-2 px-3 border-gray-300 min-w-[200px] text-center">Pangkat/Golongan/Jabatan</th>
                            <th className="border-r border-b py-2 px-3 border-gray-300 min-w-[200px] text-center">Nama Tim</th>
                            <th className="border-r border-b py-2 px-3 border-gray-300 min-w-[200px] text-center">Jabatan dalam tim</th>
                            <th className="border-r border-b py-3 px-4 border-gray-300 min-w-[200px] text-center">Nilai Kerja Tim</th>
                        </tr>
                        <tr className={`text-white bg-blue-600`}>
                            <th className="border-r border-b py-1 border-gray-300 text-center">1</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">2</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">3</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">4</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">5</th>
                            <th className="border-r border-b py-1 border-gray-300 text-center">6</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data ?
                            data.slice().map((item: PenilaianKinerjas, index: number) => {
                                const editable = isAllowed(item.nama_jabatan_tim);
                                return (
                                    <tr key={index}>
                                        <td className={`border-b border-blue-500 px-6 py-4 text-center`}>{index + 1}</td>
                                        <td className={`border border-blue-500 px-6 py-4`}>
                                            <div className="flex flex-col">
                                                <p className={`border-b border-blue-500`}>{item.nama_pegawai || "-"}</p>
                                                <p className="font-semibold">{item.id_pegawai || "-"}</p>
                                            </div>
                                        </td>
                                        <td className={`border border-blue-500 px-6 py-4`}>
                                            <div className="flex flex-col">
                                                <p className="border-b">{item.pangkat || "-"} / {item.golongan || "-"}</p>
                                                <p>{item.nama_jabatan_tim || "-"}</p>
                                            </div>
                                        </td>
                                        <td className={`border border-blue-500 px-6 py-4`}>{item.nama_tim || "-"}</td>
                                        <td className={`border border-blue-500 px-6 py-4`}>{item.nama_jabatan_tim || "-"}</td>
                                        <td className={tdClass}>
                                            {editable ? (
                                                <NilaiTim
                                                    nilai={item.kinerja_tim || 0}
                                                    kode_tim={item.kode_tim}
                                                    Data={item}
                                                />
                                            ) : (
                                                item.kinerja_tim || 0
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td colSpan={9} className={`border border-blue-500 px-6 py-4`}>Data Anggota Kosong</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </TableComponent>
        </div>
    )
}

export default Table;
