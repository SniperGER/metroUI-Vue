<template>
	<div class="menu-flyout-item" :disabled="disabled">
		<div class="menu-flyout-item-icon" v-if="icon || symbol">
			<MetroSymbolIcon :icon="icon" :symbol="symbol" />
		</div>
		
		<span class="menu-flyout-item-content">{{ text }}</span>
	</div>
</template>

<script>
export default {
	name: "MetroMenuFlyoutItem",
	props: {
		icon: String,
		symbol: String,
		text: String,
		disabled: Boolean
	}
}
</script>