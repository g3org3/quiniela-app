const PrismaClient = require('@prisma/client').PrismaClient
const fetch = require('node-fetch')

const prisma = new PrismaClient({
  log: ['query'],
})

/*
  driverId: 'zhou',
  permanentNumber: '24',
  code: 'ZHO',
  url: 'http://en.wikipedia.org/wiki/Guanyu_Zhou',
  givenName: 'Guanyu',
  familyName: 'Zhou',
  dateOfBirth: '1999-05-30',
  nationality: 'Chinese'
  */
async function main() {
  const res = await fetch('http://ergast.com/api/f1/2022/drivers.json')
  const data = await res.json()
  const drivers = data.MRData.DriverTable.Drivers
  drivers.map(async (driver) => {
    const { code, permanentNumber, dateOfBirth, nationality } = driver
    const name = driver.givenName + ' ' + driver.familyName
    const optionalDriver = await prisma.raceDriver.findFirst({ where: { name } })

    return (
      optionalDriver ||
      (await prisma.raceDriver.create({ data: { name, code, permanentNumber, dateOfBirth, nationality } }))
    )
  })
}
main()
  .then(() => teams())
  .then(() => races())

async function teams() {
  // create teams
  /*
   {
     constructorId: "alfa",
     url: "http://en.wikipedia.org/wiki/Alfa_Romeo_in_Formula_One",
     name: "Alfa Romeo",
     nationality: "Swiss",
    },
  */
  const res = await fetch('https://ergast.com/api/f1/2022/constructors.json')
  const data = await res.json()
  const constructors = data.MRData.ConstructorTable.Constructors
  constructors.map(async (cosntructor) => {
    const { name, nationality } = cosntructor
    const optionalItem = await prisma.raceTeam.findFirst({ where: { name } })

    return optionalItem || (await prisma.raceTeam.create({ data: { name, nationality } }))
  })
}

async function races() {
  // create teams
  /*
   {
    season: "2022",
    round: "1",
    url: "http://en.wikipedia.org/wiki/2022_Bahrain_Grand_Prix",
    raceName: "Bahrain Grand Prix",
    Circuit: {
    circuitId: "bahrain",
    url: "http://en.wikipedia.org/wiki/Bahrain_International_Circuit",
    circuitName: "Bahrain International Circuit",
    Location: {
    lat: "26.0325",
    long: "50.5106",
    locality: "Sakhir",
    country: "Bahrain",
    },
    },
    date: "2022-03-20",
    time: "15:00:00Z",
    FirstPractice: {
    date: "2022-03-18",
    time: "12:00:00Z",
    },
    SecondPractice: {
    date: "2022-03-18",
    time: "15:00:00Z",
    },
    ThirdPractice: {
    date: "2022-03-19",
    time: "12:00:00Z",
    },
    Qualifying: {
    date: "2022-03-19",
    time: "15:00:00Z",
    },
    },
  */
  const res = await fetch('https://ergast.com/api/f1/2022.json')
  const data = await res.json()
  const races = data.MRData.RaceTable.Races
  races.map(async (race) => {
    const { raceName, round, Circuit } = race
    const {
      circuitName,
      Location: { country, locality },
    } = Circuit
    const data = {
      name: raceName,
      round,
      circuit: circuitName,
      country,
      city: locality,
      startsAt: new Date(race.date + 'T' + race.time),
      userId: 'cl6k911pj0008ckyquz40syrv',
      tournamentId: 'cl6k92ubn0106ckyqq98cazqh',
    }
    const optionalItem = await prisma.race.findFirst({ where: { name: raceName } })

    const r = optionalItem || (await prisma.race.create({ data }))

    await prisma.race.update({
      data: {
        image:
          'https://newsbruit.com/wp-content/uploads/2022/06/Schedule-and-where-to-see-the-classification-of-the-Formula.jpg',
      },
      where: {
        id: r.id,
      },
    })
  })
}
