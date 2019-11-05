<template>

</template>

<script>
export default {
	name: "MetroMenuFlyout",
	data: () => ({
		menuFlyout: null
	}),
	mounted() {
		this.menuFlyout = new metroUI.MenuFlyout({
			items: this.$slots.default
		});
	},
	methods: {
		show() {
			this.menuFlyout.showAt(this.$parent.$el);
		}
	}
}
</script>