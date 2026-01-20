'use client'

import React, { useEffect, useState } from "react";
import { ModalComponent } from "@/components/page/ModalComponent";
import { TbFileDescription, TbDeviceFloppy, TbX } from "react-icons/tb";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { FloatingLabelSelect } from "@/components/global/input";
import { ButtonSky, ButtonRed } from "@/components/button/button";
import { apiFetch } from "@/lib/apiFetch";
import useToast from "@/components/global/toast";
import { AlertNotification } from "@/components/global/sweetalert2";
import { useGet } from "@/app/hooks/useGet";
import { getSessionId } from "@/lib/auth";
import { OptionType, RencanaKinerjaGetResponse, IndikatorRencanaKinerja } from "@/types";

interface Modal {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kode_tim: string;
  tahun: string;
}
interface FormValue {
  id_rencana_kinerja: RencanaKinerjaGetResponse | null;
  id_pegawai: string;
  tahun: string;
  kode_opd: string;
}

export const ModalRekin: React.FC<Modal> = ({ isOpen, onClose, onSuccess, kode_tim, tahun }) => {

  const opd = process.env.NEXT_PUBLIC_KODE_OPD;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
    defaultValues: {
      id_rencana_kinerja: null,
      id_pegawai: "",
      tahun: tahun,
      kode_opd: opd,
    }
  });

  const [OptionRekin, setOptionRekin] = useState<any[]>([]);
  const [Rekin, setRekin] = useState<RencanaKinerjaGetResponse | null>(null);

  const [Proses, setProses] = useState<boolean>(false);
  const [Loading, setLoading] = useState<boolean>(false);
  const { toastError, toastSuccess } = useToast();

  useEffect(() => {
    const S = getSessionId();
    const fetchRekin = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/perencanaan/rencana_kinerja_opd/findall?kode_opd=${opd}&tahun=${tahun}`, {
          method: "GET",
          headers: {
            "Content-Type": 'application/json',
            "X-Session-Id": `${S}`,
          },
        });
        const result = await response.json();
        if (result.code === 200) {
          const rekin = result.rencana_kinerja.map((r: RencanaKinerjaGetResponse) => ({
            value: r.id_rencana_kinerja,
            label: `${r.nama_pegawai} - ${r.nama_rencana_kinerja}`,
            nama_pegawai: r.nama_pegawai,
            id_rencana_kinerja: r.id_rencana_kinerja,
            pegawai_id: r.pegawai_id,
            nama_rencana_kinerja: r.nama_rencana_kinerja,
            indikator: r.indikator,
            tahun: r.tahun
          }));
          setOptionRekin(rekin);
        } else {
          setOptionRekin([]);
          AlertNotification("Gagal ambil data rekin", `${result.data}`, "error", 2000, true);
        }
      } catch (err) {
        AlertNotification("Gagal ambil data rekin", `${err}`, "error", 2000, true);
        console.log(err)
      } finally {
        setLoading(false);
      }
    }
    fetchRekin();
  }, []);

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    const payload = {
      id_rencana_kinerja: data.id_rencana_kinerja?.id_rencana_kinerja,
      id_pegawai: data.id_rencana_kinerja?.pegawai_id,
      tahun: data.tahun,
      kode_opd: opd
    }
    // console.log(payload);
    try {
      await apiFetch(`/api/v1/timkerjabkad/timkerja_sekretariat/${kode_tim}/rencana_kinerja`, {
        method: "POST",
        body: payload as any
      }).then(_ => {
        toastSuccess("data berhasil disimpan");
        onSuccess();
        handleClose();
      }).catch(err => {
        AlertNotification("Gagal", `${err}`, "error", 3000, true);
      })
    } catch (err) {
      console.log(err);
      AlertNotification("Gagal", "Cek koneksi internet, jika terus berlanjut hubungi tim developer", "error", 2000, true);
    } finally {
      setProses(false);
    }
  }

  const handleClose = () => {
    onClose();
    reset();
  }

  return (
    <ModalComponent isOpen={isOpen} onClose={handleClose}>
      <div className="w-max-[500px] mb-2 border-b border-blue-500 text-blue-500">
        <h1 className="flex items-center justify-center gap-1 text-xl uppercase font-semibold pb-1">
          <TbFileDescription />
          Tambah Rencana Kinerja
        </h1>
      </div>
      <div className="min-h-[420px] flex flex-col">
        <form className="flex flex-col mx-5 py-5 gap-2" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="id_rencana_kinerja"
            control={control}
            rules={{ required: "wajib dipilih" }}
            render={({ field }) => (
              <>
                <FloatingLabelSelect
                  {...field}
                  id="id_rencana_kinerja"
                  label="Rencana Kinerja"
                  options={OptionRekin}
                  isLoading={Loading}
                  onChange={(option: any) => {
                    field.onChange(option);
                    setRekin(option);
                    // console.log(option);
                  }}
                  value={Rekin}
                  isClearable
                />
                {errors.id_rencana_kinerja &&
                  <p className="text-red-400 italic">{errors.id_rencana_kinerja.message}</p>
                }
              </>
            )}
          />
          <h1>Preview Rencana Kinerja :</h1>
          {Rekin &&
            <table>
              <tbody>
                <tr>
                  <td className="max-w-[200px] p-2 bg-sky-200 border border-white rounded-tl-xl">Nama Pegawai</td>
                  <td className="p-2 bg-sky-200 border border-white rounded-tr-xl">{Rekin.nama_pegawai || "tanpa nama"}</td>
                </tr>
                <tr>
                  <td className="max-w-[200px] p-2 bg-sky-200 border border-white">Rencana Kinerja</td>
                  <td className="p-2 bg-sky-200 border border-white">{Rekin.nama_rencana_kinerja || "-"}</td>
                </tr>
                {Rekin.indikator.map((i: IndikatorRencanaKinerja, index: number) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="max-w-[200px] p-2 bg-sky-200 border border-white">Indikator {Rekin.indikator.length > 1 && `${index + 1}`}</td>
                      <td className="p-2 bg-sky-200 border border-white">{i.nama_indikator || "-"}</td>
                    </tr>
                    {i.targets.map((t: any, sub_index: number) => (
                      <tr key={sub_index}>
                        <td className="max-w-[200px] p-2 bg-sky-200 border border-white">Target / Satuan</td>
                        <td className="p-2 bg-sky-200 border border-white">{t.target || "-"} / {t.satuan || "-"}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                <tr>
                  <td className="max-w-[200px] p-2 bg-sky-200 border border-white rounded-bl-xl">Tahun</td>
                  <td className="p-2 bg-sky-200 border border-white rounded-br-xl">{Rekin.tahun || "-"}</td>
                </tr>
              </tbody>
            </table>
          }
          <div className="flex flex-col gap-2 mt-3">
            <ButtonSky
              className="w-full"
              type="submit"
              disabled={Proses}
            >
              {Proses ?
                <span className="flex">
                  Menyimpan...
                </span>
                :
                <span className="flex items-center gap-1">
                  <TbDeviceFloppy />
                  Simpan
                </span>
              }
            </ButtonSky>
            <ButtonRed className="w-full flex items-center gap-1" type="button" onClick={handleClose}>
              <TbX />
              Batal
            </ButtonRed>
          </div>
        </form>
      </div>
    </ModalComponent>
  )
}
