export function convertDurationToTimeNumber(duration: string): number {
	const timeStringSalts = duration.split(':')
	while (timeStringSalts.length < 3) timeStringSalts.unshift('0')

	const [hours, minutes, seconds] = timeStringSalts

	const timeHours = Number(hours ?? 0) * 3600
	const timeMinutes = Number(minutes ?? 0) * 60
	const timeSeconds = Number(seconds ?? 0)
	const timeNumber = timeHours + timeMinutes + timeSeconds

	return timeNumber
}
