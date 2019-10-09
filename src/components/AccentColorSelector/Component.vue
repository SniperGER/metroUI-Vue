<template>
	<div class="accent-color-selector">
		<div class="accent-color-item" v-for="(_, index) in Array(48)" :key="index" :data-accent="`win10-${index + 1 < 10 ? '0' : ''}${index + 1}`" :data-accent-name="accentColorNames[index]" @click="selectAccentColor" />
	</div>
</template>

<script>
export default {
	name: "MetroAccentColorSelector",
	data: () => ({
		accentColorNames: ["yellow-gold", "gold", "orange-bright", "orange-dark", "rust", "pale-rust", "brick-red", "mod-red", "pale-red", "red", "rose-bright", "rose", "plum-light", "plum", "orchid-light", "orchid", "default-blue", "navy-blue", "purple-shadow", "purple-shadow-dark", "iris-pastel", "iris-spring", "violet-red-light", "violet-red", "cool-blue-bright", "cool-blue", "seafoam", "seafoam-team", "mint-light", "mint-dark", "turf-green", "sport-green", "gray", "gray-brown", "steel-blue", "metal-blue", "pale-moss", "moss", "meadow-green", "green", "overcast", "storm", "blue-gray", "gray-dark", "liddy-green", "sage", "camouflage-desert", "camouflage"]
	}),
	methods: {
		selectAccentColor(e) {
			if (this.accentColorNames.indexOf(document.body.getAttribute("data-accent")) >= 0) {
				document.body.setAttribute("data-accent", e.target.getAttribute("data-accent-name"));
				this.$emit("accent-select", e.target.getAttribute("data-accent-name"));
			} else {
				document.body.setAttribute("data-accent", e.target.getAttribute("data-accent"));
				this.$emit("accent-select", e.target.getAttribute("data-accent"));
			}
		}
	}
}
</script>