<template>
	<div>
<!--	
	画面上の物体間の衝突判定処理
	物体1を常に動くオブジェクトとして監視することで衝突を検知する。
	
	衝突判定の計算式は以下のものとした。
	・X:|物体1の中心のX座標 - 物体2の中心のX座標| < (物体1の幅/2 + 物体2の幅/2)
	・Y:|物体1の中心のY座標 - 物体2の中心のY座標| < (物体1の高さ/2 + 物体2の高さ/2)
	上記式より、物体間の距離が互いに接している状態のときよりも小さい場合に衝突判定が真と評価される。
-->
	</div>
	
</template>


<script>
	export default {
		props: {
			object1: Object,
			object2: Object,
			runFlg: Boolean
		},
		
		/**
		* 監視対象となるオブジェクトのX座標、Y座標を文字列で連結する
		* @returns String 当該オブジェクトのX、Y座標を文字列形式でまとめたもの
		*/
		computed: {
			obj1XY: function() {
				return `${this.object1.x}|${this.object1.y}`;
			}
		},
		
		//computedの処理により、obj1XYはX座標、Y座標が格納されるので、
		//いずかが変化すればwatchに登録された処理が発火されることとなる
		watch: {
			/**
			 * 物体間で衝突が発生したかチェック
			 */
			obj1XY: function() {
				//ボールが動いていないときはチェックの必要がないのでスキップ
				if (!this.runFlg) {
					return;
				}
				//visibleでないオブジェクトは判定の必要がないのでスキップ
				if (!this.object2.visible) {
					return;
				}
				
				//比較用の中心座標を更新
				this.object1.setCenter();
				this.object2.setCenter();
				
				//各物体の中心座標から物体間の距離を導出
				//各物体が一定以上近くと衝突判定が真と評価される
				//Y方向
				let distanceY = Math.abs(this.object1.cy - this.object2.cy);
				let collisionBorderY = (this.object1.height / 2) + (this.object2.height / 2);
				
				//X方向
				let distanceX = Math.abs(this.object1.cx - this.object2.cx);
				let collisionBorderX = (this.object1.width / 2) + (this.object2.width / 2);
				
				//衝突フラグ
				let isXCollisioned = distanceX <= collisionBorderX;
				let isYCollisioned = distanceY <= collisionBorderY;
				
				if (isXCollisioned && isYCollisioned) {
					//二物体の中心座標の位置関係、及び衝突時に接していた辺から衝突方向を導出
					//例えば、物体1が物体2に上から衝突した場合、以下の条件を満たす
					// ・物体1のY座標 < 物体2のY座標
					// ・二物体が縦方向で接している
					let collisionDirection = {
						top: this.object1.cy < this.object2.cy && 
								distanceY === collisionBorderY ? true : false,
						bottom: this.object1.cy > this.object2.cy && 
								distanceY === collisionBorderY ? true : false,
						left: this.object1.cx < this.object2.cx &&
								distanceX === collisionBorderX ? true : false,
						right: this.object1.cx > this.object2.cx &&
								distanceX === collisionBorderX ? true : false,
					};
					this.$emit('collisioned', collisionDirection);
				}
				
			}
		}//watchここまで
	};
</script>


<style lang="scss">
</style>