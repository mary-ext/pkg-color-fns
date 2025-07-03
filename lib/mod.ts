declare const kColor: unique symbol;

/**
 * 32-bit integer representing a color
 * the bytes are ordered as rgba (red, green, blue, alpha).
 */
export type ColorValue = number & { [kColor]: true };

/**
 * tuple of numbers representing an RGBA color
 * @property r red component (0-255)
 * @property g green component (0-255)
 * @property b blue component (0-255)
 * @property a alpha component (0-1)
 */
export type RgbaColor = [r: number, g: number, b: number, a: number];

/**
 * tuple of numbers representing an HSLA color
 * @property h hue component (0-360)
 * @property s saturation component (0-100)
 * @property l lightness component (0-100)
 * @property a alpha component (0-1)
 */
export type HslaColor = [h: number, s: number, l: number, a: number];

const castAsColor = (color: number): ColorValue => {
	return color as ColorValue;
};

const OFFSET_R = 24;
const OFFSET_G = 16;
const OFFSET_B = 8;
const OFFSET_A = 0;

const get = (n: number, offset: number): number => {
	return (n >> offset) & 0xff;
};

const set = (n: number, offset: number, byte: number): number => {
	return n ^ ((n ^ (byte << offset)) & (0xff << offset));
};

const fromRgbaRaw = (r: number, g: number, b: number, a: number): ColorValue => {
	return castAsColor((r << OFFSET_R) + (g << OFFSET_G) + (b << OFFSET_B) + (a << OFFSET_A));
};

const clampComponent = (value: number): number => {
	return (Math.max(0, Math.min(255, value))) | 0;
};

/**
 * gets the red component of a color.
 * @param color the color to get the red component from
 * @returns the red component (0-255)
 */
/*#__NO_SIDE_EFFECTS__*/
export const getRed = (color: ColorValue): number => {
	return get(color, OFFSET_R);
};

/**
 * gets the green component of a color.
 * @param color the color to get the green component from
 * @returns the green component (0-255)
 */
/*#__NO_SIDE_EFFECTS__*/
export const getGreen = (color: ColorValue): number => {
	return get(color, OFFSET_G);
};

/**
 * gets the blue component of a color.
 * @param color the color to get the blue component from
 * @returns the blue component (0-255)
 */
/*#__NO_SIDE_EFFECTS__*/
export const getBlue = (color: ColorValue): number => {
	return get(color, OFFSET_B);
};

/**
 * gets the alpha component of a color.
 * @param color the color to get the alpha component from
 * @returns the alpha component (0-255)
 */
/*#__NO_SIDE_EFFECTS__*/
export const getAlpha = (color: ColorValue): number => {
	return get(color, OFFSET_A);
};

/**
 * sets the red component of a color.
 * @param color the color to set the red component on
 * @param value the red component (0-255)
 * @returns the new color
 */
/*#__NO_SIDE_EFFECTS__*/
export const setRed = (color: ColorValue, value: number): ColorValue => {
	return castAsColor(set(color, OFFSET_R, clampComponent(value)));
};

/**
 * sets the green component of a color.
 * @param color the color to set the green component on
 * @param value the green component (0-255)
 * @returns the new color
 */
/*#__NO_SIDE_EFFECTS__*/
export const setGreen = (color: ColorValue, value: number): ColorValue => {
	return castAsColor(set(color, OFFSET_G, clampComponent(value)));
};

/**
 * sets the blue component of a color.
 * @param color the color to set the blue component on
 * @param value the blue component (0-255)
 * @returns the new color
 */
/*#__NO_SIDE_EFFECTS__*/
export const setBlue = (color: ColorValue, value: number): ColorValue => {
	return castAsColor(set(color, OFFSET_B, clampComponent(value)));
};

/**
 * sets the alpha component of a color.
 * @param color the color to set the alpha component on
 * @param value the alpha component (0-255)
 * @returns the new color
 */
/*#__NO_SIDE_EFFECTS__*/
export const setAlpha = (color: ColorValue, value: number): ColorValue => {
	return castAsColor(set(color, OFFSET_A, clampComponent(value)));
};

/**
 * creates a color from an integer.
 * @param color the integer to convert
 * @returns the color
 */
