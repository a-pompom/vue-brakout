<template>
	<svg>
		<circle v-bind:cx="ball.x" v-bind:cy="ball.y" r="20"></circle>
	</svg>
		
	
</template>


<script>
	export default {
		props: ['screen', 'ball'],
		watch: {
			'ball.x': function() {
				let ballX = parseInt(this.ball.x);
				if (ballX > 500) {
					this.$emit('screen-collisioned');
				}
				if (ballX < 10) {
					this.$emit('screen-collisioned');
				}
			},
			'ball.y': function() {
				let y = parseInt(this.ball.y);
				if (y > 500) {
					this.$emit('screen-collisioned');
				}
				if (y < 10) {
					this.$emit('screen-collisioned');
				}
			}
		}
	};
</script>


<style lang="scss">
</style>