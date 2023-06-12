import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import LayeredWaves from '../components/LayeredWaves'
import { upstream_locations } from '../data/locations';
import type { dump, location } from '../data/locations';
import { Header } from '../components/Header';
import Link from 'next/link';

function compare( a: location, b: location ) {
    if ( a.distance < b.distance ){
        return -1;
    }
    if ( a.distance > b.distance ){
        return 1;
    }
    return 0;
}

async function getData() {
    let url = "https://prod-tw-opendata-app.uk-e1.cloudhub.io/data/STE/v1/DischargeAlerts"

    const clientID = process.env.TW_CLIENT_ID || "";
    const clientSecret = process.env.TW_CLIENT_SECRET || "";

    let most_recent_dump : dump = {
        LocationName: "",
        PermitNumber: "",
        LocationGridRef: "",
        X: 0,
        Y: 0,
        ReceivingWaterCourse: "",
        StartDateTime: new Date(0),
        EndDateTime: new Date(0),
        Duration: 0,
        Ongoing: false
    }

    for (let i = 0; i < upstream_locations.length; i++) {
        let query = {
            col_1: "LocationName",
            operand_1: "eq",
            value_1: upstream_locations[i].name.toString(),
        }
    
        let new_url = url +  '?' + ( new URLSearchParams( query ) ).toString();
        const res = await fetch(new_url, {
            headers: {
                client_id: clientID,
                client_secret: clientSecret,
            },
            // cache: 'no-store',
            next: {
                revalidate: 300 // Cache for 5mins
            }
        });
        const data = await res.json();
        let temp_dumps = data.items
        let real_dumps = []

        if (!temp_dumps) {
            continue;
        }


        // console.log(new Date(temp_dumps[0].DateTime))
        // console.log(new Date(temp_dumps[0].DateTime).toLocaleString("en-GB", {timeZone: "Europe/London"}))
        // console.log(new Date(temp_dumps[0].DateTime).getTimezoneOffset())
        let ongoing = false;
        let start = new Date();
        let end = new Date();
        let duration = 0;
        for (let j=0; j < temp_dumps.length; j++) {
            ongoing = false;
            if (temp_dumps[j].AlertType == "Start") {
                start = new Date(temp_dumps[j].DateTime);
                end = new Date();
                duration = Math.abs(start.getTime() - end.getTime()) / 36e5;
                ongoing = true;
            }

            if (temp_dumps[j].AlertType == "Stop") {
                start = new Date(temp_dumps[j+1].DateTime);
                end = new Date(temp_dumps[j].DateTime);
                duration = Math.abs(start.getTime() - end.getTime()) / 36e5;
                // Assume that the next alert is a start alert
                j += 1;
            }
            
            real_dumps.push({
                LocationName: temp_dumps[j].LocationName,
                PermitNumber: temp_dumps[j].PermitNumber,
                LocationGridRef: temp_dumps[j].LocationnGridRef,
                X: temp_dumps[j].X,
                Y: temp_dumps[j].Y,
                ReceivingWaterCourse: temp_dumps[j].ReceivingWaterCourse,
                StartDateTime: start,
                EndDateTime: end,
                Duration: duration,
                Ongoing: ongoing
            })
        }
        
        upstream_locations[i].dumps = real_dumps;

        for (let j=0; j < real_dumps.length; j++) {
            if (real_dumps[j].EndDateTime > most_recent_dump.EndDateTime) {
                most_recent_dump = real_dumps[j];
            }
            if (real_dumps[j].Ongoing == true) {
                most_recent_dump = real_dumps[j];
                break;
            }
        }
    }
    const now = new Date()
    const differenceMs = Math.abs(now.getTime() - most_recent_dump.EndDateTime.getTime());

// Convert milliseconds to days and hours
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const differenceHours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const time_elapsed_since_last_dump = {
        days: differenceDays,
        hours: differenceHours,
    }

    upstream_locations.sort(compare)

    return {upstream_locations, most_recent_dump, time_elapsed_since_last_dump};
}

