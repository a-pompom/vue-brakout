<template>
  <div id="app">
	<div id="app--screen">
		<svg width="100%" height="100%">
			<app-ball
				v-bind:ball="ball"
				v-bind:screen="screen"
				v-on:screen-collisioned="toggle"
					></app-ball>

			<app-paddle
				v-bind:paddle="paddle"
			>
			</app-paddle>
		</svg>
    </div>
    <input type="range" v-model="paddle.x" min="10" max="400" value="200" class="paddle--slider">
    <button type="button" v-on:click="start">Start</button>
    <button type="button" v-on:click="toggle">Toggle</button>
  </div>
</template>

<script>
import Ball from './components/Ball.vue';
import Paddle from './components/Paddle.vue';
export default {
	data: function() {
		return {
			screen: {
				screenWidth: window.innerWidth * 0.8,
				screenHeight: window.innerHeight * 0.8,
			},
			gameRunFlg: false,
			ball: {
				x: 250,
				y: 380,
				speedX: 4,
				speedY: 3
			},
			ballX: 100,
			ballSpeedX: 3,
			paddle: {
				x: 200,
				y: 400,
				speedX: 3
			}
		};
	},
	
	watch: {
		'paddle.x'() {
			let unwatch = this.$watch('paddle.x', function(){ return; });
			console.log(unwatch);
			if (this.gameRunFlg) {
				unwatch();
			}
			if (!this.gameRunFlg) {
				
				let PaddleX = parseInt(this.paddle.x);
				this.ball.x = PaddleX + 50;
				
			}
			
		}
	},
	
	components: {
    appBall: Ball,
	appPaddle: Paddle
 	},
	
	methods: {
		start: function() {
			let vm = this;
			if (vm.gameRunFlg) {
				return;
			}
			vm.gameRunFlg = true;
			(function loop(){
				vm.ball.y += vm.ball.speedY;
				requestAnimationFrame(loop);
			}());
		},
		toggle: function() {
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
		}
	}
	
	.paddle--slider {
		width: 80%;
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
