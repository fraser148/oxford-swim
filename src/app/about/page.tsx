import { Header } from "@/src/components/Header";
import LayeredWaves from "@/src/components/LayeredWaves";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const metadata = {
  title: 'About | Oxford Swim Discharge Watch',
  description: 'Check the last time there was a discharge upstream of your location.',
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col justify-between items-center p-0 bg-slate-50">
        <Header />
        <div className="flex flex-col items-center my-4 p-4">
            <div className="flex flex-col max-w-lg w-full my-5 overflow-hidden">
                <Link href="/">
                    <ArrowUturnLeftIcon className="h-8 w-8  text-gray-800 rounded-full hover:bg-blue-500 hover:text-white p-1 transition cursor-pointer"/>
                </Link>
                <h1 className="text-xl font-bold text-gray-800">About:</h1>
                <h1 className="text-6xl md:text-8xl pb-2 mt-6 font-bold text-center text-transparent bg-clip-text bg-gradient-to-l from-lime-700 to-yellow-900 overflow-auto">372,533</h1>
                <h4 className="font-light text-center">dumps of <span className="font-semibold">raw sewage</span> into our rivers in 2021 </h4>
                <h1 className="text-6xl md:text-8xl pb-2 mt-12 font-bold text-center text-transparent bg-clip-text bg-gradient-to-l from-lime-700 to-yellow-900">2.75m+</h1>
                <h4 className="font-light text-center">hours of <span className="font-semibold">raw sewage</span> discharge.</h4>
                <span className="italic mt-12 font-light">source: <a href={"https://environment.data.gov.uk/dataset/21e15f12-0df8-4bfc-b763-45226c16a8ac"}>Department for Environment Food & Rural Affairs</a></span>
                <p className="my-2 font-light mt-12">
                    This website was created to help people who swim in the River Thames to avoid swimming in the river after a discharge from a sewage treatment works.
                </p>
                <p className="my-2 font-light">
                    The data used to power this website is provided by the <a className="font-medium underline text-blue-500 visited:text-purple-700" href="https://www.thameswater.co.uk/edm-map">Thames Water Discharge Map</a>. This data is updated every 30 minutes. As such, data on this website may be up to 30 minutes out of date.
                </p>
                <p className="my-2 font-light">
                    Our rivers are being polluted by sewage discharges which has long been hidden from public view. Thanks to work from activists, such as Ash Smith, working to expose this issue, Thames Water and other water companies are now legally required to publish this data under the Environment Act. This website is an attempt to make this data more accessible to the public.
                </p>
                <hr className="my-4"/>
                <p className="my-2 font-light">
                    This website was created and is maintained by <a className="text-blue-500 visited:text-purple-700 underline" href="https://github.com/fraser148">Fraser Rennie</a>.
                </p>
                <p className="my-2 font-light">
                    Have an issue or want to contibute? <a className="text-blue-500 visited:text-purple-700 underline" href="https://github.com/fraser148/oxford-swim">Visit the GitHub repo</a>.
                </p>
                <p className="my-2 font-light">
                    Contact me at <a className="text-blue-500 visited:text-purple-700 underline" href="mailto:oxfordswim@oxtickets.co.uk">oxfordswim@oxtickets.co.uk</a> to request a feature or new location.
                </p>
            </div>
            <div className="flex max-w-md w-full rounded-md shadow-lg overflow-hidden">
                
            </div>
        </div>
        <LayeredWaves/>
    </main>
  );
}