/*#__NO_SIDE_EFFECTS__*/
export const fromInteger = (color: number): ColorValue => {
	return castAsColor(color >> 0);
};

/**
 * converts a color to an integer.
 * @param color the color to convert
 * @returns the integer
 */
/*#__NO_SIDE_EFFECTS__*/
export const toInteger = (color: ColorValue): number => {
	// JS bitwise ops operates in 32-bit signed integer, we'll convert this to
	// unsigned to make this readable.
	return color >>> 0;
};

/**
 * creates a color from RGBA components.
 * @param r red component (0-255)
 * @param g green component (0-255)
 * @param b blue component (0-255)
 * @param a alpha component (0-255, defaults to 255)
 * @returns the color
 */
/*#__NO_SIDE_EFFECTS__*/
export const fromRgba = (r: number, g: number, b: number, a: number = 0xff): ColorValue => {
	return fromRgbaRaw(clampComponent(r), clampComponent(g), clampComponent(b), clampComponent(a));
};

/**
 * converts a color to RGBA components.
 * @param color the color to convert
 * @returns the RGBA components
 */
/*#__NO_SIDE_EFFECTS__*/
export const toRgba = (color: ColorValue): RgbaColor => {
	return [getRed(color), getGreen(color), getBlue(color), getAlpha(color) / 255];
};

const getHuePosition = (hue: number, channelOffset: number): number => {
	return (channelOffset + hue / 30) % 12;
};

const computeRgbComponent = (h: number, l: number, hc: number, o: number): number => {
	const pos = getHuePosition(h, o);
	const adj = Math.max(-1, Math.min(pos - 3, 9 - pos, 1));
	return l - hc * adj;
};

/**
 * creates a color from HSLA components.
 * @param h hue component (0-360)
 * @param s saturation component (0-100)
 * @param l lightness component (0-100)
 * @param a alpha component (0-255, defaults to 255)
 * @returns the color
 */
/*#__NO_SIDE_EFFECTS__*/
export const fromHsla = (h: number, s: number, l: number, a: number = 0xff): ColorValue => {
	h = (h % 360 + 360) % 360;
	s /= 100;
	l /= 100;

	const hc = s * Math.min(l, 1 - l);

	const r = Math.round(computeRgbComponent(h, l, hc, 0) * 255);
	const g = Math.round(computeRgbComponent(h, l, hc, 8) * 255);
	const b = Math.round(computeRgbComponent(h, l, hc, 4) * 255);

	return fromRgba(r, g, b, a);
};

/**
 * converts a color to HSLA components.
 * @param color the color to convert
 * @returns the HSLA components
 */
/*#__NO_SIDE_EFFECTS__*/
export const toHsla = (color: ColorValue): HslaColor => {
	const r = getRed(color) / 255;
	const g = getGreen(color) / 255;
	const b = getBlue(color) / 255;
	const a = getAlpha(color) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;

	let h = 0;
	let s: number;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h *= 60;
	} else {
		s = 0;
		h = 0;
	}

	return [h, s * 100, l * 100, a];
};

const hex = (str: string, pos: number): number => {
	const c = str.charCodeAt(pos);
	return (c & 0xf) + 9 * (c >> 6);
};

/**
 * creates a color from a hex string.
 * supports 3, 4, 6, and 8 digit hex strings.
 * @param color the hex string to convert (e.g. "f00", "ff0000", "ff0000ff")
 * @returns the color
 */
