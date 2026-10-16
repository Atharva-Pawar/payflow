#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8d36132238726aae1af4bf91454d2c4708508bfb396ceb7e1a32a94d123606d4/contract';
import endContract from '../../snapshots/8d36132238726aae1af4bf91454d2c4708508bfb396ceb7e1a32a94d123606d4/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a62d15a094e80be7b342d75e0538935972b9699c76dabb5339940dd50d17a889/contract';
import startContract from '../../snapshots/a62d15a094e80be7b342d75e0538935972b9699c76dabb5339940dd50d17a889/contract.json' with { type: 'json' };
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
        table: 'Merchant',
        columns: [
          col('auth_type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Merchant_auth_type_check_0380e3da',
            sql`"auth_type" IN ('Google', 'Github')`,
          ),
        ],
      }),
      this.dropNotNull({ schema: 'public', table: 'User', column: 'email' }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'User',
        column: 'number',
        type: 'text',
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'User',
        column: 'password',
        type: 'text',
        temporaryDefault: sql`''`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'Merchant',
        constraint: 'Merchant_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_number_key',
        columns: ['number'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
