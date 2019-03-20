const listener_options = {
	capture: true,
	passive: true,
};
function get_page_size(windowed_list_config) {
	const {row_height, buffer, row_count} = windowed_list_config;

	const render_height = window.innerHeight;
	return Math.min(
		Math.ceil(render_height/row_height) + 1 + 2*buffer,
		row_count,
	);
}
function get_start_index(windowed_list_config) {
	const {render_count, container, buffer, row_height, row_count} = windowed_list_config;

	// How much of the container is above the window
	const above_window_height = 0 - container.getBoundingClientRect().top;
	// How many complete rows are above the window
	const above_window_rows = Math.floor(above_window_height/row_height);
	const above_buffer_rows = above_window_rows - buffer;
	// clamp the render range to the actual range of the data source
	let start_index = Math.max(0, above_buffer_rows);
	start_index = Math.min(start_index, row_count-render_count);
	return start_index;
}
function resize(windowed_list_config) {
	const {render_count, previously_rendered} = windowed_list_config;

	const new_render_count = get_page_size(windowed_list_config);

	if (new_render_count === render_count) {
		return;
	}

	windowed_list_config.render_count = new_render_count;
	render_rows(windowed_list_config);
}
function render_rows(windowed_list_config) {
	const {previously_rendered, render_count, render, first_row_index} = windowed_list_config;
	const new_start = get_start_index(windowed_list_config);

	if (render_count === previously_rendered.length && new_start === first_row_index) {
		return;
	}


	const end_index = new_start + render_count - 1;

	const rows_to_render = [];
	for (let i = new_start; i <= end_index; i++) {
		rows_to_render[i % render_count] = i;
	}
	render(rows_to_render, previously_rendered);
	windowed_list_config.previously_rendered = rows_to_render;
	windowed_list_config.first_row_index = new_start;
}
export default function(options) {
	const {
		container,
		render,
		row_count,
		row_height,
		buffer=1,
	} = options;

	const config = {
		container: container,
		render: render,
		row_count: row_count,
		row_height: row_height,
		buffer: buffer,
		render_count: 0,
		first_row_index: 0,
		previously_rendered: [],
	};

	resize(config);

	const scroll_listener = render_rows.bind(null, config);
	window.addEventListener('scroll', scroll_listener, listener_options);
	const resize_listener = resize.bind(null, config);
	window.addEventListener('resize', resize_listener, listener_options);

	return {
		destroy: () => {
			window.removeEventListener('scroll', scroll_listener, listener_options);
			window.removeEventListener('resize', resize_listener, listener_options);
		}
	}
}