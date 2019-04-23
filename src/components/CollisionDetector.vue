<template>
	<div>
	{{ object1.y}}
	</div>
	
</template>


<script>
	export default {
		props: ['object1', 'object2', 'runFlg'],
		watch: {
			'object2.y': function() {
				if (!this.runFlg) {
					return;
				}
				let y = parseInt(this.object2.y);
				console.log(y - this.object1.y);
				if ((y - this.object1.y) === 0) {
					console.log("collision!!")
				}
			}
		}
	}
</script>


<style lang="scss">
</style>