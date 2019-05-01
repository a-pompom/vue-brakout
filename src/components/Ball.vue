<template>
	<svg>
		<circle v-show="ball.visible" v-bind:cx="ball.x" v-bind:cy="ball.y" v-bind:r="ball.radius"></circle>
	</svg>
		
	
</template>

<script>
	export default {
		props: {
			ball: Object
		}
		
	};
</script>


<style lang="scss">
</style>