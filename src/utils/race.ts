export const getPoints = (race: any, racebet: any) => {
  if (!race || !racebet) return { points: 0 }
  console.log(race, racebet)
  let points = 0
  const isFirstOk = race.firstPlaceDriverId === racebet.firstPlaceDriverId
  if (isFirstOk) {
    points += 2
  }
  const isFirstTeamOk = race.firstPlaceDriver?.raceTeamId === racebet.firstPlaceDriver?.raceTeamId
  if (isFirstTeamOk) {
    points += 1
  }
  const isSecondOk = race.secondPlaceDriverId === racebet.secondPlaceDriverId
  if (isSecondOk) {
    points += 2
  }
  const isSecondTeamOk = race.secondPlaceDriver?.raceTeamId === racebet.secondPlaceDriver?.raceTeamId
  if (isSecondTeamOk) {
    points += 1
  }
  const isThirdOk = race.thirdPlaceDriverId === racebet.thirdPlaceDriverId
  if (isThirdOk) {
    points += 2
  }
  const isThirdTeamOk = race.thirdPlaceDriver?.raceTeamId === racebet.thirdPlaceDriver?.raceTeamId
  if (isThirdTeamOk) {
    points += 1
  }

  return { points, isFirstOk, isFirstTeamOk, isSecondOk, isSecondTeamOk, isThirdOk, isThirdTeamOk }
}
