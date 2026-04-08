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
import { ProgramUnggulanGetResponse, PohonKinerjaKonker, PegawaiGetResponse, IndikatorRencanaKinerja, Target } from "@/types";

interface Modal {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kode_tim: string;
  Data: PohonKinerjaKonker | null;
  tahun: number;
}
interface FormValue {
  id_program_unggulan: ProgramUnggulanGetResponse | null;
  kode_program_unggulan: string;
  tahun: string;
  kode_opd: string;
}

export const ModalPelaksana: React.FC<Modal> = ({ isOpen, onClose, onSuccess, kode_tim, Data, tahun }) => {

  const kode_opd = process.env.NEXT_PUBLIC_KODE_OPD;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
    defaultValues: {
      id_program_unggulan: null,
      kode_program_unggulan: "",
      tahun: String(tahun),
      kode_opd: kode_opd,
    }
  });

  const [OptionPegawai, setOptionPegawai] = useState<PegawaiGetResponse[]>([]);
  const [Proses, setProses] = useState<boolean>(false);
  const { toastSuccess, toastInfo } = useToast();

  const { data, error, loading } = useGet<PegawaiGetResponse[]>(`/api/v1/perencanaan/pegawai/findall?kode_opd=${kode_opd}`)

  useEffect(() => {
    if (data) {
      const pegawai = data.map((p: PegawaiGetResponse) => ({
        value: p.id,
        label: p.nama_pegawai,
        id: p.id,
        nip: p.nip,
        nama_pegawai: p.nama_pegawai,
        kode_opd: p.kode_opd,
        nama_opd: p.nama_opd,
      }));
      setOptionPegawai(pegawai);
    }
  }, [data]);

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    // backend tidak terima formdata
    const payload = {
      id_program_unggulan: data.id_program_unggulan?.id,
      kode_program_unggulan: data?.id_program_unggulan?.kode_program_unggulan,
      tahun: data.tahun,
      kode_opd: kode_opd
    }

    console.log(payload);
    toastInfo("dalam pengembangan developer")
    // try {
    //     setProses(true);
    //     await apiFetch(`/api/v1/timkerja/timkerja/program_unggulan`, {
    //         method: "POST",
    //         body: payload as any
    //     }).then(_ => {
    //         toastSuccess("data berhasil disimpan");
    //         onSuccess();
    //         handleClose();
    //     }).catch(err => {
    //         AlertNotification("Gagal", `${err}`, "error", 3000, true);
    //     })
    // } catch (err) {
    //     console.log(err);
    //     AlertNotification("Gagal", `${err}`, "error", 3000, true);
    // } finally {
    //     setProses(false);
    // }
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
          Pilih Pelaksana Program Unggulan
        </h1>
      </div>
      {error &&
        <h1 className="text-red-500">Error saat mengambil data dropwdown Pelaksana</h1>
      }
      <div className="min-h-[420px] flex flex-col">
        <form className="flex flex-col mx-5 py-5 gap-2" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="id_program_unggulan"
            control={control}
            rules={{ required: "wajib di pilih" }}
            render={({ field }) => (
              <>
                <FloatingLabelSelect
                  {...field}
                  id="id_program_unggulan"
                  label="Pilih Pelaksana"
                  options={OptionPegawai}
                  isLoading={loading}
                  isClearable
                />
                {errors.id_program_unggulan &&
                  <p className="text-red-400 italic">{errors.id_program_unggulan.message}</p>
                }
              </>
            )}
          />
          <table className="w-full">
            <tbody>
              <tr className="border bg-blue-100">
                <td className="p-2">Program Unggulan</td>
                <td className="p-2">:</td>
                <td className="p-2">{Data?.nama_program_unggulan || "-"}</td>
              </tr>
              <tr className="border">
                <td className="p-2">Pohon Kinerja</td>
                <td className="p-2">:</td>
                <td className="p-2">{Data?.nama_pohon || "-"}</td>
              </tr>
              <tr className="border">
                <td className="p-2">Perangkat Daerah</td>
                <td className="p-2">:</td>
                <td className="p-2">{Data?.nama_opd || "-"}</td>
              </tr>
              {Data?.indikator?.map((i: IndikatorRencanaKinerja, index: number) => (
                <React.Fragment key={index}>
                  <tr className="border bg-blue-100">
                    <td className="p-2">Indikator {Data?.indikator.length > 1 && index + 1}</td>
                    <td className="p-2">:</td>
                    <td className="p-2">{i.nama_indikator || "-"}</td>
                  </tr>
                  {i.targets?.map((t: Target, sub_index: number) => (
                    <tr className="border" key={sub_index}>
                      <td className="p-2">Target / Satuan</td>
                      <td className="p-2">:</td>
                      <td className="p-2">{t.target || "-"} / {t.satuan || "-"}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
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
