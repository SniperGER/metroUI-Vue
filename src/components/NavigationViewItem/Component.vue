<template>
	<div class="navigation-view-item" :class="{'icon': icon || this.$slots.icon}" :data-page-id="pageId" @click="emit('click', $event)" @contextmenu="emit('contextmenu', $event)" :disabled="disabled">
		<div class="navigation-view-item-inner">
			<div class="navigation-view-item-icon" v-if="icon || this.$slots.icon">
				<slot name="icon" />
				<MetroSymbolIcon v-if="icon && !this.$slots.icon" :symbol="icon" />
			</div>
			
			<div class="navigation-view-item-content">
				<slot name="default" />
				<MetroTextBlock v-if="!this.$slots.default" :text="content" />
			</div>
		</div>
		
		<slot name="flyout" />
		<slot name="context-flyout" />
	</div>
</template>

<script>
export default {
	name: "MetroNavigationViewItem",
	props: {
		icon: String,
		content: String,
		pageId: String,
		disabled: Boolean,
		selected: Boolean
	},
	methods: {
		emit(eventName, eventData) {
			eventData.preventDefault();
			
			if (eventName == "click" && this.$slots["flyout"] && this.$slots["flyout"].length) {
				if (["MetroContentDialog", "MetroFlyout", "MetroMenuFlyout"].indexOf(this.$slots["flyout"][0].componentOptions.tag) >= 0) {
					this.$slots["flyout"][0].componentInstance.show();
				}
			}
			
			if (eventName == "contextmenu" && this.$slots["context-flyout"] && this.$slots["context-flyout"].length) {
				if (["MetroContentDialog", "MetroFlyout", "MetroMenuFlyout"].indexOf(this.$slots["context-flyout"][0].componentOptions.tag) >= 0) {
					this.$slots["context-flyout"][0].componentInstance.show();
				}
			}
			
			this.$emit(eventName, eventData);
		}
	}
}
</script>
