<template>
	<div>
<!--	
	スクリーンとの衝突判定処理
	画面内のオブジェクトは全てスクリーンの内側に存在し、
	画面内のオブジェクト同士の衝突判定とは計算式が異なるので、
	別の処理とした。
	
	画面からはみ出さないよう、衝突判定の計算式は以下のものとした。
	・X:|画面中心のX座標 - 物体の中心のX座標| > (画面中心のX座標の値 - 物体の幅)
	・Y:|画面中心のY座標 - 物体の中心のY座標| > (画面中心のY座標の値 - 物体の高さ)
	上記式より、物体が画面中心より一定以上離れることによって衝突判定が真と評価される
-->
	</div>
	
</template>

<script>
	export default {
		props: {
			object1: Object, //スクリーン上を動くオブジェクト
			screen: Object, //スクリーン
			runFlg: Boolean //ゲーム開始フラグ
		},
		
		computed: {
			/**
			 * 監視対象となるオブジェクトのX座標、Y座標を文字列で連結する
			 * @returns String 当該オブジェクトのX、Y座標を文字列形式でまとめたもの
			 */
			obj1XY() {
				return `${this.object1.x}|${this.object1.y}`;
			}
		},
		//computedの処理により、obj1XYはX座標、Y座標が格納されるので、
		//いずかが変化すればwatchに登録された処理が発火されることとなる
		watch: {
			obj1XY() {
				if (!this.runFlg) {
					return;
				}
				//位置から物体の中心座標を更新
				this.object1.setCenter();
				
				//スクリーンの中心と物体の中心座標の距離を導出
				//スクリーンの中心から物体が一定以上離れると衝突判定が真と評価される
				//Y方向
				let distanceY = Math.abs(this.screen.cy - this.object1.cy);
				let collisionBorderY = (this.screen.cy) - (this.object1.height);
				
				//X方向
				let distanceX = Math.abs(this.screen.cx - this.object1.cx);
				let collisionBorderX = (this.screen.cx) - (this.object1.width);
				
				//衝突フラグ
				let isXCollisioned = distanceX > collisionBorderX;
				let isYCollisioned = distanceY > collisionBorderY;
				
				//衝突判定
				if (isXCollisioned) {
					this.$emit('collisioned', 'X');
				}
				
				if (isYCollisioned) {
					//Y方向は衝突が上か下かによって処理が変わるので分岐
					let direction = (this.screen.cy - this.object1.cy) > 0 ? '' : '-';
					this.$emit('collisioned', direction + 'Y');
				}
				
			}
		}
	}
</script>

<style lang="scss">
</style>