const Location = ({most_recent_dump, time_elapsed_since_last_dump} : {most_recent_dump : dump, time_elapsed_since_last_dump: {days:number, hours:number}}) => {
    let color = " from-cyan-500 to-blue-500";
    const bad = " from-red-500 to-orange-500";
    // most_recent_dump.Ongoing = true;

    if (time_elapsed_since_last_dump.days < 4) {
        color = bad
    } else if (most_recent_dump.Ongoing) {
        color = bad
    }

    return (
        <div className={"bg-gradient-to-l shadow-lg text-white p-6 max-w-md my-4 rounded-lg relative" + color}>
            <h2 className="text-3xl font-bold text-center">Port Meadow</h2>
            {most_recent_dump.Ongoing &&
                <div className='absolute -top-3 -right-3'>
                    <span className="relative flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
                    </span>
                </div>
            }
            {most_recent_dump.Ongoing ?
                <div>
                    <h4 className='text-center mt-3 mb-6 text-xl'>There is currently a dump in progress</h4>
                    <p className='font-light'>The dump is occuring at {most_recent_dump.LocationName}. This is upstream from this location may be affecting the water quality.</p>
                </div>
                :
                <>
                <div className='mt-4 mb-6'>
                    <h4 className='text-center'>It&apos;s been</h4>
                    <h4 className='text-center text-xl font-bold'>{
                    time_elapsed_since_last_dump.days} day{time_elapsed_since_last_dump.days > 1 && <span>s</span>} and {time_elapsed_since_last_dump.hours} hour{time_elapsed_since_last_dump.hours > 1 && <span>s</span>}</h4>
                    <h4 className='text-center'>since the last dump</h4>
                </div>
                {time_elapsed_since_last_dump.days < 4 ?
                <>
                <XCircleIcon className='mx-auto h-16 w-16 mb-8 text-white-600' />
                <p className='text-light'>It is not safe to enter the river.</p>
                </>:
                <>
                <CheckCircleIcon className='mx-auto h-16 w-16 mb-8 text-white-600' />
                <p className='text-light'>It should be safe to swim in this location now. Always check the river before entering.</p>
                </>
                }
                </>
            }
        </div>
    )
}

export default async function Home() {
    let {upstream_locations, most_recent_dump, time_elapsed_since_last_dump} = await getData();

    return (
        <main className="flex min-h-screen flex-col justify-between items-center p-0 bg-slate-50 dark:bg-slate-900">
            <Header />
            <div className='font-light py-6 px-6'>
                <div className='flex gap-4 flex-col justify-center items-center'>
                    <Location
                        most_recent_dump={most_recent_dump}
                        time_elapsed_since_last_dump={time_elapsed_since_last_dump}
                    />
                </div>
                <div className='px-8 py-4 border max-w-md w-full rounded-md shadow-lg bg-white flex flex-col sm:flex-row items-center justify-between gap-4 dark:bg-slate-800'>
                    <div>
                        <ExclamationTriangleIcon className="w-10 h-10 text-red-600 hover:animate-spin" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold">Most Recent Dump</h3>
                        <h4 className='text-xl font-light mb-3'>@ {most_recent_dump.LocationName}</h4>
                        <p><span className="font-semibold">Started at: </span> {most_recent_dump.StartDateTime.toLocaleString("en-GB")}</p>
                        <p><span className="font-semibold">Ended at: </span> {most_recent_dump.EndDateTime.toLocaleString("en-GB")}</p>
                        <p><span className="font-semibold">Duration: </span> {most_recent_dump.Duration} hours</p>
                    </div>
                    <div>
                        <ExclamationTriangleIcon className="w-10 h-10 text-red-600 hover:animate-spin" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 p-6 max-w-full ">
                <h2 className="text-4xl font-semibold text-center mt-5">Upstream Locations</h2>
                <h4 className="m-auto font-light text-center mb-5 max-w-md margin-auto">These locations have been picked from the <a className='underline text-blue-500 font-medium visited:text-purple-700' href={"https://www.thameswater.co.uk/edm-map"}>Thames Water Storm Discharge Map.</a> They are observed to affect the locations listed above.</h4>
                    {upstream_locations.length == 0 && <ArrowPathIcon className="w-6 h-6 text-blue-900 animate-spin" />}
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 table-auto">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Location Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Last Discharge
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Duration (hrs)
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Distance (miles)
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Severity
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {upstream_locations.map((location) => (
                                <tr className="bg-white border-b dark:bg-slate-800 dark:border-slate-700" key={location.name}>
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                                        <Link href={`/locations/${location.name}`} className='hover:underline cursor-pointer'>
                                            {location.name}
                                        </Link>
                                    </th>
                                    <td className="px-6 py-4">
                                    {location.dumps[0].Ongoing  ?
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 items-center">
                                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />Discharging
                                        </span>
                                        :
                                        ((location.dumps.length > 0) &&
                                            <p className="">{location.dumps[0].EndDateTime.toLocaleString("en-GB")}</p>
                                        )
                                    }
                                    </td>
                                    <td className="px-6 py-4">
                                        {location.dumps[0].Duration}
                                    </td>
                                    <td className="px-6 py-4">
                                        {location.distance}
                                    </td>
                                    <td className="px-6 py-4">
                                        {location.severity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='flex flex-col gap-2 p-6 max-w-md'>
                <Link href="/about">
                    <span className='text-center bg-gradient-to-r to-cyan-500 from-blue-500 font-medium shadow-lg rounded-full px-10 py-4 text-white text-lg'>About this project</span>
                </Link>
            </div>
            <LayeredWaves />
        </main>
    )
}