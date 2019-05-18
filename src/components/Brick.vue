<template>
	<svg>
		<!-- ブロック
			visibleがfalseのときは描画しない
		-->
		<svg v-show="brick.visible">
			<rect v-bind:x="brick.x" v-bind:y="brick.y" 
				v-bind:width="brick.width" v-bind:height="brick.height" class="brick"></rect>
		</svg>
		
		<!-- ボールとブロックの衝突判定
			event -[衝突判定]
			props -[ボール、ブロック、ゲーム開始フラグ]
		-->
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
			//衝突判定
			AppCollisionBallAndBrick: CollisionDetector
		},
		
		methods: {
			/**
			 * ボールとブロックの衝突時処理
			 * 衝突したブロックのIDを渡すことで衝突対象を識別
			 */
			collisionedBallAndBrick(collisionDirection) {
				this.$emit('collisioned', this.brick.id, collisionDirection);
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


