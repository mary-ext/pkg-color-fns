import { assertEquals, assertThrows } from '@std/assert';

import { fromInteger, fromRgbaHex } from './mod.ts';

Deno.test('fromInteger', async (t) => {
	await t.step('should convert to unsigned 32-bit integer', () => {
		const color = fromInteger(0xaabbccff);
		assertEquals(color, -1430532865);
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
