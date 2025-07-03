import { assertEquals, assertThrows } from '@std/assert';

import {
	blend,
	darken,
	fromHsla,
	fromInteger,
	fromRgba,
	fromRgbaHex,
	getAPCALuminance,
	getAPCATextColor,
	getAPCAContrastRatio,
	getAlpha,
	getBlue,
	getGreen,
	getRed,
	getWCAGLuminance,
	getWCAGTextColor,
	getWCAGContrastRatio,
	invert,
	lerp,
	lighten,
	setAlpha,
	setBlue,
	setGreen,
	setRed,
	toHsla,
	toInteger,
	toRgba,
	toRgbaHex,
	toRgbHex,
} from './mod.ts';

Deno.test('fromInteger', async (t) => {
	await t.step('should convert to unsigned 32-bit integer', () => {
		const color = fromInteger(0xaabbccff);
		assertEquals(color, -1430532865);
	});
});

Deno.test('toInteger', async (t) => {
	await t.step('should convert color to 32-bit unsigned integer', () => {
		const color = fromInteger(0xaabbccff);
		assertEquals(toInteger(color), 0xaabbccff);
	});
});

Deno.test('getRed', async (t) => {
	await t.step('should get the red component', () => {
		const color = fromInteger(0xff0000ff);
		assertEquals(getRed(color), 255);
	});
});

Deno.test('getGreen', async (t) => {
	await t.step('should get the green component', () => {
		const color = fromInteger(0x00ff00ff);
		assertEquals(getGreen(color), 255);
	});
});

Deno.test('getBlue', async (t) => {
	await t.step('should get the blue component', () => {
		const color = fromInteger(0x0000ffff);
		assertEquals(getBlue(color), 255);
	});
});

Deno.test('getAlpha', async (t) => {
	await t.step('should get the alpha component', () => {
		const color = fromInteger(0x000000ff);
		assertEquals(getAlpha(color), 255);
	});
});

Deno.test('setRed', async (t) => {
	await t.step('should set the red component', () => {
		const color = fromInteger(0x000000ff);
		const newColor = setRed(color, 128);
		assertEquals(getRed(newColor), 128);
	});

	await t.step('should clamp red component values', () => {
		const color = fromInteger(0x000000ff);
		const newColor = setRed(color, 300);
		assertEquals(getRed(newColor), 255);
		const anotherColor = setRed(color, -10);
		assertEquals(getRed(anotherColor), 0);
	});
});

Deno.test('setGreen', async (t) => {
	await t.step('should set the green component', () => {
		const color = fromInteger(0x000000ff);
		const newColor = setGreen(color, 128);
		assertEquals(getGreen(newColor), 128);
	});

	await t.step('should clamp green component values', () => {
		const color = fromInteger(0x000000ff);
		const newColor = setGreen(color, 300);
		assertEquals(getGreen(newColor), 255);
		const anotherColor = setGreen(color, -10);
		assertEquals(getGreen(anotherColor), 0);
	});
});

Deno.test('setBlue', async (t) => {
	await t.step('should set the blue component', () => {
		const color = fromInteger(0x000000ff);
		const newColor = setBlue(color, 128);
		assertEquals(getBlue(newColor), 128);
	});

	await t.step('should clamp blue component values', () => {
		const color = fromInteger(0x000000ff);
		const newColor = setBlue(color, 300);
		assertEquals(getBlue(newColor), 255);
		const anotherColor = setBlue(color, -10);
		assertEquals(getBlue(anotherColor), 0);
	});
});

Deno.test('setAlpha', async (t) => {
	await t.step('should set the alpha component', () => {
		const color = fromInteger(0x00000000);
		const newColor = setAlpha(color, 128);
		assertEquals(getAlpha(newColor), 128);
	});

	await t.step('should clamp alpha component values', () => {
		const color = fromInteger(0x00000000);
		const newColor = setAlpha(color, 300);
		assertEquals(getAlpha(newColor), 255);
		const anotherColor = setAlpha(color, -10);
		assertEquals(getAlpha(anotherColor), 0);
	});
});

