import { 
    Observer, 
    Body, 
    Equator, 
    Horizon
} from 'astronomy-engine';

export interface CelestialPosition {
    ra: number;
    dec: number;
    alt?: number;
    az?: number;
    constellation: string;
}

export function formatRA(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = ((hours - h - m / 60) * 3600).toFixed(1);
    return `${h}h ${m}m ${s}s`;
}

export function formatDec(degrees: number): string {
    const sign = degrees < 0 ? '-' : '+';
    const abs = Math.abs(degrees);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    const s = ((abs - d - m / 60) * 3600).toFixed(1);
    return `${sign}${d}° ${m}' ${s}"`;
}

export function getCelestialState(date: Date, lat: number, lon: number) {
    const observer = new Observer(lat, lon, 0);
    
    const bodies = [
        Body.Sun, Body.Moon, Body.Mercury, Body.Venus, 
        Body.Mars, Body.Jupiter, Body.Saturn
    ];

    const results: Record<string, CelestialPosition> = {};

    bodies.forEach(body => {
        const equ = Equator(body, date, observer, true, true);
        const hor = Horizon(date, observer, equ.ra, equ.dec, 'normal');
        
        results[body] = {
            ra: equ.ra,
            dec: equ.dec,
            alt: hor.altitude,
            az: hor.azimuth,
            constellation: "Calculando..." 
        };
    });

    return results;
}
