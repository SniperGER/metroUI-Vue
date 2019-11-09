<template>
	<div :class="`slider ${orientation}`" :disabled="disabled" :style="{'width': width ? `${width}px` : undefined, 'height': height ? `${height}px` : undefined}" @mousedown="_onMouseDown">
		<label class="header" v-if="header">{{ header }}</label>
		
		<div class="slider-container">
			<input type="range" :value="value" :min="minimum" :max="maximum" ref="input" @input="_onInput"/>
			<div class="decrease-rect" :style="decreaseRectFill" />
		</div>
		
		<MetroToolTip ref="value">{{ Math.floor(value) }}</MetroToolTip>
	</div>
</template>

<script>
export default {
	name: "MetroSlider",
	props: {
		name: String,
		header: String,
		disabled: Boolean,
		minimum: {
			type: Number,
			default: 0
		},
		maximum: {
			type: Number,
			default: 100
		},
		orientation: {
			type: String,
			default: "horizontal",
			validator: value => {
				return ["horizontal", "vertical"].indexOf(value) >= 0
			}
		},
		
		width: Number,
		height: Number,
		value: null
	},
	mounted() {
		if (this.orientation === "vertical") {
			this.$nextTick(() => {
				this.$refs["input"].style.width = this.height ? `${this.height}px` : null;
			});
		}
	},
	methods: {
		_onMouseDown(e) {
			// this.$refs["value"].parentElement.removeChild(this.$refs["value"]);
			// document.body.appendChild(this.$refs["value"]);
			
			this.$refs["value"].$el.removeAttribute("style");
			
			let containerBounds = this.$el.getBoundingClientRect();
			let tooltipBounds = this.$refs["value"].$el.getBoundingClientRect();
			
			let computedValue = (this.value / this.maximum);
			
			if (this.orientation === "horizontal") {
				if (tooltipBounds.top - (containerBounds.height + 20) >= 0) {
					Object.assign(this.$refs["value"].$el.style, {
						top: "auto",
						bottom: `${containerBounds.height + 20}px`
					});
				} else {
					Object.assign(this.$refs["value"].$el.style, {
						top: `${containerBounds.height + 20}px`,
						bottom: "auto"
					});
				}
				
				Object.assign(this.$refs["value"].$el.style, {
					left: `${computedValue * 100}%`,
					transform: `translate3d(calc((-50% + 4px) - ${computedValue * 8}px), 0, 0)`
				});
			} else if (this.orientation === "vertical") {
				if (tooltipBounds.left - (containerBounds.width + 20) >= 0) {
					Object.assign(this.$refs["value"].$el.style, {
						left: "auto",
						right: `${containerBounds.width + 20}px`
					});
				} else {
					Object.assign(this.$refs["value"].$el.style, {
						left: `${containerBounds.width + 20}px`,
						right: "auto"
					});
				}
				
				Object.assign(this.$refs["value"].$el.style, {
					bottom: `${computedValue * 100}%`,
					transform: `translate3d(0, calc((50% - 4px) + ${computedValue * 8}px), 0)`
				});
			}
		},
		_onInput(e) {
			let computedValue = (e.target.value / this.maximum);
			this.$emit("input", e.target.value);
			
			if (this.orientation === "horizontal") {
				Object.assign(this.$refs["value"].$el.style, {
					left: `${computedValue * 100}%`,
					transform: `translate3d(calc((-50% + 4px) - ${computedValue * 8}px), 0, 0)`
				});
			} else if (this.orientation === "vertical") {
				Object.assign(this.$refs["value"].$el.style, {
					bottom: `${computedValue * 100}%`,
					transform: `translate3d(0, calc((50% - 4px) + ${computedValue * 8}px), 0)`
				});
			}
		}
	},
	computed: {
		decreaseRectFill() {
			return {
				[this.orientation === "vertical" ? "height" : "width"]: `${((this.value / this.maximum) * (this.orientation === "vertical" ? this.height : this.width)) - ((this.value / this.maximum) * 8)}px`
			}
		}
	}
}
</script>