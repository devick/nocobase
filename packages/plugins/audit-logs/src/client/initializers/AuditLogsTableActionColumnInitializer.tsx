import { InitializerWithSwitch } from '@nocobase/client';
import React from 'react';

export const AuditLogsTableActionColumnInitializer = (props) => {
  const schema = {
    type: 'void',
    title: '{{ t("Actions") }}',
    'x-decorator': 'TableV2.Column.ActionBar',
    'x-component': 'TableV2.Column',
    'x-designer': 'TableV2.ActionColumnDesigner',
    'x-initializer': 'AuditLogsTableActionColumnInitializers',
    'x-action-column': 'actions',
    properties: {
      actions: {
        type: 'void',
        'x-decorator': 'DndContext',
        'x-component': 'Space',
        'x-component-props': {
          split: '|',
        },
        properties: {},
      },
    },
  };
  return <InitializerWithSwitch {...props} schema={schema} type={'x-action-column'} />;
};
