<template>
	<svg>
		<circle v-bind:cx="ball.x" v-bind:cy="ball.y" r="20"></circle>
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