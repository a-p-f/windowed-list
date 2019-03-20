export function write(style_string) {
	var style = document.createElement('style');
	style.innerHTML = style_string;
	document.head.appendChild(style);
}

// Use for backgrounds, still use black text color
export const lightGray = '#FAFAFA';

// use for "secondary" borders
export const lightBorder = '#888';

export const lightText = '#888';