
export interface DomainMapModel {
    id: string;
    group: string;
    key: string;
    value: string;
    start: [number, number];
    end: [number, number];
    geojson: any;
    status: string;
}