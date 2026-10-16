#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6e4375c86e9c1d3d4b35ec21225829dbc991e4ad43f853c21d95cf013dc9e95a/contract';
import endContract from '../../snapshots/6e4375c86e9c1d3d4b35ec21225829dbc991e4ad43f853c21d95cf013dc9e95a/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8d36132238726aae1af4bf91454d2c4708508bfb396ceb7e1a32a94d123606d4/contract';
import startContract from '../../snapshots/8d36132238726aae1af4bf91454d2c4708508bfb396ceb7e1a32a94d123606d4/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Balance',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('locked', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'OnRampTransaction',
        columns: [
          col('amount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('provider', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('token', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'OnRampTransaction_status_check_0dc68f5d',
            sql`"status" IN ('Success', 'Failure', 'Processing')`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Balance',
        constraint: 'Balance_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'OnRampTransaction',
        constraint: 'OnRampTransaction_token_key',
        columns: ['token'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'OnRampTransaction',
        index: 'OnRampTransaction_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Balance',
        foreignKey: {
          name: 'Balance_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'OnRampTransaction',
        foreignKey: {
          name: 'OnRampTransaction_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
