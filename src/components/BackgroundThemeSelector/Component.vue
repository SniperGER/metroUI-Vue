<template>
	<MetroStackPanel orientation="vertical" class="background-theme-selector">
		<MetroRadioButton group-name="_metroUI-background-theme" name="light" :content="lightName" v-model="value" @input="selectBackgroundTheme" ref="theme-light" />
		<MetroRadioButton group-name="_metroUI-background-theme" name="dark" :content="darkName" v-model="value" @input="selectBackgroundTheme" ref="theme-dark" />
	</MetroStackPanel>
</template>

<script>
export default {
	name: "MetroBackgroundThemeSelector",
	props: {
		lightName: {
			type: String,
			default: "Light"
		},
		darkName: {
			type: String,
			default: "Dark"
		}
	},
	data: () => ({
		value: document.body.getAttribute("data-theme")
	}),
	methods: {
		selectBackgroundTheme(e) {
			document.body.setAttribute("data-theme", this.value);
			this.$emit("theme-select", this.value);
		}
	}
}
</script>