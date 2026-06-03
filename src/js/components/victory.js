
const COLOURS = ['#E24B4A', '#EF9F27', '#97C459', '#378ADD', '#7F77DD', '#D4537E', '#1D9E75']
const GRAVITY = 0.22

export class Victory {
	#particles = []
	#screen = null
	#context = null
	#width = 0
	#height = 0

	#x = 0
	#y = 0
	#count = 0

	constructor(nodeOrId) {
		this.#screen = nodeOrId.constructor === String ? document.getElementById(nodeOrId) : nodeOrId
		this.#context = this.#screen.getContext('2d')

		this.#width = this.#screen.offsetWidth
		this.#height = this.#screen.offsetHeight

		this.#context.canvas.width = this.#width
		this.#context.canvas.height = this.#height
	}

	get context() {
		return this.#context
	}

	get width() {
		return this.#width
	}

	get height() {
		return this.#height
	}

	init(x, y, count) {
		this.#x = x
		this.#y = y
		this.#count = count
	}

	create() {
		this.#particles = []

		for(let i = 0; i < this.#count; i++) {
			const angle = Math.random() * Math.PI * 2
			const speed = 3 + Math.random() * 9

			this.#particles.push({
				x: this.#x,
				y: this.#y,
				vector: {
					x: Math.cos(angle) * speed,
					y: Math.sin(angle) * speed - 4,
				},
				size: 4 + Math.random() * 6,
				colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.3,
				life: 1,
				drag: 0.985 + Math.random() * 0.01
			})
		}
	}

	animate() {
		this.#context.clearRect(0, 0, this.width, this.height)

		for(let i = this.#particles.length - 1; i >= 0; i--) {
			const particle = this.#particles[i]

			particle.vector.y += GRAVITY
			particle.vector.x *= particle.drag
			particle.vector.y *= particle.drag
			particle.x += particle.vector.x
			particle.y += particle.vector.y
			particle.rotation += particle.rotationSpeed
			particle.life -= 0.008

			if(particle.life <= 0 || particle.y > this.height + 50) {
				this.#particles.splice(i, 1)
				continue
			}

			this.#context.save()
			this.#context.translate(particle.x, particle.y)
			this.#context.rotate(particle.rotation)
			this.#context.globalAlpha = Math.max(0, Math.min(1, particle.life))
			this.#context.fillStyle = particle.colour
			this.#context.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * 0.66)
			this.#context.restore()
		}
	}

	start() {
		this.create()

		let tick = 75
		let times = 3

		const animation = () => {
			this.animate()

			if(--tick < 0 && times >= 0) {
				this.create()
				tick = 75

				--times
			}

			requestAnimationFrame(animation)
		}

		animation()
	}
}
