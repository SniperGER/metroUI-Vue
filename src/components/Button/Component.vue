<template>
	<button :disabled="disabled" @click="emit('click', $event)" @contextmenu="emit('contextmenu', $event)">
		<slot />
		<template v-if="!this.$slots.default">{{ content }}</template>
		
		<slot name="flyout" />
		<slot name="context-flyout" />
	</button>
</template>

<script>
export default {
	name: "MetroButton",
	props: {
		content: String,
		disabled: Boolean
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