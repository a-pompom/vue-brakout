<template>
	<svg>
		<!-- ブロック
			個々のブロックを実際に描画し、衝突判定をセットする
			event -[衝突判定]
			props -[ボール、ゲーム開始フラグ、各ブロック] 
		-->
		<app-brick
			v-bind:ball="ball"
			v-bind:runFlg="runFlg"
			v-for="brick in bricks"
			v-bind:key="brick.id"
			v-bind:brick="brick"
			
			v-on:collisioned="collisioned"
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
			/**
			 * 衝突時の処理
			 * @param Number index ボールと衝突したブロックのインデックス
			 * @param Object collisionDirection 衝突方向を管理するオブジェクト
			 */
			collisioned: function(index, collisionDirection) {
				this.$emit('collisioned', index, collisionDirection);
			}
		}
	};
</script>


<style lang="scss">
</style>