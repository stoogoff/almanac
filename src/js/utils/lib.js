
export const isMobile = () =>
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const showToast = text => {
	const toast = document.getElementById('toast')

	toast.innerText = text
	toast.style.display = 'flex'
}