Deno.test('fromRgba', async (t) => {
	await t.step('should create a color from rgba components', () => {
		const color = fromRgba(255, 128, 0, 255);
		assertEquals(getRed(color), 255);
		assertEquals(getGreen(color), 128);
		assertEquals(getBlue(color), 0);
		assertEquals(getAlpha(color), 255);
	});

	await t.step('should handle default alpha value', () => {
		const color = fromRgba(255, 128, 0);
		assertEquals(getAlpha(color), 255);
	});

	await t.step('should clamp rgba component values', () => {
		const color = fromRgba(300, -10, 0, 300);
		assertEquals(getRed(color), 255);
		assertEquals(getGreen(color), 0);
		assertEquals(getAlpha(color), 255);
	});
});

Deno.test('toRgba', async (t) => {
	await t.step('should convert color to rgba components', () => {
		const color = fromRgba(255, 128, 0, 128);
		assertEquals(toRgba(color), [255, 128, 0, 128 / 255]);
	});
});

Deno.test('fromHsla', async (t) => {
	await t.step('should create a color from hsla components (red)', () => {
		const color = fromHsla(0, 100, 50);
		assertEquals(getRed(color), 255);
		assertEquals(getGreen(color), 0);
		assertEquals(getBlue(color), 0);
		assertEquals(getAlpha(color), 255);
	});

	await t.step('should create a color from hsla components (green)', () => {
		const color = fromHsla(120, 100, 50);
		assertEquals(getRed(color), 0);
		assertEquals(getGreen(color), 255);
		assertEquals(getBlue(color), 0);
		assertEquals(getAlpha(color), 255);
	});

	await t.step('should create a color from hsla components (blue)', () => {
		const color = fromHsla(240, 100, 50);
		assertEquals(getRed(color), 0);
		assertEquals(getGreen(color), 0);
		assertEquals(getBlue(color), 255);
		assertEquals(getAlpha(color), 255);
	});

	await t.step('should handle default alpha value', () => {
		const color = fromHsla(0, 100, 50);
		assertEquals(getAlpha(color), 255);
	});

	await t.step('should handle hue wrap around', () => {
		const color = fromHsla(360, 100, 50);
		assertEquals(getRed(color), 255);
		assertEquals(getGreen(color), 0);
		assertEquals(getBlue(color), 0);
	});
});

Deno.test('toHsla', async (t) => {
	await t.step('should convert color to hsla components (red)', () => {
		const color = fromRgba(255, 0, 0, 255);
		const hsla = toHsla(color);
		assertEquals(Math.round(hsla[0]), 0);
		assertEquals(Math.round(hsla[1]), 100);
		assertEquals(Math.round(hsla[2]), 50);
		assertEquals(hsla[3], 1);
	});

	await t.step('should convert color to hsla components (green)', () => {
		const color = fromRgba(0, 255, 0, 255);
		const hsla = toHsla(color);
		assertEquals(Math.round(hsla[0]), 120);
		assertEquals(Math.round(hsla[1]), 100);
		assertEquals(Math.round(hsla[2]), 50);
		assertEquals(hsla[3], 1);
	});

	await t.step('should convert color to hsla components (blue)', () => {
		const color = fromRgba(0, 0, 255, 255);
		const hsla = toHsla(color);
		assertEquals(Math.round(hsla[0]), 240);
		assertEquals(Math.round(hsla[1]), 100);
		assertEquals(Math.round(hsla[2]), 50);
		assertEquals(hsla[3], 1);
	});

	await t.step('should convert color to hsla components (gray)', () => {
		const color = fromRgba(128, 128, 128, 255);
		const hsla = toHsla(color);
		assertEquals(Math.round(hsla[0]), 0);
		assertEquals(Math.round(hsla[1]), 0);
		assertEquals(Math.round(hsla[2]), 50);
		assertEquals(hsla[3], 1);
	});
});

