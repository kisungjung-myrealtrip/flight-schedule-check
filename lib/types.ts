export interface OperatingDays {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface FlightSchedule {
  airline: string;          // IATA 2코드 (KE, OZ, NH ...)
  flightNumber: string;     // KE123
  departureAirport: string; // IATA 3코드 (ICN, GMP ...)
  arrivalAirport: string;   // NRT, HND, BKK ...
  departureTime: string;    // HH:MM
  operatingDays: OperatingDays;
  periodStart: string;      // YYYY.MM.DD
  periodEnd: string;        // YYYY.MM.DD
}

export interface ApiResponse {
  flights: FlightSchedule[];
  fetchedAt: string; // ISO timestamp
}
