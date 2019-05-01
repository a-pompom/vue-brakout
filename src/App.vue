<template>
  <div id="app">
	<!-- 画面 -->
	<svg id="app--screen" >
		
		<!-- ブロックのリスト
			 ボールとの衝突判定を個々のブロックで行うためにブロックリスト→各ブロックへと値を渡す
			event -[衝突判定]
			props -[ボール、ブロック、ゲーム開始フラグ] 
		-->
		<app-bricks
			v-bind:ball="ball"
			v-bind:bricks="bricks"
			v-bind:runFlg="gameRunFlg"
			v-on:collisioned="collisionedBallAndBrick"
		></app-bricks>
		
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
    <input type="range" v-model="paddle.x" min="10" max="800" 
    		class="paddle--slider">
    <!-- 制御ボタン -->
    <button type="button" v-show="!gameRunFlg && !gameEndFlg" v-on:click="start"
    		class="button--start">Start</button>
    <button type="button" v-show="gameEndFlg" v-on:click="restart"
    		class="button--retry">Restart</button>
  </div>
</template>

<script>
	//モジュールインポート
	import Bricks from './components/Bricks.vue';
	import Ball from './components/Ball.vue';
	import Paddle from './components/Paddle.vue';
	import CollisionDetector from './components/CollisionDetector.vue';
	import ScreenCollisionDetector from './components/ScreenCollisionDetector.vue';

	export default {
		data: function() {
			return {
				//ゲーム用変数
				gameRunFlg: false,
				gameEndFlg: false,
				gameReq: null,
				ballSpeedX: 6,
				colBrick: 7,
				rowBrick: 10,
				
				//画面のオブジェクト
				//各オブジェクトは衝突判定を行うため、[中心のX座標, 中心のY座標, 幅, 高さ]のデータ、
				//setCenterメソッドで中心位置を更新する機能を持つ
				screen: {					
					cx: 0,
					cy: 0,
					width: 0,
					height: 0,
					//スクリーンの幅、高さは画面が読み込まれてからスタイルによって決定されるので、
					//マウント後に動的にセット
					setScreenParam: function() {
						//HTML要素
						let screen = document.getElementById('app--screen');
						let screenWidth = screen.clientWidth;
						let screenHeight = screen.clientHeight;
						
						//中心
						this.cx = Math.floor(screenWidth / 2);
						this.cy = Math.floor(screenHeight / 2);
						//大きさ
						this.width = screenWidth;
						this.height = screenHeight;
					}
				},
				
				bricks: [],
				
				ball: {
					visible: true,
					x: 500,
					y: 580,
					cx: 0,
					cy: 0,
					radius: 20,
					width: 20,
					height: 20,
					speedX: 0,
					speedY: 5,
					setCenter: function() {
						this.cx = this.x;
						this.cy = this.y;
					}  
				},

				paddle: {
					visible: true,
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
				//開始時に()命令で実行することでwatch(追尾)を停止
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
			this.createBricks();
		},

		//コンポーネント群
		components: {
		appBricks: Bricks,
		appBall: Ball,
		appPaddle: Paddle,
		//ロジック
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
					vm.gameReq = requestAnimationFrame(loop);
				}());
			},
			/**
			 * 再開始ボタンクリック時処理
			 * 画面の状態を初期状態に戻す
			 */
			restart: function() {
				//画面の状態をリセット				
				this.createBricks();
				
				this.ball.visible = true;
				this.ball.x = 500;
				this.ball.y = 580;
				this.paddle.x = 450;
				this.paddle.y = 600;
				
				this.gameEndFlg = false;
			},
			
			/**
			 * ブロックを描画
			 * dataのbricksプロパティでコンポーネントと紐づけることで衝突判定が有効となる
			 */
			createBricks: function() {
				//再描画時に呼び出されたときを考慮してブロックのリストを初期化
				this.bricks = [];
				//vueのループで描画するので要素識別用にIDを付与
				let id = 0;
				//列
				for (let col = 0; col < this.colBrick; col++) {
					//行
					for (let row = 0; row < this.rowBrick; row++) {
						//ブロックオブジェクト
						let brick= {
									id: id,
									visible: true,
									x: 80 + col * 110,
									y: 100 + row * 20,
									cx: 0,
									cy: 0,
									width: 100,
									height: 15,
									setCenter: function() {
										this.cx = parseInt(this.x) + (this.width / 2);
										this.cy = parseInt(this.y) + (this.height / 2);
									}
						};
						this.bricks.push(brick);
						id ++;
						
					}//行ループここまで
				}//列ループここまで
			},
			/**
			 * ボールと画面の衝突時処理
			 * 衝突方向によって処理が変わる
			 * 上、左右: 衝突方向の速度成分を反転
			 * 下: ゲームオーバー
			 * @param String collisionDirection -衝突方向 X、Y、-Yいずれかの値を持つ
			 */
			collisionedBallAndScreen: function(collisionDirection) {
				switch(collisionDirection) {
					//反射処理
					case 'X':
						this.ball.speedX = -this.ball.speedX;
						break;
					case 'Y':
						this.ball.speedY = -this.ball.speedY;
						break;
						
					//ゲームオーバー処理	
					case '-Y':
						//ループを停止
						window.cancelAnimationFrame(this.gameReq);
						this.gameRunFlg = false;
						this.gameEndFlg = true;
						//画面に留まっていると不自然なので落下後にはボールを非表示とする
						this.ball.visible = false;
						break;
					default:
						break;
				}
			},
			/**
			 * ボールとパドルの衝突時処理
			 * パドル上部との衝突時のみ反射し、更に、パドルの中心との距離で速度を変化させる
			 * @param Object collisionDirection 衝突方向を管理するオブジェクト
			 */
			collisionedBallAndPaddle: function(collisionDirection) {
				if (collisionDirection.left || 
					collisionDirection.right || 
					collisionDirection.bottom) {
					return;
				}
				//上方向の衝突時のみ反射処理
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
			},
			
			/**
			 * ボールとブロックの衝突時処理
			 * @param Number index -衝突対象のブロックのインデックス
			 * @param Object collisionDirection 衝突方向を管理するオブジェクト
			 */
			collisionedBallAndBrick: function(index, collisionDirection) {
				console.log(collisionDirection);
				//衝突方向それぞれがtrueとなった場合、方向に応じた速度成分を反転
				if (collisionDirection.top || collisionDirection.bottom) {
					this.ball.speedY = -this.ball.speedY;
				}
				if (collisionDirection.left || collisionDirection.right){
					this.ball.speedX = -this.ball.speedX;
				}
				
				//衝突したブロックは非表示に切り替える
				this.bricks[index].visible = false;
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
