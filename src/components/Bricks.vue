<template>
	<svg>
		<app-brick
			v-bind:ball="ball"
			v-bind:runFlg="runFlg"
			v-for="brick in bricks"
			v-bind:key="brick.id"
			v-bind:brick="brick"
			
			v-on:collisioned="collisioned(brick.id)"
		>
			
		</app-brick>
	</svg>
</template>

<script>
	import Brick from './Brick.vue';
	export default {
		props: {
			ball: Object,
			bricks: Array,
			runFlg: Boolean
		},
		components: {
			AppBrick: Brick
		},
		
		methods: {
			collisioned: function(index) {
				this.$emit('collisioned', index);
			}
		}
	};
</script>


<style lang="scss">
</style>