/*#__NO_SIDE_EFFECTS__*/
export const fromRgbaHex = (color: string): ColorValue => {
	let r = 0x00;
	let g = 0x00;
	let b = 0x00;
	let a = 0xff;

	switch (color.length) {
		// rgb
		case 3: {
			r = (hex(color, 0) << 4) + hex(color, 0);
			g = (hex(color, 1) << 4) + hex(color, 1);
			b = (hex(color, 2) << 4) + hex(color, 2);
			break;
		}
		// rgba
		case 4: {
			r = (hex(color, 0) << 4) + hex(color, 0);
			g = (hex(color, 1) << 4) + hex(color, 1);
			b = (hex(color, 2) << 4) + hex(color, 2);
			a = (hex(color, 3) << 4) + hex(color, 3);
			break;
		}

		// rrggbb
		case 6: {
			r = (hex(color, 0) << 4) + hex(color, 1);
			g = (hex(color, 2) << 4) + hex(color, 3);
			b = (hex(color, 4) << 4) + hex(color, 5);
			break;
		}
		// rrggbbaa
		case 8: {
			r = (hex(color, 0) << 4) + hex(color, 1);
			g = (hex(color, 2) << 4) + hex(color, 3);
			b = (hex(color, 4) << 4) + hex(color, 5);
			a = (hex(color, 6) << 4) + hex(color, 7);
			break;
		}

		default: {
			throw new RangeError(`invalid string length: ${color.length}`);
		}
	}

	return fromRgba(r, g, b, a);
};

/**
 * converts a color to an 8-digit rgba hex string.
 * @param color the color to convert
 * @returns the hex string (e.g. "ff0000ff")
 */
/*#__NO_SIDE_EFFECTS__*/
export const toRgbaHex = (color: ColorValue): string => {
	return color.toString(16).padStart(8, '0');
};

/**
 * converts a color to a 6-digit rgb hex string.
 * @param color the color to convert
 * @returns the hex string (e.g. "ff0000")
 */
/*#__NO_SIDE_EFFECTS__*/
export const toRgbHex = (color: ColorValue): string => {
	return (color >>> 8).toString(16).padStart(6, '0');
};

/**
 * lightens a color by a given factor.
 * @param color the color to lighten
 * @param factor the lightening factor (0-1)
 * @returns the new color
 */
/*#__NO_SIDE_EFFECTS__*/
export const lighten = (color: ColorValue, factor: number): ColorValue => {
	const r = getRed(color);
	const g = getGreen(color);
	const b = getBlue(color);
	const a = getAlpha(color);

	return fromRgba(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor, a);
};

/**
 * darkens a color by a given factor.
 * @param color the color to darken
 * @param factor the darkening factor (0-1)
 * @returns the new color
 */
/*#__NO_SIDE_EFFECTS__*/
export const darken = (color: ColorValue, factor: number): ColorValue => {
	const r = getRed(color);
	const g = getGreen(color);
	const b = getBlue(color);
	const a = getAlpha(color);

	return fromRgba(r * (1 - factor), g * (1 - factor), b * (1 - factor), a);
};

/**
 * inverts a color by a given factor.
 * @param color the color to invert
 * @param factor the inversion factor (0-1)
 * @returns the new color
 */
/*#__NO_SIDE_EFFECTS__*/
export const invert = (color: ColorValue, factor: number): ColorValue => {
	const r = getRed(color);
	const g = getGreen(color);
	const b = getBlue(color);
	const a = getAlpha(color);

	return fromRgba(r + (255 - r * 2) * factor, g + (255 - g * 2) * factor, b + (255 - b * 2) * factor, a);
};

const blendComponent = (a: number, b: number, factor: number, gamma: number) => {
	return Math.round((a ** (1 / gamma) * (1 - factor) + b ** (1 / gamma) * factor) ** gamma);
};

/**
 * blends two colors together.
 * @param a the first color
 * @param b the second color
 * @param factor the blend factor (0-1)
 * @param gamma the gamma correction value (defaults to 1.0)
 * @returns the blended color
 */
/*#__NO_SIDE_EFFECTS__*/
export const blend = (a: ColorValue, b: ColorValue, factor: number, gamma = 1.0): ColorValue => {
	const nR = blendComponent(getRed(a), getRed(b), factor, gamma);
	const nG = blendComponent(getGreen(a), getGreen(b), factor, gamma);
	const nB = blendComponent(getBlue(a), getBlue(b), factor, gamma);

	return fromRgbaRaw(nR, nG, nB, 0xff);
};

/**
 * linearly interpolates between two colors.
 * @param a the first color
 * @param b the second color
 * @param t the interpolation factor (0-1)
 * @returns the interpolated color
 */
