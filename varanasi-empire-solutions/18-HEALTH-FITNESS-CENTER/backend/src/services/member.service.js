import { memberRepository } from '../repositories/member.repository.js';
export const memberService = {
  async create(data) { return memberRepository.create(data); },
  async getAll(filters) { return memberRepository.findAll(filters); },
  async getById(id) { return memberRepository.findById(id); },
  async update(id, data) { return memberRepository.update(id, data); },
  async delete(id) { return memberRepository.delete(id); }
};
