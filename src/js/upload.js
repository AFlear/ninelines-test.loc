new Vue({
	el: '#app',
	data: {
		imgSrc: ''
	},
	methods: {
		uploadfile () {
			const file = document.querySelector('input[type=file]').files[0]
			const reader = new FileReader()
			reader.addEventListener('load', () => { this.imgSrc = reader.result })
			if (file) reader.readAsDataURL(file)
		}
	}
});


