const PrismaClient = require('@prisma/client').PrismaClient
const readFileSync = require('fs').readFileSync
const path = require('path')
const z = require('zod').z

const prisma = new PrismaClient({
  log: ['query'],
})

async function main() {
  const projectPath = path.resolve(__dirname, '../')
  const file = process.argv[2]
  const filepath = path.resolve(projectPath, file)
  const content = readFileSync(filepath).toString()
  const data = JSON.parse(content)

  const user = await prisma.user.findFirstOrThrow({ where: { email: '7jagjag@gmail.com' } })
  const optionalTournament = await prisma.tournament.findFirst({ where: { name: 'World Cup 2022' } })
  const tournament =
    optionalTournament ||
    (await prisma.tournament.create({ data: { userId: user.id, name: 'World Cup 2022' } }))

  const schema = z
    .object({
      MatchNumber: z.number(),
      RoundNumber: z.number(),
      DateUtc: z.string(),
      Location: z.string(),
      HomeTeam: z.string(),
      AwayTeam: z.string(),
      Group: z.string().nullable(),
      HomeTeamScore: z.number().nullable(),
      AwayTeamScore: z.number().nullable(),
    })
    .strict()
    .array()
  try {
    const matches = schema.parse(data)
    for (const match of matches) {
      console.log('creating match: ', match.HomeTeam, ' vs ', match.AwayTeam)
      const phase = { 4: '16-round', 5: 'quarter-final', 6: 'semi-final', 7: 'final' }
      const data = {
        startsAt: new Date(match.DateUtc),
        homeTeam: match.HomeTeam,
        awayTeam: match.AwayTeam,
        phase: match.RoundNumber > 3 ? phase[match.RoundNumber] : match.Group,
        location: match.Location,
        tournamentId: tournament.id,
      }
      console.log(match.DateUtc, data)
      await prisma.match.create({ data })
    }
  } catch (err) {
    console.log(err)
    // console.error('Invalid type')
  }
}
main()
