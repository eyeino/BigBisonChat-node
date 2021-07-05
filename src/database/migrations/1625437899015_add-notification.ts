import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createFunction(
    'handle_new_message',
    [],
    { language: 'plpgsql' },
    `SELECT row_to_json(latest_row)::TEXT
    FROM (
        SELECT *
        FROM messages
        ORDER BY created_at DESC 
        LIMIT 1
    ) AS latest_row;

    NOTIFY notify_new_message, latest_row;
    RETURN NULL;
    `
  );
  pgm.createTrigger('messages', 'trigger_new_message', {
    when: 'AFTER',
    operation: 'INSERT',
    function: 'handle_new_message',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropFunction('handle_new_message', []);
  pgm.dropTrigger('messages', 'trigger_new_message');
}