Deno.test('fromRgbaHex', async (t) => {
	await t.step('should parse 3-digit rgb hex colors', () => {
		const color = fromRgbaHex('abc');
		assertEquals(color, fromInteger(0xaabbccff));
	});

	await t.step('should parse 4-digit rgba hex colors', () => {
		const color = fromRgbaHex('abcd');
		assertEquals(color, fromInteger(0xaabbccdd));
	});

	await t.step('should parse 6-digit rrggbb hex colors', () => {
		const color = fromRgbaHex('1083fe');
		assertEquals(color, fromInteger(0x1083feff));
	});

	await t.step('should parse 8-digit rrggbbaa hex colors', () => {
		const color = fromRgbaHex('f871717f');
		assertEquals(color, fromInteger(0xf871717f));
	});

	await t.step('should throw error for invalid length', () => {
		assertThrows(() => fromRgbaHex('ff'), RangeError, 'invalid string length: 2');
		assertThrows(() => fromRgbaHex('ff00000'), RangeError, 'invalid string length: 7');
	});
});

Deno.test('toRgbaHex', async (t) => {
	await t.step('should convert to 8-digit rrggbbaa hex colors', () => {
		const color = fromInteger(0x1083fe7f);
		assertEquals(toRgbaHex(color), '1083fe7f');
	});
});

Deno.test('toRgbHex', async (t) => {
	await t.step('should convert to 6-digit rrggbb hex colors', () => {
		const color = fromInteger(0x1083feff);
		assertEquals(toRgbHex(color), '1083fe');
	});
});

Deno.test('lighten', async (t) => {
	await t.step('should lighten a color by a factor', () => {
		const color = fromRgba(128, 128, 128, 255);
		const lightenedColor = lighten(color, 0.5);
		assertEquals(getRed(lightenedColor), 191);
		assertEquals(getGreen(lightenedColor), 191);
		assertEquals(getBlue(lightenedColor), 191);
		assertEquals(getAlpha(lightenedColor), 255);
	});

	await t.step('should not lighten beyond white', () => {
		const color = fromRgba(200, 200, 200, 255);
		const lightenedColor = lighten(color, 0.5);
		assertEquals(getRed(lightenedColor), 227);
		assertEquals(getGreen(lightenedColor), 227);
		assertEquals(getBlue(lightenedColor), 227);
	});
});

Deno.test('darken', async (t) => {
	await t.step('should darken a color by a factor', () => {
		const color = fromRgba(128, 128, 128, 255);
		const darkenedColor = darken(color, 0.5);
		assertEquals(getRed(darkenedColor), 64);
		assertEquals(getGreen(darkenedColor), 64);
		assertEquals(getBlue(darkenedColor), 64);
		assertEquals(getAlpha(darkenedColor), 255);
	});

	await t.step('should not darken beyond black', () => {
		const color = fromRgba(50, 50, 50, 255);
		const darkenedColor = darken(color, 0.5);
		assertEquals(getRed(darkenedColor), 25);
		assertEquals(getGreen(darkenedColor), 25);
		assertEquals(getBlue(darkenedColor), 25);
	});
});

Deno.test('invert', async (t) => {
	await t.step('should invert a color by a factor', () => {
		const color = fromRgba(0, 0, 0, 255);
		const invertedColor = invert(color, 1);
		assertEquals(getRed(invertedColor), 255);
		assertEquals(getGreen(invertedColor), 255);
		assertEquals(getBlue(invertedColor), 255);
		assertEquals(getAlpha(invertedColor), 255);
	});

	await t.step('should partially invert a color', () => {
		const color = fromRgba(0, 0, 0, 255);
		const invertedColor = invert(color, 0.5);
		assertEquals(getRed(invertedColor), 127);
		assertEquals(getGreen(invertedColor), 127);
		assertEquals(getBlue(invertedColor), 127);
	});
});

Deno.test('blend', async (t) => {
	await t.step('should blend two colors with a factor', () => {
		const colorA = fromRgba(255, 0, 0, 255); // Red
		const colorB = fromRgba(0, 0, 255, 255); // Blue
		const blendedColor = blend(colorA, colorB, 0.5); // Should be purple
		assertEquals(getRed(blendedColor), 128);
		assertEquals(getGreen(blendedColor), 0);
		assertEquals(getBlue(blendedColor), 128);
	});

	// await t.step('should blend with gamma correction', () => {
	// 	const colorA = fromRgba(0, 0, 0, 255); // Black
	// 	const colorB = fromRgba(255, 255, 255, 255); // White
	// 	const blendedColor = blend(colorA, colorB, 0.5, 2.2); // Gamma 2.2
	// 	assertEquals(getRed(blendedColor), 188);
	// 	assertEquals(getGreen(blendedColor), 188);
	// 	assertEquals(getBlue(blendedColor), 188);
	// });
});

