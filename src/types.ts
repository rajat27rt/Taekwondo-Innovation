export type TelemetryFormat = 'CSV' | 'JSON';

export type SessionStatus = 'Validated' | 'Review Req';

export interface SessionDetails {
  duration: string;
  athlete: string;
  accelMax: number;       // In G's
  spinAvg: number;        // In RPM
  contactDuration: number; // In milliseconds
  avgVelocity: number;    // In m/s or km/h
}

export interface TelemetrySession {
  id: string;
  label: string;
  date: string;
  time: string;
  formats: TelemetryFormat[];
  kicksCount: number;
  status: SessionStatus;
  details: SessionDetails;
}

export interface AnalystPlatform {
  id: string;
  name: string;
  status: 'active' | 'linked' | 'offline';
  logoPlaceholder?: string;
  logoUrl?: string;
}

export interface LiveTelemetryFrame {
  timestamp: number;     // relative time in ms
  accelX: number;
  accelY: number;
  accelZ: number;
  rotation: number;      // Spin speed in rad/s
  force: number;         // impact shock in N
}
