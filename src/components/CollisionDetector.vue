<template>
	<div>
	{{ object1.y}}
	</div>
	
</template>


<script>
	export default {
		props: ['object1', 'object2', 'runFlg'],
		
		computed: {
			obj1XY: function() {
				return `${this.object1.x}|${this.object1.y}`;
			}
		},
		
		watch: {
			'object1.x': function() {
				if (!this.runFlg) {
					return;
				}
			},
			
			obj1XY: function() {
				if (!this.runFlg) {
					return;
				}
				
				this.object1.setCenter();
				this.object2.setCenter();
				
				let distanceY = Math.abs(this.object1.cy - this.object2.cy);
				let distanceX = Math.abs(this.object1.cx - this.object2.cx);
				let collisionBorderY = (this.object1.height / 2) + (this.object2.height / 2);
				let collisionBorderX = (this.object1.width / 2) + (this.object2.width / 2);
				//let collisionDirection = (this.object.cy - this.object2.cy) < 0 ? 'UP' : 'DOWN';
				let isXCollisioned = distanceX < collisionBorderX;
				let isYCollisioned = distanceY < collisionBorderY;
				//console.log(this.object2.cx);
				
				if (isXCollisioned && isYCollisioned) {
					console.log('collision');
					this.$emit('collisioned', 'test');
				}
				
			}
		},
		
		methods: {
			test: function() {
				//console.log('test');
			}
		}
	}
</script>


<style lang="scss">
</style>