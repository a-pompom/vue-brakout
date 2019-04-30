<template>
	<svg>
		<svg v-if="brick.visible">
			<rect v-bind:x="brick.x" v-bind:y="brick.y" width="100" height="15" class="brick"></rect>
		</svg>
		<app-collision-ball-and-brick
				v-bind:object1="ball"
				v-bind:object2="brick"
				v-bind:runFlg= "runFlg"
				v-on:collisioned="collisionedBallAndBrick"
		></app-collision-ball-and-brick>	
	</svg>
	
</template>

<script>
	import CollisionDetector from './CollisionDetector.vue';
	export default {
		props: {
			ball: Object,
			brick: Object,
			runFlg: Boolean
		},
		
		components: {
			AppCollisionBallAndBrick: CollisionDetector
		},
		
		methods: {
			collisionedBallAndBrick: function() {
				this.$emit('collisioned');
			}
		}
	}
</script>

<style lang="scss">
	.paddle {
		stroke: #000;
		fill: #fff;
	}
</style>