/*#__NO_SIDE_EFFECTS__*/
export const lerp = (a: ColorValue, b: ColorValue, t: number): ColorValue => {
	const nR = getRed(a) + (getRed(b) - getRed(a)) * t;
	const nG = getGreen(a) + (getGreen(b) - getGreen(a)) * t;
	const nB = getBlue(a) + (getBlue(b) - getBlue(a)) * t;
	const nA = getAlpha(a) + (getAlpha(b) - getAlpha(a)) * t;

	return fromRgba(nR, nG, nB, nA);
};

const linearize = (value: number): number => {
	const v = value / 255;
	return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

/**
 * gets the WCAG luminance of a color.
 * @param color the color to get the luminance from
 * @returns the luminance (0-1)
 */
/*#__NO_SIDE_EFFECTS__*/
export const getWCAGLuminance = (color: ColorValue): number => {
	const r = linearize(getRed(color));
	const g = linearize(getGreen(color));
	const b = linearize(getBlue(color));

	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * gets the APCA luminance of a color.
 * @param color the color to get the luminance from
 * @returns the luminance (0-1)
 */
/*#__NO_SIDE_EFFECTS__*/
export const getAPCALuminance = (color: ColorValue): number => {
	const r = getRed(color) / 255;
	const g = getGreen(color) / 255;
	const b = getBlue(color) / 255;

	const lR = Math.pow(r, 2.4);
	const lG = Math.pow(g, 2.4);
	const lB = Math.pow(b, 2.4);

	let Y = lR * 0.2126729 + lG * 0.7151522 + lB * 0.0721750;

	if (Y < 0.022) {
		Y = Math.pow(0.022 - Y, 1.414) + Y;
	}

	return Y;
};

/**
 * gets the WCAG contrast ratio between two colors.
 * @param a the first color
 * @param b the second color
 * @returns the contrast ratio
 */
/*#__NO_SIDE_EFFECTS__*/
export const getWCAGContrastRatio = (a: ColorValue, b: ColorValue): number => {
	const lA = getWCAGLuminance(a);
	const lB = getWCAGLuminance(b);

	const lightest = Math.max(lA, lB);
	const darkest = Math.min(lA, lB);

	return (lightest + 0.05) / (darkest + 0.05);
};

/**
 * gets the APCA contrast ratio between two colors.
 * @param a the first color
 * @param b the second color
 * @returns the contrast ratio
 */
/*#__NO_SIDE_EFFECTS__*/
export const getAPCAContrastRatio = (a: ColorValue, b: ColorValue): number => {
	const Ya = getAPCALuminance(a);
	const Yb = getAPCALuminance(b);

	let YaExp: number;
	let YbExp: number;

	if (Ya > Yb) {
		// Dark text on light background
		YaExp = Math.pow(Ya, 0.56);
		YbExp = Math.pow(Yb, 0.57);
	} else {
		// Light text on dark background
		YaExp = Math.pow(Ya, 0.65);
		YbExp = Math.pow(Yb, 0.62);
	}

	const cR = YaExp - YbExp;
	let Lc = cR * 1.14;

	if (Math.abs(Lc) < 0.1) {
		return 0;
	}

	if (Lc > 0) {
		Lc = (Lc - 0.027) * 100;
	} else {
		Lc = (Lc + 0.027) * 100;
	}

	return Lc;
};

/**
 * gets the WCAG recommended text color (black or white) for a given background color.
 * @param color the background color
 * @returns the recommended text color
 */
/*#__NO_SIDE_EFFECTS__*/
export const getWCAGTextColor = (color: ColorValue): ColorValue => {
	const w = castAsColor(0xffffffff);
	const b = castAsColor(0x000000ff);

	const wC = getWCAGContrastRatio(color, w);
	const bC = getWCAGContrastRatio(color, b);

	return wC >= bC ? w : b;
};

/**
 * gets the APCA recommended text color (black or white) for a given background color.
 * @param color the background color
 * @returns the recommended text color
 */
/*#__NO_SIDE_EFFECTS__*/
export const getAPCATextColor = (color: ColorValue): ColorValue => {
	const w = castAsColor(0xffffffff);
	const b = castAsColor(0x000000ff);

	const wC = getAPCAContrastRatio(color, w);
	const bC = getAPCAContrastRatio(color, b);

	return Math.abs(wC) > Math.abs(bC) ? w : b;
};
