import { upstream_locations } from "@/src/data/locations";
import Image from "next/image";

export async function generateStaticParams() {
  return upstream_locations.map((location) => ({
    name: location.name,
  }));
}

export default function Page({ params } : { params: { name: string } }) {
  let { name } = params;
  name = decodeURIComponent(name);
  return (
    <div>
      <h1>{name}</h1>
      <Image src={`/${name}.png`} width={500} height={500} alt={`Image of site: ${name}`}/>
    </div>
  );
}