Deno.test('lerp', async (t) => {
	await t.step('should linearly interpolate between two colors', () => {
		const colorA = fromRgba(0, 0, 0, 0); // Black transparent
		const colorB = fromRgba(255, 255, 255, 255); // White opaque
		const lerpedColor = lerp(colorA, colorB, 0.5);
		assertEquals(getRed(lerpedColor), 127);
		assertEquals(getGreen(lerpedColor), 127);
		assertEquals(getBlue(lerpedColor), 127);
		assertEquals(getAlpha(lerpedColor), 127);
	});
});

Deno.test('getWCAGLuminance', async (t) => {
	await t.step('should calculate WCAG luminance for white', () => {
		const color = fromRgba(255, 255, 255, 255);
		assertEquals(getWCAGLuminance(color), 1);
	});

	await t.step('should calculate WCAG luminance for black', () => {
		const color = fromRgba(0, 0, 0, 255);
		assertEquals(getWCAGLuminance(color), 0);
	});

	// await t.step('should calculate WCAG luminance for a specific color', () => {
	// 	const color = fromRgba(76, 175, 80, 255); // Material Green 500
	// 	assertEquals(getWCAGLuminance(color), 0.3277563096600313);
	// });
});

Deno.test('getAPCALuminance', async (t) => {
	await t.step('should calculate APCA luminance for white', () => {
		const color = fromRgba(255, 255, 255, 255);
		assertEquals(getAPCALuminance(color), 1.0000001);
	});

	await t.step('should calculate APCA luminance for black', () => {
		const color = fromRgba(0, 0, 0, 255);
		assertEquals(getAPCALuminance(color), 0.004530912452252362);
	});

	await t.step('should calculate APCA luminance for a specific color', () => {
		const color = fromRgba(76, 175, 80, 255); // Material Green 500
		assertEquals(getAPCALuminance(color), 0.30583827226031246);
	});
});

Deno.test('getWCAGContrastRatio', async (t) => {
	await t.step('should calculate WCAG contrast ratio between black and white', () => {
		const black = fromRgba(0, 0, 0, 255);
		const white = fromRgba(255, 255, 255, 255);
		assertEquals(getWCAGContrastRatio(black, white), 21);
	});

	await t.step('should calculate WCAG contrast ratio for same colors', () => {
		const color = fromRgba(128, 128, 128, 255);
		assertEquals(getWCAGContrastRatio(color, color), 1);
	});
});

Deno.test('getAPCAContrastRatio', async (t) => {
	// await t.step('should calculate APCA contrast ratio between black and white', () => {
	// 	const black = fromRgba(0, 0, 0, 255);
	// 	const white = fromRgba(255, 255, 255, 255);
	// 	assertEquals(getAPCAContrastRatio(black, white), -107.88473318309848);
	// });

	await t.step('should calculate APCA contrast ratio for same colors', () => {
		const color = fromRgba(128, 128, 128, 255);
		assertEquals(getAPCAContrastRatio(color, color), 0);
	});
});

Deno.test('getWCAGTextColor', async (t) => {
	// await t.step('should return white for dark background', () => {
	// 	const darkColor = fromRgba(0, 0, 0, 255);
	// 	const white = fromInteger(0xffffffff);
	// 	assertEquals(getWCAGTextColor(darkColor), white);
	// });

	await t.step('should return black for light background', () => {
		const lightColor = fromRgba(255, 255, 255, 255);
		const black = fromInteger(0x000000ff);
		assertEquals(getWCAGTextColor(lightColor), black);
	});
});

Deno.test('getAPCATextColor', async (t) => {
	// await t.step('should return white for dark background', () => {
	// 	const darkColor = fromRgba(0, 0, 0, 255);
	// 	const white = fromInteger(0xffffffff);
	// 	assertEquals(getAPCATextColor(darkColor), white);
	// });

	await t.step('should return black for light background', () => {
		const lightColor = fromRgba(255, 255, 255, 255);
		const black = fromInteger(0x000000ff);
		assertEquals(getAPCATextColor(lightColor), black);
	});
});