import WindowedListWatcher from './WindowedListWatcher.js';

function range(x) {
	return [...Array(x).keys()];
}
function get_simple_render_items(render_count, start_index) {
	return range(render_count).map(index => {
		const data_index = index + start_index;
		return [data_index, data_index];
	});
}
function get_shift_render_items(render_count, start_index) {
	return range(render_count).map(index => {
		return [index, index+start_index];
	});
}
function get_cycle_render_items(render_count, start_index) {
	const items = [];
	const end_index = start_index + render_count - 1;
	for (let data_index = start_index; data_index <= end_index; data_index++) {
		const key = data_index % render_count; 
		items[key] = [key, data_index];
	}
	return items;
}
const get_render_items = {
	simple: get_simple_render_items,
	shift: get_shift_render_items,
	cycle: get_cycle_render_items,
};

// Allow user to decide how to load mithril
// They must pass it in
let m = () => {
	throw new Error(`You must pass mithril to prepare_mithril_windowed_list before you can use this module`);
};
export function prepare_mithril_windowed_list(mithril) {
	m = mithril;
}

/*
	This function returns a mithril component.
	We don't know how you're loading mithril, so you have to pass
	it in as an argument.

	The component takes the following parameters:
		row_count
			number of rows to render
		row_height 
			number, in pixels
		row_component
			a mithril component which accepts a single attr: index
			this component will be rendered inside a wrapper div,
			which is absolutely positioned and has a defined height
		mode
			string: simple|shift|cycle
			optional - defaults to cycle

			TODO - explain

		buffer 
			optional - defaults 1
			number of rows above and below viewport to render
		initial_row
			optional - defaults 0
			the window will initially be scrolled so that this row
			is at the top of the viewport
*/
export default function(initial_vnode) {
	let list_watcher = null;
	let render_items = [];
	return {
		oncreate: vnode => {
			const {
				row_count, 
				row_height,
				mode='cycle',
				buffer=1,
				initial_row=null,
			} = vnode.attrs;
			const container = vnode.dom;

			if (initial_row !== null) {
				// TODO - support other scroll containers
				window.scrollTo(0, row_height*initial_row);
			}

			list_watcher = WindowedListWatcher({
				container: vnode.dom,
				row_count: row_count,
				row_height: row_height,
				buffer: buffer,
				render: (render_count, start_index) => {
					render_items = get_render_items[mode](render_count, start_index);
					m.redraw();
				},
			});
		},
		onremove: () => {
			list_watcher.destroy();
		},
		view: vnode => {
			const {row_height, row_count, row_component} = vnode.attrs;
			const list_style = `
				position: relative; 
				height: ${row_count*row_height}px;
			`;
			const rows = render_items.map(([key, data_index]) => {
				const row = m(row_component, {index: data_index});
				const wrapper_style = `
					position: absolute;
					left: 0;
					width: 100%;
					top: ${row_height*data_index}px;
					height: ${row_height};
				`;
				return m('div', {style: wrapper_style, key: key}, row);
			});
			return m('div', {style: list_style}, rows);
		}
	}
}
