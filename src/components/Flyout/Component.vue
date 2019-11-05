<template>
	<div v-show="true" ref="content">
		<slot />
		<template v-if="!this.$slots.default">{{ content }}</template>
	</div>
</template>

<script>
export default {
	name: "MetroFlyout",
	props: {
		content: String
	},
	data: () => ({
		flyout: null
	}),
	mounted() {
		this.flyout = new metroUI.Flyout({
			content: this.$refs["content"]
		});
	},
	methods: {
		show() {
			this.flyout.showAt(this.$parent.$el);
		}
	}
}
</script>