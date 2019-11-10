<template>
	<div class="color-picker">
		<MetroStackPanel orientation="vertical">
			<div class="color-spectrum-grid">
				<div class="color-spectrum"
					@mousedown="_mouseDown"
					@touchstart="_mouseDown"
					ref="spectrum"
				>
					<div class="selection-ellipse" :class="contrastColor" :style="selectionCoordinates" />
				</div>
				<div class="color-preview" :style="{'background-color': rgbaString}" />
			</div>
			
			<div class="third-dimension-slider-grid" v-show="colorSliderVisible">
				<div class="third-dimension-slider-background" :style="{'background': `linear-gradient(to right, #000000, ${rgbStringFixed}`}" />
				<MetroSlider :value="Math.round(hsvColor.value * 100)" @input="_updateFromHSV('value', $event / 100)" />
			</div>
			
			<div class="alpha-slider-grid" v-show="alphaEnabled">
				<div class="alpha-slider-background" :style="{'background': `linear-gradient(to right, ${rgbStringTransparent}, ${rgbString}`}" />
				<MetroSlider :value="Math.round(rgbColor.alpha * 100)" @input="_updateFromRGB('alpha', $event / 100)" />
			</div>
			
			<div class="text-entry-grid">
				<MetroComboBox class="color-representation-combo-box" :items-source="{'rgb': 'RGB', 'hsv': 'HSV'}" v-model="colorRepresentation" v-show="colorChannelTextInputVisible"/>
				
				<MetroStackPanel>
					<MetroStackPanel class="color-channel-text-input-panel" v-show="colorChannelTextInputVisible">
						<MetroStackPanel class="rgb-panel" v-show="colorRepresentation === 'rgb'">
							<MetroStackPanel orientation="horizontal" horizontal-alignment="left" vertical-alignment="center">
								<MetroTextBox :value="rgbColor.red" @input="_updateFromRGB('red', $event)" :maxlength="3" />
								<MetroTextBlock class="red-label">R</MetroTextBlock>
							</MetroStackPanel>
							<MetroStackPanel orientation="horizontal" horizontal-alignment="left" vertical-alignment="center">
								<MetroTextBox :value="rgbColor.green" @input="_updateFromRGB('green', $event)" :maxlength="3" />
								<MetroTextBlock class="green-label">G</MetroTextBlock>
							</MetroStackPanel>
							<MetroStackPanel orientation="horizontal" horizontal-alignment="left" vertical-alignment="center">
								<MetroTextBox :value="rgbColor.blue" @input="_updateFromRGB('blue', $event)" :maxlength="3" />
								<MetroTextBlock class="blue-label">B</MetroTextBlock>
							</MetroStackPanel>
						</MetroStackPanel>
						
						<MetroStackPanel class="rgb-panel" v-show="colorRepresentation === 'hsv'">
							<MetroStackPanel orientation="horizontal" horizontal-alignment="left" vertical-alignment="center">
								<MetroTextBox :value="Math.round(hsvColor.hue * 360)" @input="_updateFromHSV('hue', $event / 360)" :maxlength="3" />
								<MetroTextBlock class="hue-label">H</MetroTextBlock>
							</MetroStackPanel>
							<MetroStackPanel orientation="horizontal" horizontal-alignment="left" vertical-alignment="center">
								<MetroTextBox :value="Math.round(hsvColor.saturation * 100)" @input="_updateFromHSV('saturation', $event / 100)" :maxlength="3" />
								<MetroTextBlock class="saturation-label">S</MetroTextBlock>
							</MetroStackPanel>
							<MetroStackPanel orientation="horizontal" horizontal-alignment="left" vertical-alignment="center">
								<MetroTextBox :value="Math.round(hsvColor.value * 100)" @input="_updateFromHSV('value', $event / 100)" :maxlength="3" />
								<MetroTextBlock class="value-label">V</MetroTextBlock>
							</MetroStackPanel>
						</MetroStackPanel>
					</MetroStackPanel>
					
					<MetroStackPanel class="alpha-panel" orientation="horizontal" horizontal-alignment="left" vertical-alignment="center" v-show="alphaEnabled && alphaTextInputVisible">
						<MetroTextBox class="alpha-text-box" :value="Math.round(rgbColor.alpha * 100)" @input="_updateFromRGB('alpha', $event / 100)" :maxlength="3" />
						<MetroTextBlock class="alpha-label">Alpha</MetroTextBlock>
					</MetroStackPanel>
				</MetroStackPanel>
				
				<MetroTextBox class="hex-text-box" v-show="hexInputVisible" :maxlength="9" :value="hexString" :disabled="true" @input="_updateFromHex" ref="hexTextBox" />
			</div>
		</MetroStackPanel>
	</div>
</template>

