/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const mockData = require('./mockdata.json');

exports.seed = async function(knex) {
    await knex('expenses').del();
    await knex('expenses').insert(mockData);
  };