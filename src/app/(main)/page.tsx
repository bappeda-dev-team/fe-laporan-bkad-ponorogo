import Image from 'next/image';
import { ButtonBlackBorder } from '@/components/button/button';
import { TbSettings } from 'react-icons/tb';

export default function Home() {

  const logo = process.env.NEXT_PUBLIC_LOGO_URL || "";
  const pemda = process.env.NEXT_PUBLIC_NAMA_PEMDA || "";
  
  return (
    <>
      <div
        className="h-screen flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-2 rounded-xl py-10 px-30 shadow-2xl shadow-gray-400">
          <Image
            className='mb-3'
            src={logo || "https://cdnkk.zeabur.app/api/cdn/download/images/universal.png"}
            alt="logo"
            width={100}
            height={100}
          />
          <h1 className="text-4xl uppercase font-extrabold">Laporan BPPKAD</h1>
          <h3 className="text-base font-light">{pemda}</h3>
          <ButtonBlackBorder 
            halaman_url='/datamaster'
            className="flex items-center gap-1"
          >
            <TbSettings />
            Data Master
          </ButtonBlackBorder>
        </div>
      </div>
    </>
  );
}