<script>
export default {
	name: "MetroColorPicker",
	props: {
		colorSliderVisible: {
			type: Boolean,
			default: true
		},
		colorChannelTextInputVisible: {
			type: Boolean,
			default: true
		},
		hexInputVisible: {
			type: Boolean,
			default: true
		},
		alphaEnabled: Boolean,
		alphaSliderVisible: {
			type: Boolean,
			default: true
		},
		alphaTextInputVisible: {
			type: Boolean,
			default: true
		},
		
		value: null
	},
	data: () => ({
		hsvColor: { hue: 360, saturation: 1, value: 1 },
		
		pickerActive: false,
		colorRepresentation: "rgb",
		
		_eventListenerMove: null,
		_eventListenerEnd: null
	}),
	mounted() {
		this.hsvColor = this.toHSV(this.rgbColor);
	},
	methods: {
		toRGB: (hsv) => {
			let h = hsv.hue * 360;
			let s = hsv.saturation;
			let v = hsv.value;
			
			const mix = (a, b, v) => {
				return (1 - v) * a + v * b;
			}
			
			var v2 = v * (1 - s);
			var r = ((h >= 0 && h <= 60) || (h >= 300 && h <= 360)) ? v : ((h >= 120 && h <= 240) ? v2 : ((h >= 60 && h <= 120) ? mix(v, v2, (h - 60) / 60) : ((h >= 240 && h <= 300) ? mix(v2, v, (h - 240) / 60) : 0)));
			var g = (h >= 60 && h <= 180) ? v : ((h >= 240 && h <= 360) ? v2 : ((h >= 0 && h <= 60) ? mix(v2, v, h / 60) : ((h >= 180 && h <= 240) ? mix(v, v2, (h - 180) / 60) : 0)));
			var b = (h >= 0 && h <= 120) ? v2 : ((h >= 180 && h <= 300) ? v : ((h >= 120 && h <= 180) ? mix(v2, v, (h - 120) / 60) : ((h >= 300 && h <= 360) ? mix(v, v2, (h - 300) / 60) : 0)));
			
			return {
				red: Math.round(r * 255),
				green: Math.round(g * 255),
				blue: Math.round(b * 255)
			};
		},
		toHSV: (rgb) => {
			const r = rgb.red / 255;
			const g = rgb.green / 255;
			const b = rgb.blue / 255;
			const max = Math.max(r, g, b);
			const min = Math.min(r, g, b);
			let h, s;
			const v = max;

			const d = max - min;
			if (max === 0) {
				s = 0;
			} else {
				s = d / max;
			}

			if (max === min) {
				h = 0;
			} else {
				switch (max) {
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}
			return {
				hue: h,
				saturation: s,
				value: v
			};
		},
		luma: (rgb) => {
			const _luma = (rgb) => {
				let r = rgb.red / 255;
				let g = rgb.green / 255;
				let b = rgb.blue / 255;

				r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
				g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
				b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);

				return 0.2126 * r + 0.7152 * g + 0.0722 * b;
			}

			return _luma(rgb) * 1 * 100;
		},
		
		
		_updateFromRGB(colorKey, value) {
			let rgb = {...this.value, [colorKey]: Math.min(Math.max(isNaN(value) ? 0 : value, 0), colorKey === "alpha" ? 1 : 255) };
			this.hsvColor = this.toHSV(rgb);
			
			this.$emit("input", rgb);
		},
		_updateFromHSV(colorKey, value) {
			this.hsvColor = {...this.hsvColor, [colorKey]: Math.min(Math.max(isNaN(value) ? 0 : value, 0), 1) };
			this.$emit("input", {...this.value, ...this.toRGB(this.hsvColor) });
		},
		_updateFromHex(value) {
			let hexString = value.replace(/#/g, "");
			
			if (hexString.length < 3) return;
			
			let convertedColor = null;
			let colors = hexString.match(/([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?|([a-f\d]{3})/i);
			
			if (!colors.length) return;
			colors = colors.filter(Boolean).slice(1);
			console.log(colors);
			
			switch (colors.length) {
				case 1: // "#FFF" – RGB shorthand
					colors = colors[0].replace(/([a-f\d])([a-f\d])([a-f\d])/i, (match, r, g, b) => {
						return `${r}${r}${g}${g}${b}${b}`;
					}).match(/([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i).splice(1, 3).filter(Boolean);
					
					convertedColor = {
						alpha: 1,
						red: parseInt(colors[0], 16),
						green: parseInt(colors[1], 16),
						blue: parseInt(colors[2], 16),
					}
					break;
				case 3: // "#FFFFFF" – RGB
					console.log(colors);
					convertedColor = {
						alpha: 1,
						red: parseInt(colors[0], 16),
						green: parseInt(colors[1], 16),
						blue: parseInt(colors[2], 16),
					}
					break;
				case 4: // "#FFFFFFFF" – ARGB
					convertedColor = {
						alpha: parseInt(colors[0], 16) / 255,
						red: parseInt(colors[1], 16),
						green: parseInt(colors[2], 16),
						blue: parseInt(colors[3], 16),
					}
					break;
			}
			
			this.hsvColor = this.toHSV(convertedColor);
			this.$emit("input", convertedColor);
		},
		
		_mouseDown(event) {
			this.pickerActive = true;
			let { top, left, width, height } = this.$refs["spectrum"].getBoundingClientRect();
			
			this._eventListenerMove = this._mouseMove.bind(this);
			this._eventListenerEnd = this._mouseUp.bind(this);
			
			if ("ontouchend" in window) {
				this.hsvColor = {
					...this.hsvColor,
					hue: Math.min(Math.max(((event.pageX - left) / width), 0), 1),
					saturation: Math.min(Math.max(1 - ((event.pageY - top) / height), 0), 1)
				};
				
				window.addEventListener("touchmove", this._eventListenerMove);
				window.addEventListener("touchend", this._eventListenerEnd);
			} else {
				this.hsvColor = {
					...this.hsvColor,
					hue: Math.min(Math.max(((event.clientX - left) / width), 0), 1),
					saturation: Math.min(Math.max(1 - ((event.clientY - top) / height), 0), 1)
				};
				
				window.addEventListener("mousemove", this._eventListenerMove);
				window.addEventListener("mouseup", this._eventListenerEnd);
			}
			
			// this.rgb = this.toRGB(this.hsv.hue, this.hsv.saturation, this.hsv.value / 100);
			// this.$emit("colorchanged", { rgb: this.rgb, hsv: this.hsv, alpha: this.alpha });
			this.$emit("input", {...this.value, ...this.toRGB(this.hsvColor) });
		},
		_mouseMove(event) {
			let { top, left, width, height } = this.$refs["spectrum"].getBoundingClientRect();
			
			if (this.pickerActive) {
				if ("ontouchend" in window) {
					this.hsvColor = {
						...this.hsvColor,
						hue: Math.min(Math.max(((event.pageX - left) / width), 0), 1),
						saturation: Math.min(Math.max(1 - ((event.pageY - top) / height), 0), 1)
					};
				} else {
					this.hsvColor = {
						...this.hsvColor,
						hue: Math.min(Math.max(((event.clientX - left) / width), 0), 1),
						saturation: Math.min(Math.max(1 - ((event.clientY - top) / height), 0), 1)
					};
				}
				
				// this.rgb = this.toRGB(this.hsv.hue, this.hsv.saturation, this.hsv.value / 100);
				// this.$emit("colorchanged", { rgb: this.rgb, hsv: this.hsv, alpha: this.alpha });
				this.$emit("input", {...this.value, ...this.toRGB(this.hsvColor) });
			}
		},
		_mouseUp(event) {
			this.pickerActive = false;
			
			window.removeEventListener("mousemove", this._eventListenerMove);
			window.removeEventListener("mouseup", this._eventListenerEnd);
			window.removeEventListener("touchmove", this._eventListenerMove);
			window.removeEventListener("touchend", this._eventListenerEnd);
		}
	},
	computed: {
		contrastColor() {
			let rgb = this.toRGB({ ...this.hsvColor, value: 1 });
			let lightContrast = (Math.abs(this.luma({ red: 255, green: 255, blue: 255 })) + 5) / (Math.abs(this.luma(rgb)) + 5);
			let darkContrast = (Math.abs(this.luma(rgb)) + 5) / (Math.abs(this.luma({ red: 0, green: 0, blue: 0 })) + 5);
			
			return lightContrast > 4.45 ? "light" : darkContrast > 4.45 ? "dark" : "light";
		},
		selectionCoordinates() {
			return {'top': `${(1 - this.hsvColor.saturation) * 100}%`, 'left': `${(this.hsvColor.hue) * 100}%`}
		},
		rgbColor() {
			return this.value ? this.value : { red: 255, green: 0, blue: 0, alpha: 1 };
		},

		rgbStringFixed() {
			let rgb = this.toRGB({ ...this.hsvColor, value: 1 });
			
			return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
		},
		rgbStringTransparent() {
			return `rgba(${this.rgbColor.red}, ${this.rgbColor.green}, ${this.rgbColor.blue}, 0)`;
		},
		rgbString() {
			return `rgb(${this.rgbColor.red}, ${this.rgbColor.green}, ${this.rgbColor.blue})`;
		},
		rgbaString() {
			return `rgba(${this.rgbColor.red}, ${this.rgbColor.green}, ${this.rgbColor.blue}, ${this.rgbColor.alpha})`;
		},
		hexString() {
			if (this.$refs["hexTextBox"]) {
				let el = this.$refs["hexTextBox"].$el.querySelector("input");
				
				if (el === document.activeElement) {
					console.log(true);
					if (!el.value.length) return "#";
					return el.value;
				}
			}
			
			let clamp = (v, max) => {
    			return Math.min(Math.max(v, 0), max);
			}
			
			let v = ["alpha","red","green","blue"].map(key => ({ ...this.rgbColor, alpha: this.rgbColor.alpha * 255 })[key]);
			return `#${v.map(c => {
				c = clamp(Math.round(c), 255);
				return (c < 16 ? '0' : '') + c.toString(16);
			}).join('').toUpperCase()}`;
		}
	}
}
</script>