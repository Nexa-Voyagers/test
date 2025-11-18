import { '${service}'Repository } from '../repositories/'${service}'.repository.js';
import { NotFoundError } from '../utils/errors.js';

class '${service^}'Service {
  async getAll(pharmacyId, filters) {
    return await '${service}'Repository.findAll(pharmacyId, filters);
  }

  async getById(id) {
    const result = await '${service}'Repository.findById(id);
    if (!result) throw new NotFoundError('${service^}');
    return result;
  }

  async create(data) {
    return await '${service}'Repository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    return await '${service}'Repository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    return await '${service}'Repository.delete(id);
  }
}

export const '${service}'Service = new '${service^}'Service();
