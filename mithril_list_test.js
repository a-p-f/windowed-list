import MithrilWindowedList from './MithrilWindowedList.js';
import * as styles from './styles.js';

// use mithril from global scope
const WindowedList = MithrilWindowedList(m);

const row_count = 100000;
const row_height = 72;

function day_string(index) {
	const days = index - row_count/2;
	if (days > 1) {
		return days + ' days from now';
	}
	if (days < -1) {
		return -1*days + ' days ago';
	}
	if (days === 0) {
		return 'Today';
	}
	if (days === -1) {
		return 'Yesterday';
	}
	if (days === 1) {
		return 'Tomorrow';
	}
}
function img_number(index) {
	let number = index % 49;
	// For some reason img 29 doesn't exist
	if (number == 29) {
		number = 30;
	}
	return (number+'').padStart(2,'0');
}
function img_url(index) {
	return `https://weather.gc.ca/weathericons/${img_number(index)}.gif`;
}
styles.write(`
	.Row {
		display: flex;
		border-bottom: 1px solid #AAA;
		padding: 10px
	}
`);
const Row = {
	oninit: vnode => {
		console.log('Initialized');
	},
	view: vnode => {
		const {index} = vnode.attrs;
		return m('div.Row', 
			m('img', {src: img_url(index)}),
			m('p', day_string(index)),
		);
	},
}

m.mount(document.body, {view: vnode => m(WindowedList, {
	row_count: row_count,
	row_height: row_height,
	row_component: Row,
	initial_row: row_count/2,
})});