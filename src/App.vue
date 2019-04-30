<template>
  <div id="app">
	<!-- 画面 -->
	<svg id="app--screen" >
		
		
	
		<!-- ボール
			props -[ボールオブジェクト] 
		-->
		<app-ball
			v-bind:ball="ball"
		></app-ball>
		
		<!-- パドル
			props -[パドルオブジェクト] 
		-->
		<app-paddle
			v-bind:paddle="paddle"
		>
		</app-paddle>
		
		<!-- ボールとパドルの衝突判定処理 
			event -[衝突判定]
			props -[ボール、パドル、ゲーム開始フラグ] 
		-->
		<app-collision-ball-and-paddle
			v-bind:object1="ball"
			v-bind:object2="paddle"
			v-bind:runFlg= "gameRunFlg"
			v-on:collisioned="collisionedBallAndPaddle"
		></app-collision-ball-and-paddle>
		
		<!-- ボールとスクリーンの衝突判定処理 
			event -[衝突判定]
			props -[ボール、スクリーン、ゲーム開始フラグ] 
		-->
		<app-collision-ball-and-screen
			v-bind:object1="ball"
			v-bind:screen="screen"
			v-bind:runFlg= "gameRunFlg"
			v-on:collisioned="collisionedBallAndScreen"
		></app-collision-ball-and-screen>

	</svg>
   		
	<!-- 操作盤 -->
    <input type="range" v-model="paddle.x" min="10" max="900" value="400" class="paddle--slider">
    <!-- 制御ボタン -->
    <button type="button" v-on:click="start">Start</button>
    <button type="button" v-on:click="toggle">Toggle</button>
  </div>
</template>

<script>
	//モジュールインポート
	import Ball from './components/Ball.vue';
	import Paddle from './components/Paddle.vue';
	import CollisionDetector from './components/CollisionDetector.vue';
	import ScreenCollisionDetector from './components/ScreenCollisionDetector.vue';

	export default {
		data: function() {
			return {
				gameRunFlg: false,
				ballSpeedX: 3,
				screen: {					
					cx: 0,
					cy: 0,
					width: 0,
					height: 0,
					//スクリーンの幅、高さは画面が読み込まれてからスタイルによって決定されるので、
					//マウント後に動的にセット
					setScreenParam: function() {
						let screen = document.getElementById('app--screen');
						let screenWidth = screen.clientWidth;
						let screenHeight = screen.clientHeight;
						
						this.cx = Math.floor(screenWidth / 2);
						this.cy = Math.floor(screenHeight / 2);
						this.width = screenWidth;
						this.height = screenHeight;
					}
				},
				
				ball: {
					x: 500,
					y: 580,
					cx: 0,
					cy: 0,
					radius: 20,
					width: 20,
					height: 20,
					speedX: 0,
					speedY: 3,
					setCenter: function() {
						this.cx = this.x;
						this.cy = this.y;
					}  
				},

				
				paddle: {
					x: 450,
					y: 600,
					cx: 0,
					cy: 0,
					width: 100,
					height: 15,
					speedX: 3,
					setCenter: function() {
						this.cx = parseInt(this.x) + (this.width / 2);
						this.cy = parseInt(this.y) + (this.height / 2);
					}
				}
			};
		},
		
		//ゲームが開始するまではボールがパドルを追尾
		watch: {
			'paddle.x'() {
				//unwatchにはwatchを停止する関数が戻り値として格納される
				//開始時に()命令で実行することでwatchを停止
				let unwatch = this.$watch('paddle.x', function(){ return; });
				if (this.gameRunFlg) {
					unwatch();
				}
				if (!this.gameRunFlg) {
					let PaddleX = parseInt(this.paddle.x);
					this.ball.x = PaddleX + 50;

				}
			}
		},
		
		//スタイルが読み込まれ、スクリーンのサイズが決定されてからスクリーンのプロパティをセット
		mounted: function() {
			this.screen.setScreenParam();
		},

		//コンポーネント群
		components: {
		appBall: Ball,
		appPaddle: Paddle,
		appCollisionBallAndPaddle: CollisionDetector,
		appCollisionBallAndScreen: ScreenCollisionDetector
		},

		//処理
		methods: {
			/**
			 * 開始ボタンクリック時処理
			 * ループ関数でボールを動かすことで開始とする
			 */
			start: function() {
				let vm = this;
				if (vm.gameRunFlg) {
					return;
				}
				vm.gameRunFlg = true;
				(function loop(){
					vm.ball.y -= vm.ball.speedY;
					vm.ball.x -= vm.ball.speedX;
					requestAnimationFrame(loop);
				}());
			},
			
			toggle: function() {
				console.log(document.getElementById('app--screen').offsetWidth);
				this.ball.speedY = -this.ball.speedY;
			},
			
			/**
			 * ボールと画面の衝突時処理 ボールを反射させる
			 * @param String collisionDirection -衝突方向 X方向かY方向かのみを区別
			 */
			collisionedBallAndScreen: function(collisionDirection) {
				switch(collisionDirection) {
					case 'X':
						this.ball.speedX = -this.ball.speedX;
						break;
					case 'Y':
						this.ball.speedY = -this.ball.speedY;
						break;
					default:
						break;
				}
			},

			collisionedBallAndPaddle: function(collisionDirection) {
				if (this.ball.cx > this.paddle.cx) {
					this.ball.speedX = -this.ballSpeedX;
				}
				if (this.ball.cx === this.paddle.cx) {
					this.ball.speedX = 0;
				}
				if (this.ball.cx < this.paddle.cx) {
					this.ball.speedX = this.ballSpeedX;
				}
				this.ball.speedY = -this.ball.speedY;
			}
		}
	}
</script>

<style lang="scss">
	#app {
		width: 100%;
		height: 100%;
		
		&--screen {
			width: 100%;
			height: 100%;
			border: 1px solid #000;
		}
	}
	
	.paddle--slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 25px;
		background: #d3d3d3;
		outline: none;
		
		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			width: 25px;
			height: 25px;
			background: #9abff9;
			cursor: pointer;
		}
	}
</style>
