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
		
		<text v-bind:x="message.x" v-bind:y="message.y" class="message">{{ message.message }}</text>
		
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
    <input type="range" v-model="paddle.x" min="0" v-bind:max="sliderMax" 
    		class="paddle--slider">
    <!-- 制御ボタン -->
    <button type="button" v-show="!gameRunFlg && !gameEndFlg" v-on:click="start"
    		class="button--start">Start</button>
    <button type="button" v-show="gameRunFlg && !gameEndFlg" v-on:click="speedUp"
    		class="button--start" style="margin-left: auto;">SPEED UP!!</button>
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
		data() {
			return {
				//ゲーム用変数
				gameRunFlg: false,
				gameEndFlg: false,
				gameReq: null,
				
				//ブロックの数
				colBrick: 9,
				rowBrick: 10,
				//トータルのブロック数
				brickCount: 0,
				//スライダー幅の最大値
				sliderMax: 0,
				
				//ゲーム画面に表示するメッセージ
				message: {
					message: "",
					x: 0,
					y: 0,
					setParam(htmlScreen) {
						this.x = htmlScreen.width * 0.5;
						this.y = htmlScreen.height * 0.6;
					}
				},
				
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
					setParam(htmlScreen) {
						//中心
						this.cx = Math.floor(htmlScreen.width / 2);
						this.cy = Math.floor(htmlScreen.height / 2);
						//大きさ
						this.width = htmlScreen.width;
						this.height = htmlScreen.height;
					}
				},
				
				//ブロックのリスト
				bricks: [],
				
				//ボール
				ball: {
					visible: true,
					x: 0,
					y: 0,
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
					},
					setParam(htmlScreen) {
					    this.x = htmlScreen.width / 2;
						this.y = htmlScreen.height * 0.9;
					}
				},

				//パドル
				paddle: {
					visible: true,
					x: 0,
					y: 0,
					cx: 0,
					cy: 0,
					width: 100,
					height: 15,
					speedX: 3,
					setCenter() {
						this.cx = parseInt(this.x) + (this.width / 2);
						this.cy = parseInt(this.y) + (this.height / 2);
					},
					setParam(htmlScreen, ballSize) {
						this.width = (htmlScreen.width) * 0.2;
						this.x = (htmlScreen.width / 2);
						this.y = (htmlScreen.height * 0.9) + ballSize;
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
					this.ball.x = PaddleX  + (this.paddle.width / 2);

				}
			},
			
			gameEndFlg() {
				if(!this.gameEndFlg) {
					return;
				}
				let isFailed = false;
				this.bricks.forEach((element) => {
					if(element.visible) {
						isFailed = true;
					}
				});
				this.message.message = isFailed ? "Game Over..." : "Congratulation!!!!";
			}
		},
		
		//スタイルが読み込まれ、スクリーンのサイズが決定されてからスクリーンのプロパティをセット
		mounted() {
			this.init();
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
			 * 初期化処理
			 * 画面サイズに応じて画面上のオブジェクトの位置・大きさを動的に決定
			 */
			init() {
				//HTML要素
				let screen = this.getDOMScreen();
				
				//決定された画面サイズに応じて画面オブジェクトの位置を初期化
				this.ball.setParam(screen);
				this.paddle.setParam(screen, this.ball.radius);
				this.screen.setParam(screen);
				this.message.setParam(screen);
				
				//スライダーの最大値を画面幅-パドルの大きさとすることでパドルが常に画面内に収まるようになる
				this.sliderMax = screen.width - this.paddle.width;			
				this.message.message = "";
				
				this.brickCount = this.colBrick * this.rowBrick;
			},
			
			/**
			 * 画面サイズに関するオブジェクトを取得する
			 */
			getDOMScreen() {
				let screen = {};
				let screenDOM = document.getElementById('app--screen');
				screen.width = screenDOM.clientWidth;
				screen.height = screenDOM.clientHeight;
				
				return screen;
			},
			
			/**
			 * 開始ボタンクリック時処理
			 * ループ関数でボールを動かすことで開始とする
			 */
			start() {
				//ゲームが開始するまではループを実行しない
				if (this.gameRunFlg) {
					return;
				}
				//ランダム性を持たせるため、開始時のX方向の速度はランダムに決定
				//this.ball.speedX = Math.ceil(Math.random() * 10);
				
				this.gameRunFlg = true;
				let vm = this;
				
				//再帰呼び出しを実現するため名前付き関数を利用
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
			restart() {
				//画面の状態をリセット
				this.init();
				this.createBricks();
				
				this.ball.visible = true;
				this.gameEndFlg = false;
			},
			
			/**
			 * ゲームオーバー処理
			 */
			gameOver() {
				//ループを停止
				window.cancelAnimationFrame(this.gameReq);
				this.gameRunFlg = false;
				this.gameEndFlg = true;
				
				//画面に留まっていると不自然なので落下後にはボールを非表示とする
				this.ball.visible = false;
			},
			
			/**
			 * ボールのスピードを上昇させる
			 */
			speedUp() {
				this.ball.speedX += 2;
				this.ball.speedY += 2;
			},
			
			/**
			 * ブロックを描画
			 * dataのbricksプロパティでコンポーネントと紐づけることで衝突判定が有効となる
			 */
			createBricks() {
				//再描画時に呼び出されたときを考慮してブロックのリストを初期化
				this.bricks = [];
				//HTML要素
				let screen = this.getDOMScreen();
				//vueのループで描画するので要素識別用にIDを付与
				let id = 0;
				
				//画面サイズに応じてブロックの位置・大きさの情報
				let brickProp = {
					//描画開始位置
					startX: screen.width * 0.01,
					startY: screen.height * 0.06,
					//大きさ
					width: screen.width * 0.1,
					height: screen.height * 0.03,
					//間隔
					spaceX: screen.width * 0.01,
					spaceY: 4
				};
				
				//列
				for (let col = 0; col < this.colBrick; col++) {
					//行
					for (let row = 0; row < this.rowBrick; row++) {
						//ブロックオブジェクト
						let brick= {
									id: id,
									visible: true,
									//位置
									x: brickProp.startX + col * (brickProp.width + brickProp.spaceX),
									y: brickProp.startY + row * (brickProp.height + brickProp.spaceY),
									cx: 0,
									cy: 0,
									//大きさ
									width: brickProp.width,
									height: brickProp.height,
									//中央座標
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
			collisionedBallAndScreen(collisionDirection) {
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
						this.gameOver();
						break;
					default:
						break;
				}
			},
			/**
			 * ボールとパドルの衝突時処理
			 * ボールを反射させ、かつ、衝突方向の成分で速度を変化させる
			 * @param Object collisionDirection 衝突方向を管理するオブジェクト
			 */
			collisionedBallAndPaddle(direction) {
				//パドルの中央と衝突した場合はX方向の速度成分を0とする
				if (!direction.right && !direction.left) {
					this.ball.speedX = 0;
				}
				//衝突時のボールとパドルの距離に応じてX方向の速度を増減
				this.ball.speedX = 0.2 * Math.abs(this.ball.cx - this.paddle.cx);
				
				//Y速度成分は常に反転
				this.ball.speedY = -this.ball.speedY;
			},
			
			/**
			 * ボールとブロックの衝突時処理
			 * @param Number index -衝突対象のブロックのインデックス
			 * @param Object collisionDirection 衝突方向を管理するオブジェクト
			 */
			collisionedBallAndBrick(index, direction) {
				//衝突方向それぞれがtrueとなった場合、方向に応じた速度成分を反転
				if (direction.top || direction.bottom) {
					this.ball.speedY = -this.ball.speedY;
				}
				
				//衝突したブロックは非表示に切り替える
				this.bricks[index].visible = false;
				this.brickCount -= 1;
				//ゲームの終了判定
				let gameEnded = this.brickCount === 0 ? true : false;
				
				if (gameEnded) {
					this.gameOver();
				}
			}
		}
	}
</script>

<style lang="scss">
	#app {
		width: inherit;
		height: inherit;
		
		
		&--screen {
			width: 100%;
			height: 100%;
			
			border: 1px solid #000;
		}
	}
	
	.message {
		font-size: 150%;
		font-weight: bold;
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
