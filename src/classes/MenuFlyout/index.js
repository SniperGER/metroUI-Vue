import Vue from "vue";

const NodeRenderer = class {
	constructor(element) {
		const NodeConstructor = Vue.extend({
			props: ['node'],
			render(h) {
				return this.node ? this.node : ''
			}
		});

		const nodeRenderer = new NodeConstructor({
			propsData: {
				node: element
			}
		});
		nodeRenderer.$mount();

		return nodeRenderer.$el;
	}
}

HTMLElement.prototype.parentNodeOfClass = function(className) {
	var node = this.parentNode;
	while (node) {
		if (node.classList && node.classList.contains(className)) {
			return node;
		}
		node = node.parentNode
	}

	return null;
}

export default class MenuFlyout {
	constructor(params = {}) {
		const flyout = this;
		
		flyout.params = {
			items: []
		}
		Object.assign(flyout.params, params);
		
		flyout.container = document.createElement("div");
		flyout.container.className = "menu-flyout";
		
		flyout.itemList = document.createElement("div");
		flyout.itemList.className = "menu-flyout-items";
		flyout.container.appendChild(flyout.itemList);
		
		flyout.params.items.forEach(item => {
			if (item.constructor.name == "VNode") {
				let menuItem = new NodeRenderer(item);
				
				menuItem.addEventListener("click", () => {
					flyout.hide();
				});
				
				flyout.itemList.appendChild(menuItem);
			} else {
				let menuItem = document.createElement("div");
				
				if (item.separator) {
					menuItem.className = "menu-item-separator";
					
					flyout.itemList.appendChild(menuItem);
					return;
				}
				
				menuItem.className = "menu-flyout-item";

				if (item.icon) {
					let menuItemIcon = document.createElement("div");
					menuItemIcon.className = "menu-flyout-item-icon";
					menuItem.appendChild(menuItemIcon);
				
					let icon = document.createElement("i");
					icon.className = `icon ${item.icon}`;
					menuItemIcon.appendChild(icon);
				} else if (item.symbol) {
					let menuItemIcon = document.createElement("div");
					menuItemIcon.className = "menu-flyout-item-icon";
					menuItem.appendChild(menuItemIcon);
				
					let icon = document.createElement("i");
					icon.className = `symbol ${item.icon}`;
					menuItemIcon.appendChild(icon);
				}
				
				if (item.text) {
					let menuItemContent = document.createElement("span");
					menuItemContent.className = "menu-flyout-item-content";
					menuItemContent.innerText = item.text;
					menuItem.appendChild(menuItemContent);
				}

				if (item.disabled) {
					menuItem.classList.add("disabled");
				}

				menuItem.addEventListener("click", () => {
					if (typeof item.action === "function") {
						item.action();
					}

					flyout.hide();
				});

				flyout.itemList.appendChild(menuItem);
			}
		});
	}
	
	_hide_internal(event) {
		const flyout = this;
		
		if (!event.target.parentNodeOfClass("menu-flyout")) {
			event.preventDefault();
			event.stopPropagation();

			flyout.hide();
		}
	}
	
	showAt(element) {
		const flyout = this;
		
		if (!element) return;
		
		flyout.container.classList.remove("animate-out");
		flyout.container.style.maxHeight = null;
		document.body.appendChild(flyout.container);
		
		const width = flyout.container.clientWidth;
		const height = flyout.container.clientHeight;
		let offset = element.getBoundingClientRect()

		if (offset.top - height >= 0) {
			Object.assign(flyout.container.style, {
				top: null,
				bottom: `${Math.round((window.innerHeight - offset.top) / 2) * 2}px`
			});
			
			flyout.container.classList.add("animate-bottom");
		} else if (offset.top + offset.height <= window.innerHeight) {
			Object.assign(flyout.container.style, {
				top: `${Math.round((offset.top + offset.height) / 2) * 2}px`,
				bottom: null
			});
			
			flyout.container.classList.add("animate-top");
		}
		
		Object.assign(flyout.container.style, {
			left: `${Math.max(Math.min(window.innerWidth - width, (offset.left + (offset.width / 2)) - width / 2), 0)}px`
		});
		
		setTimeout(() => {
			flyout.container.style.maxHeight = `${height}px`;
		}, 0);
		
		flyout.eventListener = this._hide_internal.bind(flyout);

		document.addEventListener("mousedown", flyout.eventListener, true);
		document.addEventListener("touchstart", flyout.eventListener, true);
	}
	
	hide() {
		const flyout = this;

		document.removeEventListener("mousedown", flyout.eventListener, true);
		document.removeEventListener("touchstart", flyout.eventListener, true);
		flyout.container.classList.add("animate-out");
		flyout.container.classList.remove("animate-top");
		flyout.container.classList.remove("animate-bottom");
		setTimeout(() => {
			document.body.removeChild(flyout.container);
		}, 400);
	}
}