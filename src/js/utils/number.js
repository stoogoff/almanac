
export const pad = input => {
	input = input.toString()

	return input.length < 2 ? `0${input}` : input
}

export const formatTime = time => {
	const minute = Math.floor(time / 60)
	const seconds = time % 60

	return `${pad(minute)}:${pad(seconds)}`
}
