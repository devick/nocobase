import { Migration } from '@nocobase/server';
import { antd, compact, compactDark, dark } from '../builtinThemes';

export default class ThemeEditorMigration extends Migration {
  async up() {
    const result = await this.app.version.satisfies('<=0.14.0-alpha.7');

    if (!result) {
      return;
    }

    const themeRepo = this.db.getRepository('themeConfig');
    if (!themeRepo) {
      return;
    }

    themeRepo.collection.addField('uid', {
      type: 'string',
    });

    await this.db.sync();

    await themeRepo.update({
      filter: {
        'config.name': 'Default theme of antd',
      },
      values: {
        config: {
          name: 'Default',
        },
        uid: 'default',
      },
    });
    await themeRepo.update({
      filter: {
        'config.name': 'Dark',
      },
      values: {
        uid: 'dark',
      },
    });
    await themeRepo.update({
      filter: {
        'config.name': 'Compact',
      },
      values: {
        uid: 'compact',
      },
    });
    await themeRepo.update({
      filter: {
        'config.name': 'Compact dark',
      },
      values: {
        uid: 'compact_dark',
      },
    });

    if (
      !(await themeRepo.findOne({
        filter: {
          uid: 'default',
        },
      }))
    ) {
      await themeRepo.create({
        values: [antd],
      });
    }

    if (
      !(await themeRepo.findOne({
        filter: {
          uid: 'dark',
        },
      }))
    ) {
      await themeRepo.create({
        values: [dark],
      });
    }

    if (
      !(await themeRepo.findOne({
        filter: {
          uid: 'compact',
        },
      }))
    ) {
      await themeRepo.create({
        values: [compact],
      });
    }

    if (
      !(await themeRepo.findOne({
        filter: {
          uid: 'compact_dark',
        },
      }))
    ) {
      await themeRepo.create({
        values: [compactDark],
      });
    }
  }

  async down() {}
}
