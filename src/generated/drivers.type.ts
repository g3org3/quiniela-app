export interface DriverResponse {
  MRData: MRData
}

export interface MRData {
  xmlns: string
  series: string
  url: string
  limit: string
  offset: string
  total: string
  DriverTable: DriverTable
}

export interface DriverTable {
  season: string
  Drivers: Driver[]
}

export interface Driver {
  driverId: string
  permanentNumber: string
  code: string
  url: string
  givenName: string
  familyName: string
  dateOfBirth: Date
  nationality: string
}
