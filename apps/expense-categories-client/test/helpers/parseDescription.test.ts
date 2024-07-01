import assert from 'node:assert';
import { describe, it } from 'node:test';
import { parseDescription } from '../../src/helpers/parseDescription';

describe('parseDescription', () => {
  it('must correctly parse internal transfers and preserve the account number', () => {
    const description = 'House savings - Internal Transfer - Receipt 31241 Savings Maximiser 08123909124';
    const result = parseDescription(description);
    assert.equal(result, 'transfer <> savings maximiser 08123909124 - house savings');
  });

  it('must correctly parse other receipts', () => {
    const description = 'Salary - Receipt 31241 Savings Maximiser 08123909124';
    const result = parseDescription(description);
    assert.equal(result, 'salary');
  });

  it('must correctly parse visa transactions', () => {
    const description = 'Kebab House - Visa Purchase - Receipt 123451  Date 17 Jun 2023 Card 441xxxx013';
    const result = parseDescription(description);
    assert.equal(result, 'kebab house');
  });

  it('must correctly parse eftpos transactions', () => {
    const description = 'Kebab House - EFTPOS Purchase - Receipt 123451  Date 17 Jun 2023 Card 441xxxx013';
    const result = parseDescription(description);
    assert.equal(result, 'kebab house');
  });

  it('must correctly parse osko payments', () => {
    const description = 'Transfer to a mate - Osko Payment to 1234 212413 - Receipt 312141 ';
    const result = parseDescription(description);
    assert.equal(result, 'transfer to a mate');
  });

  it('must only convert to lowercase for descriptions that do not match', () => {
    const description = 'Kebab House 441xxxx013';
    const result = parseDescription(description);
    assert.equal(result, 'kebab house 441xxxx013');
  });
});
