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

export { upstream_locations}
export type { location, dump }
