import './style'
import * as Classes from './classes'
import * as Components from './components'

const metroUI = window.metroUI = {};
Object.keys(Classes).forEach(ClassKey => {
	metroUI[ClassKey] = Classes[ClassKey]
})

export { Classes, Components };

function install(Vue) {
	Object.values(Components).forEach(Component => {
		Vue.use(Component)
	})
}

export default { 
	components: Components,
	install: install
}