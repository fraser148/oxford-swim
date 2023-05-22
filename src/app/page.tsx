import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import LayeredWaves from '../components/LayeredWaves'

interface dump {
    LocationName: string,
    PermitNumber: string,
    LocationGridRef: string,
    X: number,
    Y: number,
    ReceivingWaterCourse: string,
    StartDateTime: Date,
    EndDateTime: Date,
    Duration: number,
    Ongoing: boolean
}

interface location {
    name: string,
    distance: number,
    severity: number,
    dumps: dump[]
}

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

    const upstream_locations : location[] = [
        {
            name: "Cassington",
            distance: 4.7,
            severity: 5,
            dumps: []
        },
        {
            name: "Stanton Harcourt",
            distance: 6.3,
            severity: 2,
            dumps: []
        },
        {
            name: "South Leigh",
            distance: 7.8,
            severity: 1,
            dumps: []
        },
        {
            name: "Standlake",
            distance: 7.6,
            severity: 3,
            dumps: []
        },
        {
            name: "Woodstock",
            distance: 7.8,
            severity: 4,
            dumps: []
        },
        {
            name: "Combe",
            distance: 8.7,
            severity: 1,
            dumps: []
        },
        {
            name: "Church Hanborough",
            distance: 7.0,
            severity: 2,
            dumps: []
        }
    ]

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
                client_secret: clientSecret
            },
            // cache: 'no-store',
        });
        const data = await res.json();
        let temp_dumps = data.items
        let real_dumps = []


        // console.log(new Date(temp_dumps[0].DateTime))
        // console.log(new Date(temp_dumps[0].DateTime).toLocaleString("en-GB", {timeZone: "Europe/London"}))
        // console.log(new Date(temp_dumps[0].DateTime).getTimezoneOffset())


        for (let j=0; j < temp_dumps.length; j++) {
            if (temp_dumps[j].AlertType == "Start") {
                let start = new Date(temp_dumps[j].DateTime);
                let end = new Date();
                let duration = Math.abs(start.getTime() - end.getTime()) / 36e5;
                real_dumps.push({
                    LocationName: temp_dumps[j].LocationName,
                    PermitNumber: temp_dumps[j].PermitNumber,
                    LocationGridRef: temp_dumps[j].LocationnGridRef,
                    X: temp_dumps[j].X,
                    Y: temp_dumps[j].Y,
                    ReceivingWaterCourse: temp_dumps[j].ReceivingWaterCourse,
                    StartDateTime: new Date(temp_dumps[j].DateTime),
                    EndDateTime: new Date(temp_dumps[j].DateTime),
                    Duration: duration,
                    Ongoing: true
                })
            }

            if (temp_dumps[j].AlertType == "Stop") {
                let start = new Date(temp_dumps[j+1].DateTime);
                let end = new Date(temp_dumps[j].DateTime);
                let duration = Math.abs(start.getTime() - end.getTime()) / 36e5;
                real_dumps.push({
                    LocationName: temp_dumps[j].LocationName,
                    PermitNumber: temp_dumps[j].PermitNumber,
                    LocationGridRef: temp_dumps[j].LocationnGridRef,
                    X: temp_dumps[j].X,
                    Y: temp_dumps[j].Y,
                    ReceivingWaterCourse: temp_dumps[j].ReceivingWaterCourse,
                    StartDateTime: new Date(temp_dumps[j+1].DateTime),
                    EndDateTime: new Date(temp_dumps[j].DateTime),
                    Duration: duration,
                    Ongoing: false
                })
                j += 1;
            }
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
        <div className={"bg-gradient-to-l shadow-lg  text-white p-6 max-w-md my-4 rounded-lg relative" + color}>
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
                <CheckCircleIcon className='mx-auto h-16 w-16 mb-8 text-white-600' />
                <p className='text-light'>It should be safe to swim in this location now. Always check the river before entering.</p>
                </>
            }
        </div>
    )
}

export default async function Home() {
    let {upstream_locations, most_recent_dump, time_elapsed_since_last_dump} = await getData();

    return (
        <main className="flex min-h-screen flex-col justify-between items-center p-0">
            <div className='p-6 border-b border-slate-400 w-full'>
                <h1 className="text-4xl font-bold text-center">Oxford Swim Discharge Watch</h1>
                <h3 className="font-light text-center">Check the last time there was a discharge upstream of your location.</h3>
            </div>
            <div className='font-light max-w-6xl w-full py-6 px-6'>
                <div className='flex gap-4 flex-col justify-center items-center'>
                    <Location
                        most_recent_dump={most_recent_dump}
                        time_elapsed_since_last_dump={time_elapsed_since_last_dump}
                    />
                    {/* <Location
                        most_recent_dump={most_recent_dump}
                        time_elapsed_since_last_dump={time_elapsed_since_last_dump}
                    /> */}
                </div>
            </div>
            <div className="flex flex-col gap-2 p-6 max-w-full">
                <div className='p-4 border rounded-md border-slate-400 flex gap-4'>
                    <div>
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold">Most recent dump</h3>
                        <h4 className='text-xl font-light mb-3'>@{most_recent_dump.LocationName}</h4>
                        <p>Started at: {most_recent_dump.StartDateTime.toLocaleString("en-GB")}</p>
                        <p>Ended at: {most_recent_dump.EndDateTime.toLocaleString("en-GB")}</p>
                        <p>Duration: {most_recent_dump.Duration} hours</p>
                    </div>
                </div>
                <h2 className="text-4xl font-semibold text-center my-5">Upstream Locations</h2>
                    {upstream_locations.length == 0 && <ArrowPathIcon className="w-6 h-6 text-blue-900 animate-spin" />}
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={location.name}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {location.name}
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
            <LayeredWaves />
        </main>
    )
}