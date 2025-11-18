import { userRepository } from '../repositories/user.repository.js';
import { hashPassword } from '../utils/password.js';

class UserService {
  async getAllUsers(schoolId, filters) {
    return await userRepository.findAll(schoolId, filters);
  }

  async getUserById(id) {
    return await userRepository.findById(id);
  }

  async createUser(userData) {
    userData.password_hash = await hashPassword(userData.password);
    delete userData.password;
    return await userRepository.create(userData);
  }

  async updateUser(id, updateData) {
    return await userRepository.update(id, updateData);
  }

  async deleteUser(id) {
    return await userRepository.delete(id);
  }
}

export const userService = new UserService();
