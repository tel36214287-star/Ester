export interface Star {
  name: string;
  ra: number; // hours
  dec: number; // degrees
  mag: number;
}

export const BRIGHT_STARS: Star[] = [
  { name: "Siriu", ra: 6.75, dec: -16.72, mag: -1.46 },
  { name: "Canopus", ra: 6.4, dec: -52.7, mag: -0.74 },
  { name: "Rigil Kentaurus", ra: 14.66, dec: -60.83, mag: -0.27 },
  { name: "Arcturus", ra: 14.26, dec: 19.18, mag: -0.05 },
  { name: "Vega", ra: 18.61, dec: 38.78, mag: 0.03 },
  { name: "Capella", ra: 5.28, dec: 46.0, mag: 0.08 },
  { name: "Rigel", ra: 5.24, dec: -8.2, mag: 0.13 },
  { name: "Procyon", ra: 7.66, dec: 5.22, mag: 0.37 },
  { name: "Achernar", ra: 1.63, dec: -57.23, mag: 0.46 },
  { name: "Betelgeuse", ra: 5.92, dec: 7.41, mag: 0.5 },
  { name: "Hadar", ra: 14.06, dec: -60.37, mag: 0.61 },
  { name: "Altair", ra: 19.85, dec: 8.87, mag: 0.76 },
  { name: "Acrux", ra: 12.44, dec: -63.1, mag: 0.76 },
  { name: "Aldebaran", ra: 4.6, dec: 16.51, mag: 0.86 },
  { name: "Spica", ra: 13.42, dec: -11.16, mag: 0.97 },
  { name: "Antares", ra: 16.49, dec: -26.43, mag: 1.05 },
  { name: "Pollux", ra: 7.76, dec: 28.02, mag: 1.14 },
  { name: "Fomalhaut", ra: 22.96, dec: -29.62, mag: 1.16 },
  { name: "Deneb", ra: 20.69, dec: 45.28, mag: 1.25 },
  { name: "Mimosa", ra: 12.79, dec: -59.69, mag: 1.25 },
  { name: "Regulus", ra: 10.14, dec: 11.97, mag: 1.35 },
  { name: "Adhara", ra: 6.98, dec: -28.97, mag: 1.51 },
  { name: "Castor", ra: 7.58, dec: 31.88, mag: 1.58 },
  { name: "Gacrux", ra: 12.52, dec: -57.11, mag: 1.63 },
  { name: "Shaula", ra: 17.56, dec: -37.11, mag: 1.63 }
];
