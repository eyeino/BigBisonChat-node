import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createFunction(
    'handle_new_message',
    [],
    { language: 'plpgsql', returns: 'TRIGGER' },
    `BEGIN PERFORM pg_notify('new_message', NEW::TEXT); RETURN NULL; END;`
  );
  pgm.createTrigger('messages', 'trigger_new_message', {
    when: 'AFTER',
    operation: 'INSERT',
    function: 'handle_new_message',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger('messages', 'trigger_new_message');
  pgm.dropFunction('handle_new_message', []);
}
