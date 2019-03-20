import WindowedListWatcher from './WindowedListWatcher.js';

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
		buffer 
			optional - defaults 1
			number of rows above and below viewport to render
		initial_row
			optional - defaults 0
			the window will initially be scrolled so that this row
			is at the top of the viewport
*/
export default function(m) {
	return function(initial_vnode) {
		let list_watcher = null;
		let rows_to_render = [];

		return {
			oncreate: vnode => {
				const {
					row_count, 
					row_height,  
					buffer=1,
					initial_row=null,
				} = vnode.attrs;
				const container = vnode.dom;

				if (initial_row !== null) {
					// TODO - support other scroll containers
					window.scrollTo(0, row_height*row_count/2);
				}

				list_watcher = WindowedListWatcher({
					container: vnode.dom,
					row_count: row_count,
					row_height: row_height,
					buffer: buffer,
					render: (new_rows, old_rows) => {
						rows_to_render = new_rows;
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
				const rows = rows_to_render.map((data_index, index) => {
					const row = m(row_component, {index: data_index});
					const wrapper_style = `
						position: absolute;
						left: 0;
						width: 100%;
						top: ${row_height*data_index}px;
						height: ${row_height};
					`;
					return m('div', {style: wrapper_style, key: index}, row);
				});
				return m('div', {style: list_style}, rows);
			}
		}
	}
}