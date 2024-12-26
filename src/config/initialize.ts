import { User } from '../models/user.entity';
import { AppDataSource } from './data-source';
import { encrypt } from '../helpers/helpers';

export const test = async () => {
  try {
    console.log("entered");
    
    const userRepository = AppDataSource.getRepository(User);
    
    const existingUser = await userRepository.count();
    console.log(existingUser);
    
    // Check if there are less than 1 admin, create the default ones
    if (existingUser < 1) {
      const encryptedPassword = await encrypt.encryptpass("admin123");
        const user = new User();
        user.username = "Youssef Magdich";
        user.email = "admin@gmail.com";
        user.password = encryptedPassword;
    
        await userRepository.save(user);
        console.log("created");
        
    }
    
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};