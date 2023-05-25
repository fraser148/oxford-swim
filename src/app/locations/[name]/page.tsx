import { Header } from "@/src/components/Header";
import LayeredWaves from "@/src/components/LayeredWaves";
import { upstream_locations } from "@/src/data/locations";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return upstream_locations.map((location) => ({
    name: location.name,
  }));
}

export default function Page({ params } : { params: { name: string } }) {
  let { name } = params;
  name = decodeURIComponent(name);
  return (
    <main className="flex min-h-screen flex-col justify-between items-center p-0 bg-slate-50">
        <Header />
        <div className="flex flex-col items-center my-4">
            <div className="flex flex-col max-w-md w-full my-5">
                <Link href="/">
                    <ArrowUturnLeftIcon className="h-8 w-8 -ml-2 text-gray-800 rounded-full hover:bg-blue-500 hover:text-white p-1 transition cursor-pointer"/>
                </Link>
                <h1 className="text-xl font-bold text-gray-800">Location:</h1>
                <h1 className="text-3xl font-extralight">{name}</h1>
            </div>
            <div className="flex max-w-md w-full rounded-md shadow-lg overflow-hidden">
                <Image src={`/${name}.png`} width={500} height={500} alt={`Image of site: ${name}`}/>
            </div>
        </div>
        <LayeredWaves/>
    </main>
  );
}