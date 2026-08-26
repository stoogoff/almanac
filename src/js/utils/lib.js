
export const EASY = 'EASY'
export const MEDIUM = 'MEDIUM'
export const HARD = 'HARD'
export const EXTREME = 'EXTREME'

export const isMobile = () =>
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const showToast = text => {
	const toast = document.getElementById('toast')

	toast.innerText = text
	toast.style.display = 'flex'
}

export const shuffled = (arr, rand) => {
	const a = [...arr]

	for(let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}

	return a
}

export const pluck = (arr, rand) => {
	const index = Math.floor(rand() * arr.length);
	
	return arr[index]
}
