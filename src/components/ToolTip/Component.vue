<template>
	<div class="tooltip">
		<slot />
		<template v-if="!this.$slots.default">
			<MetroTextBlock text-style="caption">{{ content }}</MetroTextBlock>
		</template>
	</div>
</template>

<script>
export default {
	name: "MetroToolTip",
	props: {
		content: String
	}
}
</script>