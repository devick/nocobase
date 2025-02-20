import { DEFAULT_PAGE, DEFAULT_PER_PAGE, utils } from '@nocobase/actions';

import Processor from '../Processor';
import { JOB_STATUS } from '../constants';
import type { FlowNodeModel } from '../types';
import { toJSON } from '../utils';

export default {
  async run(node: FlowNodeModel, input, processor: Processor) {
    const { collection, multiple, params = {}, failOnEmpty = false } = node.config;

    const repo = (<typeof FlowNodeModel>node.constructor).database.getRepository(collection);
    const {
      page = DEFAULT_PAGE,
      pageSize = DEFAULT_PER_PAGE,
      sort = [],
      ...options
    } = processor.getParsedValue(params, node.id);
    const appends = options.appends
      ? Array.from(
          options.appends.reduce((set, field) => {
            set.add(field.split('.')[0]);
            set.add(field);
            return set;
          }, new Set()),
        )
      : options.appends;
    const result = await (multiple ? repo.find : repo.findOne).call(repo, {
      ...options,
      ...utils.pageArgsToLimitArgs(page, pageSize),
      sort: sort
        .filter((item) => item.field)
        .map((item) => `${item.direction?.toLowerCase() === 'desc' ? '-' : ''}${item.field}`),
      appends,
      transaction: processor.transaction,
    });

    if (failOnEmpty && (multiple ? !result.length : !result)) {
      return {
        result,
        status: JOB_STATUS.FAILED,
      };
    }

    // NOTE: `toJSON()` to avoid getting undefined value from Proxied model instance (#380)
    // e.g. Object.prototype.hasOwnProperty.call(result, 'id') // false
    // so the properties can not be get by json-templates(object-path)
    return {
      result: toJSON(result),
      status: JOB_STATUS.RESOLVED,
    };
  },
};
