<template>
	<div>
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
			obj1XY: function() {
				return `${this.object1.x}|${this.object1.y}`;
			}
		},
		//computedの処理により、obj1XYはX座標、Y座標が格納されるので、
		//いずかが変化すればwatchに登録された処理が発火されることとなる
		watch: {
			obj1XY: function() {
				if (!this.runFlg) {
					return;
				}
				//位置から物体の中心座標を更新
				this.object1.setCenter();
				
				//スクリーンの中心と物体の中心座標の距離を導出
				//物体はスクリーンの内側に存在するので、通常の衝突とは条件が逆となる
				
				//Y方向
				let distanceY = Math.abs(this.screen.cy - this.object1.cy);
				let collisionBorderY = (this.screen.cy) - (this.object1.height);
				
				//X方向
				let distanceX = Math.abs(this.screen.cx - this.object1.cx);
				let collisionBorderX = (this.screen.cx) - (this.object1.width);
				
				//衝突フラグ
				let isXCollisioned = distanceX > collisionBorderX;
				let isYCollisioned = distanceY > collisionBorderY;
				
				if (isXCollisioned) {
					this.$emit('collisioned', 'X');
				}
				
				if (isYCollisioned) {
					this.$emit('collisioned', 'Y');
				}
				
			}
		}
	}
</script>

<style lang="scss">
</style>