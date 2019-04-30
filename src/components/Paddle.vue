<template>
	<svg>
		<rect v-bind:x="paddle.x" v-bind:y="paddle.y" width="100" height="15" class="paddle"></rect>
	</svg>
</template>


<script>
	export default {
		props: {
			paddle: Object
		}
	}
</script>


<style lang="scss">
	.paddle {
		stroke: #000;
		fill: #fff;
	}
</style>